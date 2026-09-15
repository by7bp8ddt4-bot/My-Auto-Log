/**
 * Smoke Test: SUBSCRIPTION REACTIVATION UN-CANCELS IN PLACE (no double charge)
 *
 * Regression for the double-charge bug where `handleReactivate` always called
 * `startTierCheckout(...)` → a brand-new Stripe Checkout Session → a SECOND
 * subscription while the period-end-cancelled one was still active-to-period-end
 * (already paid), overlapping two subscriptions for the overlap window and
 * overwriting `profiles.stripe_customer_id` (orphaning the first subscription).
 *
 * FIX: `reactivateSubscription({ userId })` now POSTs to
 * api/reactivate-subscription.js, which UN-cancels the customer's existing
 * active subscription in place (`cancel_at_period_end: false`) instead of
 * creating a new one. `handleReactivate` only falls back to a fresh Checkout
 * Session when the endpoint returns `{ reactivated: false }` (nothing to
 * un-cancel) or the reactivate call itself fails.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  reactivateSubscription,
  setSubscriptionData,
  getSubscriptionData,
} from '../../src/components/SubscriptionManagement.jsx';

const SUBSCRIPTION_KEYS = {
  PLAN: 'mtxtrkr_subscription_plan',
  STATUS: 'mtxtrkr_subscription_status',
  NEXT_BILLING: 'mtxtrkr_subscription_next_billing',
  INTERVAL: 'mtxtrkr_subscription_interval',
};

function clearLocalStorage() {
  const keys = [];
  for (let i = 0; i < localStorage.length; i++) keys.push(localStorage.key(i));
  keys.forEach((k) => localStorage.removeItem(k));
}

describe('reactivateSubscription — un-cancel in place (no new checkout)', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearLocalStorage();
  });

  it('POSTs { userId } to /api/reactivate-subscription and returns the resumed payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        reactivated: true,
        status: 'active',
        nextBilling: '2026-09-28T00:00:00.000Z',
        cancelAtPeriodEnd: false,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await reactivateSubscription({ userId: 'user-123' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/reactivate-subscription');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ userId: 'user-123' });

    expect(result).toEqual({
      reactivated: true,
      status: 'active',
      nextBilling: '2026-09-28T00:00:00.000Z',
      cancelAtPeriodEnd: false,
    });
  });

  it('returns { reactivated: false } (NOT an error) when there is nothing to un-cancel', async () => {
    // The endpoint answers HTTP 200 { reactivated: false } for: no Stripe
    // customer, no active subscription, or active sub not cancel_at_period_end.
    // The helper must NOT throw — the caller falls back to a fresh checkout.
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ reactivated: false }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await reactivateSubscription({ userId: 'user-123' });

    expect(result).toEqual({ reactivated: false });
    expect(result.reactivated).toBe(false);
  });

  it('throws a user-safe error (from the server body) on a non-OK response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Error reactivating subscription' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(reactivateSubscription({ userId: 'user-123' })).rejects.toThrow(
      'Error reactivating subscription'
    );
  });

  it('throws a fallback error when the server body has no message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(reactivateSubscription({ userId: 'user-123' })).rejects.toThrow(
      'Reactivation failed (500)'
    );
  });

  it('throws a connection error when fetch itself rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(reactivateSubscription({ userId: 'user-123' })).rejects.toThrow(
      'Could not reach server. Check your connection and try again.'
    );
  });

  it('persists the resumed active status + REAL nextBilling (what handleReactivate does)', () => {
    // What handleReactivate does after a successful in-place un-cancel — it
    // flips the local status back to active and keeps Stripe's real
    // current_period_end so the next-billing display stays truthful.
    setSubscriptionData({
      status: 'active',
      nextBilling: '2026-09-28T00:00:00.000Z',
    });

    const sub = getSubscriptionData();
    expect(sub.status).toBe('active');
    expect(localStorage.getItem(SUBSCRIPTION_KEYS.STATUS)).toBe('active');
    expect(localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING)).toBe('2026-09-28T00:00:00.000Z');
  });
});
