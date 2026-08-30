/**
 * Smoke Test: POST-UPGRADE FLICKER (premium-confirmation poll restart storm)
 *
 * Regression for the post-upgrade rapid re-render / subscription-state
 * oscillation ("the flicker").
 *
 * ROOT CAUSE (see /home/team/shared/stripe-signup-audit.md, "Symptom B"):
 * src/hooks/useAuthState.js ran a 6-attempt premium-confirmation poll whose
 * useEffect dependency array included `premium`. Every `setPremium(true)` flip
 * (right after a successful checkout/upgrade) tore down + restarted the poll
 * AND fired an extra `persistPremiumBackup` profiles upsert. Combined with
 * App.jsx re-deriving the tier from localStorage each render, that produced a
 * rapid re-render + write storm.
 *
 * FIX: (1) key the poll to the signed-in user id (identity), NOT `premium`,
 * with a ref guard so it runs once per session and never re-enters for a
 * mid-session premium flip; (2) reset the guard on sign-out so the next
 * sign-in re-verifies; (3) dedupe `persistPremiumBackup` with an in-flight
 * ref so concurrent calls don't stack `profiles` upserts.
 *
 * CRITICAL REGRESSION GUARD (vs. reverted PR #324): the guard must NEVER gate
 * auth *before* the poll actually starts/completes. These tests render the
 * REAL hook and assert that (a) the poll RUNS and COMPLETES on every fresh
 * sign-in, (b) a mid-session premium write does NOT restart it, and (c) sign-in
 * still proceeds (isAuthenticated && !loading — the App.jsx redirect condition),
 * so the #324 "sign-in/sign-up redirected back to landing" failure cannot recur.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import useAuthState from '../../src/hooks/useAuthState.js';
import {
  isStickyPaid,
  getTier,
  resolveSubscriptionStatus,
  TIERS,
  SUBSCRIPTION_PLAN_KEY,
  SUBSCRIPTION_STATUS_KEY,
} from '../../src/utils/tiering.js';
import { STORAGE_KEYS } from '../../src/utils/constants.js';

// ── Shared mock state (hoisted so the vi.mock factories can read it) ──
const mockState = vi.hoisted(() => ({
  selectCount: 0, // number of profiles.premium SELECT queries (poll attempts)
  upsertCount: 0, // number of profiles upserts (persistPremiumBackup writes)
  dbPremium: null, // what the mock DB returns for profiles.premium
  subscriptionDataCalls: [], // payloads passed to setSubscriptionData()
  clearSubscriptionDataCalls: 0,
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

// ── Mocks ──────────────────────────────────────────────────────────
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
  setSubscriptionData: (payload) => { mockState.subscriptionDataCalls.push(payload); },
  clearSubscriptionData: () => { mockState.clearSubscriptionDataCalls += 1; },
}));

// ── Helpers ────────────────────────────────────────────────────────
function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
  keys.forEach((k) => localStorage.removeItem(k));
}

function setSignedIn(userId) {
  mockState.auth.user = { id: userId, email: `${userId}@mtxtrkr.test` };
  mockState.auth.loading = false;
}

function setSignedOut() {
  mockState.auth.user = null;
  mockState.auth.loading = false;
}

/** Flush the poll's fake setTimeout delays + microtasks. */
async function flushPoll() {
  await act(async () => {
    await vi.runAllTimersAsync();
  });
}

let view; // renderHook handle, unmounted in afterEach

