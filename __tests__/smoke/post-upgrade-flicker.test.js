/**
 * Smoke Test: POST-UPGRADE FLICKER (rapid render/state churn after Apple +
 * Family checkout)
 *
 * Root-cause class: immediately after a successful checkout the app writes the
 * premium flag + subscription keys and the `premium` bool flips. The premium-
 * confirmation poll in src/hooks/useAuthState.js previously re-ran whenever
 * `premium` changed, restarting a fresh 6-attempt profile poll + re-upsert on
 * each flip. Stacked on the sign-in wipe + two-way sync firing in the same
 * transition, that compounding churn re-rendered the whole screen so fast the
 * owner could not read anything (including subscription management).
 *
 * The fix session-keys that poll so it runs ONCE per auth session (not on every
 * premium flip). These tests lock the behavioral contract a flicker would
 * violate: after a just-upgraded user's state surfaces post-checkout, repeated
 * tier/sticky/status re-derivation must be STABLE — it never oscillates between
 * Free and Family, and the displayed status never drops from Active.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import {
  isStickyPaid,
  getTier,
  TIERS,
  resolveSubscriptionStatus,
  SUBSCRIPTION_PLAN_KEY,
  SUBSCRIPTION_STATUS_KEY,
  SUBSCRIPTION_INTERVAL_KEY,
} from '../../src/utils/tiering.js';
import { STORAGE_KEYS } from '../../src/utils/constants.js';

const PREMIUM_STATUS_KEY = STORAGE_KEYS.PREMIUM_STATUS;
const NEXT_BILLING_KEY = 'mtxtrkr_subscription_next_billing';

/**
 * Extract PROTECTED_KEYS from the real useSyncEngine.js so the wipe test mirrors
 * the actual ship-time allowlist (same technique as the gate and post-auth test).
 */
function extractProtectedKeys() {
  const src = readFileSync(resolve(__dirname, '../../src/hooks/useSyncEngine.js'), 'utf-8');
  const match = src.match(/const PROTECTED_KEYS = \[([\s\S]*?)\];/);
  if (!match) return [];
  const keys = [];
  for (const line of match[1].split('\n')) {
    const trimmed = line.trim();
    if (trimmed.startsWith('//')) continue;
    const m = line.match(/'([^']+)'/);
    if (m) keys.push(m[1]);
  }
  return keys;
}

/** Mirror the real auth-change wipe (remove mtxtrkr_/supabase_cache_ except PROTECTED). */
function simulateAuthChangeWipe(protectedKeys) {
  for (let i = localStorage.length - 1; i >= 0; i--) {
    const key = localStorage.key(i);
    if (
      key &&
      (key.startsWith('mtxtrkr_') || key.startsWith('supabase_cache_')) &&
      !protectedKeys.includes(key)
    ) {
      localStorage.removeItem(key);
    }
  }
}

function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
  keys.forEach((k) => localStorage.removeItem(k));
}

describe('Post-Upgrade Flicker (stable premium/tier after Apple + Family checkout)', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.clearAllMocks();
  });

  it('A just-upgraded (Family) user stays Family + sticky-paid across many re-derivations — no Free/Family oscillation', () => {
    // Just after checkout the app writes these (payment_success/tier/interval).
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
    localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
    localStorage.setItem(SUBSCRIPTION_INTERVAL_KEY, 'monthly');
    localStorage.setItem(NEXT_BILLING_KEY, '2026-09-25');

    // The sign-in auth-reset wipe runs and (thanks to #323) keeps the plan/status.
    simulateAuthChangeWipe(extractProtectedKeys());

    // Simulate many renders / effect ticks right after upgrade. If anything made
    // premium/tier oscillate this would catch Free ↔ Family flapping.
    let lastTier = null;
    let lastSticky = null;
    for (let i = 0; i < 200; i++) {
      const sticky = isStickyPaid();
      const tier = getTier({ isPremium: sticky });
      if (i === 0) {
        lastTier = tier.id;
        lastSticky = sticky;
      }
      // The gate cannot degrade a paid marker introduced in this session.
      expect(tier.id).toBe(lastTier);
      expect(sticky).toBe(lastSticky);
    }
    expect(lastTier).toBe(TIERS.FAMILY.id);
    expect(lastSticky).toBe(true);
  });

  it('Displayed status stays Active across repeated post-upgrade reads (never drops to Cancelled)', () => {
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
    localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
    simulateAuthChangeWipe(extractProtectedKeys());

    for (let i = 0; i < 200; i++) {
      expect(isStickyPaid()).toBe(true);
      // resolveSubscriptionStatus mirrors what SubscriptionManagement renders.
      expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: localStorage.getItem(SUBSCRIPTION_STATUS_KEY) }))
        .toBe('active');
    }
  });

  it('A missing stored status never reads as Cancelled for a premium user (post-checkout keys settle async)', () => {
    // Worst flicker case: premium_flag set but the subscription keys not yet
    // flushed (post-checkout async order) — must still read ACTIVE, not flap.
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
    for (let i = 0; i < 200; i++) {
      expect(isStickyPaid()).toBe(true);
      expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: null })).toBe('active');
      expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: undefined })).toBe('active');
    }
  });

  it('Explicit cancellation still wins (fix does not mask a real cancel)', () => {
    // A user who cancelled keeps their premium flag + access until the end of the
    // billing period, so sticky-paid correctly remains true. The important
    // contract is that the DISPLAYED status is 'cancelled' (never masked back to
    // Active), so the UI shows the cancellation state instead of flapping.
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
    localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'cancelled');
    expect(isStickyPaid()).toBe(true); // access retained until period end
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: 'cancelled' })).toBe('cancelled');
  });
});
