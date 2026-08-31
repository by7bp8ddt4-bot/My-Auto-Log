/**
 * Smoke Test: PREMIUM CROSS-ACCOUNT LEAK (account-scoped sticky marker)
 *
 * Regression for the owner-reported bug where a brand-new account (e.g. Apple
 * "Get Started Free") showed as "Active Family" with no payment ever processed.
 *
 * ROOT CAUSE: `mtxtrkr_premium_status` was device-global and never cleared on
 * sign-out, so a paid account's marker leaked into the next account that signed
 * in on the same device; useAuthState then upserted profiles.premium=true for
 * the new account.
 *
 * FIX: the premium flag is now stamped with the owning userId
 * (`mtxtrkr_premium_owner`); `isStickyPaid(userId)` only honors the flag for
 * its owner; the marker is cleared on sign-out; and useAuthState never writes
 * premium=true to a profile from a stale device marker.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { isStickyPaid, setPremiumFlag, clearPremiumFlag, PREMIUM_OWNER_KEY } from '../../src/utils/tiering.js';
import { STORAGE_KEYS } from '../../src/utils/constants.js';
import useAuthState from '../../src/hooks/useAuthState.js';

const PREMIUM_STATUS_KEY = STORAGE_KEYS.PREMIUM_STATUS;

function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
  keys.forEach((k) => localStorage.removeItem(k));
}

// ── Hook-level mocks (mirrors post-upgrade-flicker.test.js) ──
const mockState = vi.hoisted(() => ({
  selectCount: 0,
  upsertCount: 0,
  dbPremium: null,
  auth: {
    user: null,
    session: null,
    loading: true,
    isRecovery: false,
    authError: null,
    clearAuthError: () => {},
    clearRecovery: () => {},
    signUp: () => {},
    signIn: () => {},
    signInWithGoogle: () => {},
    signInWithApple: () => {},
    signOut: () => {},
    resetPassword: () => {},
    updatePassword: () => {},
    checkPremium: () => {},
    setPremiumStatus: () => {},
  },
}));

vi.mock('../../src/hooks/useSupabaseData.js', () => ({
  useSupabaseAuth: () => mockState.auth,
}));

vi.mock('../../src/lib/supabase.js', () => ({
  supabase: {
    from: (table) => {
      if (table === 'profiles') {
        return {
          select: () => ({
            eq: () => ({
              maybeSingle: async () => {
                mockState.selectCount += 1;
                return { data: { premium: mockState.dbPremium }, error: null };
              },
            }),
          }),
          upsert: async () => {
            mockState.upsertCount += 1;
            return { error: null };
          },
        };
      }
      return {
        select: () => ({ eq: () => ({ maybeSingle: async () => ({ data: null, error: null }) }) }),
        upsert: async () => ({ error: null }),
      };
    },
  },
}));

vi.mock('../../src/components/SubscriptionManagement.jsx', () => ({
  setSubscriptionData: () => {},
  clearSubscriptionData: () => {},
}));

function setSignedIn(userId) {
  mockState.auth.user = { id: userId, email: `${userId}@mtxtrkr.test` };
  mockState.auth.loading = false;
}

async function flushPoll() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

let view;

describe('Premium cross-account leak (account-scoped sticky marker)', () => {
  beforeEach(() => {
    clearLocalStorage();
    mockState.selectCount = 0;
    mockState.upsertCount = 0;
    mockState.dbPremium = null;
    mockState.auth.user = null;
    mockState.auth.loading = true;
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
  });

  afterEach(() => {
    if (view) {
      view.unmount();
      view = null;
    }
    vi.useRealTimers();
    clearLocalStorage();
  });

  describe('isStickyPaid(userId) scoping', () => {
    it('honors the flag for its owner, but never for a different account', () => {
      setPremiumFlag('user-a');

      // Owner is honored; a different account is NOT (the leak is closed).
      expect(isStickyPaid('user-a')).toBe(true);
      expect(isStickyPaid('user-b')).toBe(false);
      // Unknown user (initial mount before the session resolves) still honored
      // so a returning paid user is not bounced to the paywall.
      expect(isStickyPaid(null)).toBe(true);
    });

    it('a legacy ownerless marker is still honored (backward compatible)', () => {
      localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
      expect(isStickyPaid('user-b')).toBe(true);
      expect(isStickyPaid()).toBe(true);
    });

    it('setPremiumFlag records the owner and clearPremiumFlag removes both', () => {
      setPremiumFlag('user-a');
      expect(localStorage.getItem(PREMIUM_STATUS_KEY)).toBe('true');
      expect(localStorage.getItem(PREMIUM_OWNER_KEY)).toBe('user-a');

      clearPremiumFlag();
      expect(localStorage.getItem(PREMIUM_STATUS_KEY)).toBeNull();
      expect(localStorage.getItem(PREMIUM_OWNER_KEY)).toBeNull();
      expect(isStickyPaid('user-a')).toBe(false);
    });
  });

  describe('useAuthState reconciliation (stale marker → different account)', () => {
    it('a new account inheriting another account\u2019s stale marker is reset to Free and never writes premium=true to the DB', async () => {
      // A paid account A left a scoped marker on this device.
      setPremiumFlag('user-a');
      // A different, brand-new account B signs in (server says NOT paid).
      mockState.dbPremium = false;
      setSignedIn('user-b');

      view = renderHook(() => useAuthState());

      // The poll runs (1 attempt → server false) and no profile upsert fires.
      await flushPoll();
      expect(mockState.selectCount).toBe(1);
      expect(mockState.upsertCount).toBe(0); // THE BUG: would have been ≥1

      // B is reconciled to Free, not Active Family.
      expect(view.result.current.premium).toBe(false);
    });

    it('the owner account still keeps its premium on a fresh load (no-flicker)', async () => {
      setPremiumFlag('user-a');
      mockState.dbPremium = true; // server confirms A is paid
      setSignedIn('user-a');

      view = renderHook(() => useAuthState());
      // Seeded paid from the scoped sticky marker before the poll completes.
      expect(view.result.current.premium).toBe(true);

      await flushPoll();
      expect(mockState.selectCount).toBe(1);
      expect(view.result.current.premium).toBe(true);
    });
  });
});