// ── Tests ──────────────────────────────────────────────────────────
describe('Post-Upgrade Flicker (poll keyed to identity, never premium)', () => {
  beforeEach(() => {
    clearLocalStorage();
    mockState.selectCount = 0;
    mockState.upsertCount = 0;
    mockState.dbPremium = null;
    mockState.subscriptionDataCalls = [];
    mockState.clearSubscriptionDataCalls = 0;
    mockState.auth.user = null;
    mockState.auth.loading = true;
    mockState.auth.isRecovery = false;
    mockState.auth.authError = null;
    // Fake ONLY setTimeout/clearTimeout (the poll delays). React's scheduler
    // (MessageChannel) and act stay real so renderHook behaves normally.
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

  it('runs the poll to completion on fresh sign-in, applies the grant, and keeps sign-in proceeding', async () => {
    mockState.dbPremium = true; // DB already has premium → poll breaks on attempt 1
    setSignedIn('user-1');

    view = renderHook(() => useAuthState());

    // Sign-in still proceeds: authenticated + not loading is exactly the
    // App.jsx auto-redirect precondition (isAuthenticated && !auth.loading).
    // This must hold regardless of premium state — the #324 regression.
    expect(view.result.current.isAuthenticated).toBe(true);
    expect(view.result.current.loading).toBe(false);

    await flushPoll();

    // The poll ran (1 attempt) AND completed: the DB grant was applied to
    // React state + subscription data.
    expect(mockState.selectCount).toBe(1);
    expect(view.result.current.premium).toBe(true);
    expect(mockState.subscriptionDataCalls).toEqual([
      { plan: 'family', status: 'active', nextBilling: null },
    ]);
  });

  it('a mid-session setPremium(true) does NOT restart the poll and does NOT fire extra profile upserts', async () => {
    mockState.dbPremium = false; // DB says free → poll breaks on attempt 1
    setSignedIn('user-1');

    view = renderHook(() => useAuthState());
    await flushPoll();

    // One completed poll, zero persist writes (user is genuinely free).
    expect(mockState.selectCount).toBe(1);
    expect(mockState.upsertCount).toBe(0);

    // The post-upgrade premium flip (App.jsx payment_success / handleUpgrade).
    act(() => {
      view.result.current.setPremium(true);
    });
    expect(view.result.current.premium).toBe(true);

    await flushPoll();

    // THE BUG (premium in deps): this flip would tear down + restart the poll
    // (selectCount → 2) and fire persistPremiumBackup (upsertCount → ≥1).
    // THE FIX: still exactly one poll, zero extra upserts.
    expect(mockState.selectCount).toBe(1);
    expect(mockState.upsertCount).toBe(0);
  });

  it('sign-out resets the poll guard so the next sign-in re-verifies (even the same user id)', async () => {
    mockState.dbPremium = false;
    setSignedIn('user-1');

    view = renderHook(() => useAuthState());
    await flushPoll();
    expect(mockState.selectCount).toBe(1);

    // Sign out → guard must reset.
    act(() => {
      setSignedOut();
      view.rerender();
    });
    await flushPoll();
    expect(mockState.selectCount).toBe(1); // no poll while signed out

    // Sign back in as the SAME user → a fresh session must re-run the poll.
    act(() => {
      setSignedIn('user-1');
      view.rerender();
    });
    await flushPoll();
    expect(mockState.selectCount).toBe(2); // poll re-ran (guard was reset)
    expect(view.result.current.isAuthenticated).toBe(true);
  });

  it('tier/status stay stable across repeated post-upgrade re-derivations (no Free↔Family oscillation, never "Cancelled")', () => {
    // Just after checkout the app writes these (payment_success/tier/interval).
    localStorage.setItem(STORAGE_KEYS.PREMIUM_STATUS, 'true');
    localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');

    // Simulate many renders / effect ticks right after upgrade. If premium/tier
    // oscillated (Free ↔ Family) or status flapped to Cancelled, this catches it.
    let lastTier = null;
    let lastSticky = null;
    for (let i = 0; i < 200; i += 1) {
      const sticky = isStickyPaid();
      const tier = getTier({ isPremium: sticky });
      const status = resolveSubscriptionStatus({
        isPremium: sticky,
        storedStatus: localStorage.getItem(SUBSCRIPTION_STATUS_KEY),
      });

      if (i === 0) {
        lastTier = tier.id;
        lastSticky = sticky;
      }
      expect(tier.id).toBe(lastTier);
      expect(sticky).toBe(lastSticky);
      expect(status).toBe('active');
    }
    expect(lastTier).toBe(TIERS.FAMILY.id);
    expect(lastSticky).toBe(true);
  });
});
