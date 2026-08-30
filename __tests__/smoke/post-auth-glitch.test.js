/**
 * Smoke Test: POST-AUTH GLITCH (subscription "Cancelled" + paid-user wipe)
 *
 * Regression for the owner-reported post-sign-in glitch.
 *
 * ROOT CAUSE reproduced: on sign-in (auth change / session restore), the
 * auth-reset wipe in src/hooks/useSyncEngine.js removed the subscription keys
 * (mtxtrkr_subscription_plan/status/interval/next_billing) because they were
 * NOT in PROTECTED_KEYS. A genuinely-paid user's own subscription status was
 * destroyed on their own sign-in → the subscription UI rendered "Cancelled"
 * (any status !== 'active' renders as Cancelled, including a missing/null
 * status) and the plan/tier flickered.
 *
 * FIX: (1) protect the four subscription keys in the wipe, and (2) a premium
 * user's displayed status defaults to 'active' unless explicitly cancelled.
 *
 * These tests exercise the REAL helpers from src/utils/tiering.js and mirror
 * the real wipe logic (PROTECTED_KEYS extracted from useSyncEngine.js).
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
const SUBSCRIPTION_KEYS = [
  SUBSCRIPTION_PLAN_KEY,
  SUBSCRIPTION_STATUS_KEY,
  SUBSCRIPTION_INTERVAL_KEY,
  NEXT_BILLING_KEY,
];

/**
 * Extract PROTECTED_KEYS from the real useSyncEngine.js so the test always
 * mirrors the actual ship-time wipe allowlist (same technique as the gate).
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

/** Mirror the real auth-change wipe (remove mtxtrkr_ and supabase_cache_ prefixed keys except PROTECTED). */
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

describe('Post-Auth Glitch (paid subscription wiped on sign-in)', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.clearAllMocks();
  });

  it('A paid user returning on a fresh load keeps their active plan/status after the sign-in wipe', () => {
    // Real wipe allowlist from useSyncEngine.js
    const protectedKeys = extractProtectedKeys();
    expect(protectedKeys).toContain(SUBSCRIPTION_STATUS_KEY);
    expect(protectedKeys).toContain(SUBSCRIPTION_PLAN_KEY);
    expect(protectedKeys).toContain(SUBSCRIPTION_INTERVAL_KEY);
    expect(protectedKeys).toContain(NEXT_BILLING_KEY);

    // The returning paid user's persisted state (what a paid user has on disk)
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');
    localStorage.setItem(SUBSCRIPTION_PLAN_KEY, 'family');
    localStorage.setItem(SUBSCRIPTION_STATUS_KEY, 'active');
    localStorage.setItem(SUBSCRIPTION_INTERVAL_KEY, 'monthly');
    localStorage.setItem(NEXT_BILLING_KEY, '2026-09-25');

    // Sign-in fires the auth-reset wipe
    simulateAuthChangeWipe(protectedKeys);

    // THE BUG: these were wiped (null) → subscription showed "Cancelled".
    // THE FIX: they survive the user's OWN sign-in.
    expect(localStorage.getItem(SUBSCRIPTION_STATUS_KEY)).toBe('active');
    expect(localStorage.getItem(SUBSCRIPTION_PLAN_KEY)).toBe('family');
    expect(localStorage.getItem(SUBSCRIPTION_INTERVAL_KEY)).toBe('monthly');
    expect(localStorage.getItem(NEXT_BILLING_KEY)).toBe('2026-09-25');

    // Tier stays Family, sticky-paid stays true — no paywall bounce.
    expect(isStickyPaid()).toBe(true);
    expect(getTier({ isPremium: isStickyPaid() }).id).toBe(TIERS.FAMILY.id);
  });

  it('Prevents the misleading "Cancelled" for a premium user whose stored status is null/missing', () => {
    // Legacy premium-only account (no plan/status keys ever), or a device whose
    // keys were wiped by an OLD session before this fix landed.
    localStorage.setItem(PREMIUM_STATUS_KEY, 'true');

    // Premium is true; tier Family; but stored status is null.
    expect(isStickyPaid()).toBe(true);
    expect(getTier({ isPremium: isStickyPaid() }).id).toBe(TIERS.FAMILY.id);

    // THE BUG: status was rendered as "Cancelled".
    // THE FIX: a premium user with no explicit status shows as ACTIVE.
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: null })).toBe('active');
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: undefined })).toBe('active');
  });

  it('STILL honours an explicit cancellation (only true cancellations say Cancelled)', () => {
    // Explicit cancel via the UI writes status='cancelled'
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: 'cancelled' })).toBe('cancelled');
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: 'active', explicitlyCancelled: true })).toBe('cancelled');
    // A paying user with an active status stays active
    expect(resolveSubscriptionStatus({ isPremium: true, storedStatus: 'active' })).toBe('active');
  });

  it('A free, unmarked user stays Free (the fix does NOT unlock everyone)', () => {
    expect(isStickyPaid()).toBe(false);
    expect(getTier({ isPremium: isStickyPaid() }).id).toBe(TIERS.FREE.id);
    // No stored status, not premium → null (no invented state)
    expect(resolveSubscriptionStatus({ isPremium: false, storedStatus: null })).toBeNull();
  });
});
