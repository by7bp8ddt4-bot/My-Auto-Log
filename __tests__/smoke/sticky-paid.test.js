/**
 * Smoke Test: STICKY PAID behavior (premium-upgrade-loop fix)
 *
 * Regression test for the premium-upgrade loop. A grant of premium is made
 * durably server-side by the Stripe webhook, but a brand-new load (new tab,
 * browser reopen, Capacitor iOS webview) historically started from a browser-
 * local flag that could be missing/reset — so the app read premium=false and
 * bounced a paying customer back to the paywall.
 *
 * The fix makes the paid status STICKY: it is derived from EITHER the app-wide
 * premium flag (`mtxtrkr_premium_status === 'true'`) OR an active/trialing
 * subscription plan+status. These tests exercise the REAL helpers from
 * src/utils/tiering.js (isStickyPaid, getTier, canAddVehicle) under a
 * simulated reload / profile-null read.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  isStickyPaid,
  getTier,
  canAddVehicle,
  TIERS,
  SUBSCRIPTION_PLAN_KEY,
  SUBSCRIPTION_STATUS_KEY,
} from '../../src/utils/tiering.js';
import { STORAGE_KEYS } from '../../src/utils/constants.js';

// Mirrors the keys used by the app so the test exercises the real storage.
const PREMIUM_STATUS_KEY = STORAGE_KEYS.PREMIUM_STATUS;

function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
  keys.forEach((k) => localStorage.removeItem(k));
}

describe('Sticky Paid (premium-upgrade-loop fix)', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.clearAllMocks();
  });

  describe('isStickyPaid()', () => {
    it('is paid when the app-wide premium flag is true', () => {
      localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
      expect(isStickyPaid()).toBe(true);
    });

    it('is paid when the premium flag is reset but an ACTIVE plan survives the reload', () => {
      // Simulate a fresh load / profile-null read where the premium flag is
      // missing (or false) but the subscription plan+status are still present.
      localStorage.setItem(PREMIUM_STATUS_KEY, 'false');
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
      expect(isStickyPaid()).toBe(true);
    });

    it('is paid when the premium flag is entirely absent but plan is active', () => {
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'fleet');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
      expect(isStickyPaid()).toBe(true);
    });

    it('is paid for a trialing plan too', () => {
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'trialing');
      expect(isStickyPaid()).toBe(true);
    });

    it('is NOT paid when the plan exists but the status is cancelled', () => {
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'cancelled');
      expect(isStickyPaid()).toBe(false);
    });

    it('is NOT paid when nothing is stored', () => {
      expect(isStickyPaid()).toBe(false);
    });
  });

  describe('Survives a simulated reload / profile-null read', () => {
    it('a paid user with an active plan is NOT downgraded to the paywall', () => {
      // Profile query returned null (fresh load) and the premium flag is
      // false — but a plan+active status survive. Paired with useAuthState's
      // never-downgrade re-upsert, the user stays paid.
      localStorage.setItem(PREMIUM_STATUS_KEY, 'false');
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');

      expect(isStickyPaid()).toBe(true);

      // Tier must not collapse to Free (which is what triggered the paywall).
      const tier = getTier({ isPremium: isStickyPaid() });
      expect(tier.id).toBe(TIERS.FAMILY.id);

      // A 2nd vehicle must be allowed (Free caps at 1 → would bounce to paywall).
      const existing = [{ id: 'v1', type: 'car' }];
      const gate = canAddVehicle(tier.id, existing, 'car');
      expect(gate.allowed).toBe(true);
      expect(gate.reason).toBeNull();
    });

    it('a sticky-paid user may add a non-automotive type (no paywall bounce)', () => {
      // Free users are blocked from non-automotive; a sticky-paid Family user
      // must be allowed (the addVehicle gate is what setPage('premium') the bug).
      localStorage.setItem(PREMIUM_STATUS_KEY, 'false');
      localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
      localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');

      const tier = getTier({ isPremium: isStickyPaid() });
      const gate = canAddVehicle(tier.id, [], 'motorcycle');
      expect(gate.allowed).toBe(true);
      expect(gate.reason).toBeNull();
    });

    it('an un-marked user IS still gated to the paywall when over the free limit', () => {
      // Sanity check: the fix must NOT unlock everyone — truly free users with
      // no marker are still gated.
      const existing = [{ id: 'v1', type: 'car' }];
      const tier = getTier({ isPremium: isStickyPaid() }); // false → Free
      expect(tier.id).toBe(TIERS.FREE.id);
      const gate = canAddVehicle(tier.id, existing, 'car'); // 2nd car, free limit 1
      expect(gate.allowed).toBe(false);
      expect(gate.reason).toBe('limit');
    });
  });
});
