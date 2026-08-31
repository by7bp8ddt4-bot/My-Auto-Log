/**
 * Smoke Test: truthful next-billing date (real Stripe date vs. computed guess).
 *
 * Covers the `estimateNextBilling` helper in
 * src/components/SubscriptionManagement.jsx — the return shape changed from a
 * bare date string to `{ date, isEstimate }` so the UI can label a computed
 * guess "Estimated" instead of presenting it as fact.
 *
 *   - A stored NEXT_BILLING value (written from Stripe's real
 *     current_period_end) → isEstimate: false.
 *   - No stored value → today + interval guess → isEstimate: true.
 *   - Non-active status → null (no date shown).
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { estimateNextBilling } from '../../src/components/SubscriptionManagement.jsx';

const NEXT_BILLING_KEY = 'mtxtrkr_subscription_next_billing';

function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) {
    keys.push(localStorage.key(i));
  }
  keys.forEach((k) => localStorage.removeItem(k));
}

describe('estimateNextBilling — truthful date sourcing', () => {
  beforeEach(() => {
    clearLocalStorage();
  });

  afterEach(() => {
    clearLocalStorage();
  });

  it('returns isEstimate=false when a stored (real Stripe) date exists', () => {
    localStorage.setItem(NEXT_BILLING_KEY, '2026-12-25T00:00:00.000Z');
    const result = estimateNextBilling('active', 'monthly');
    expect(result).toEqual({ date: '2026-12-25T00:00:00.000Z', isEstimate: false });
  });

  it('returns the stored date unchanged as the date field', () => {
    localStorage.setItem(NEXT_BILLING_KEY, '2027-07-20T12:34:56.000Z');
    const result = estimateNextBilling('active', 'yearly');
    expect(result.date).toBe('2027-07-20T12:34:56.000Z');
    expect(result.isEstimate).toBe(false);
  });

  it('returns isEstimate=true with a ~1-month guess for monthly when nothing is stored', () => {
    const today = new Date();
    const result = estimateNextBilling('active', 'monthly');
    expect(result.isEstimate).toBe(true);
    expect(typeof result.date).toBe('string');
    const guessed = new Date(result.date);
    const diffDays = Math.round((guessed - today) / 86400000);
    expect(diffDays).toBeGreaterThanOrEqual(28);
    expect(diffDays).toBeLessThanOrEqual(32);
  });

  it('returns isEstimate=true with a ~1-year guess for yearly when nothing is stored', () => {
    const today = new Date();
    const result = estimateNextBilling('active', 'yearly');
    expect(result.isEstimate).toBe(true);
    expect(typeof result.date).toBe('string');
    const guessed = new Date(result.date);
    const diffDays = Math.round((guessed - today) / 86400000);
    expect(diffDays).toBeGreaterThanOrEqual(363);
    expect(diffDays).toBeLessThanOrEqual(367);
  });

  it('returns null for non-active status even when a stored date exists', () => {
    localStorage.setItem(NEXT_BILLING_KEY, '2026-08-01');
    expect(estimateNextBilling('cancelled', 'monthly')).toBeNull();
  });
});
