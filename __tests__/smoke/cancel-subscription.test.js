/**
 * Smoke Test: SUBSCRIPTION CANCELLATION REACHES STRIPE (period-end cancel)
 *
 * Regression for the owner-reported bug where cancelling in the app only wrote
 * a local `cancelled` flag and the REAL Stripe subscription kept renewing.
 *
 * FIX: `cancelSubscription({ userId })` now POSTs to api/cancel-subscription.js
 * (which schedules `cancel_at_period_end: true` on the customer's active Stripe
 * subscription), and `handleCancel` only marks the local status as cancelled
 * after Stripe confirms — persisting Stripe's REAL `current_period_end` as the
 * next billing date so the "remain active until end of period" notice is
 * truthful.
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  cancelSubscription,
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

describe('cancelSubscription — cancellation reaches Stripe', () => {
  beforeEach(() => {
    clearLocalStorage();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    clearLocalStorage();
  });

  it('POSTs { userId } to /api/cancel-subscription and returns the Stripe payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({
        status: 'active',
        nextBilling: '2026-09-28T00:00:00.000Z',
        cancelAtPeriodEnd: true,
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await cancelSubscription({ userId: 'user-123' });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe('/api/cancel-subscription');
    expect(init.method).toBe('POST');
    expect(init.headers).toEqual({ 'Content-Type': 'application/json' });
    expect(JSON.parse(init.body)).toEqual({ userId: 'user-123' });

    expect(result).toEqual({
      status: 'active',
      nextBilling: '2026-09-28T00:00:00.000Z',
      cancelAtPeriodEnd: true,
    });
  });

  it('throws a user-safe error (from the server body) on a non-OK response', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'No active subscription found to cancel.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(cancelSubscription({ userId: 'user-123' })).rejects.toThrow(
      'No active subscription found to cancel.'
    );
  });

  it('throws a fallback error when the server body has no message', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({}),
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(cancelSubscription({ userId: 'user-123' })).rejects.toThrow(
      'Cancellation failed (500)'
    );
  });

  it('throws a connection error when fetch itself rejects', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error('network down'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(cancelSubscription({ userId: 'user-123' })).rejects.toThrow(
      'Could not reach server. Check your connection and try again.'
    );
  });

  it('persists cancelled status + the REAL nextBilling (not a wiped date)', () => {
    // What handleCancel does after a successful Stripe confirm — it now keeps
    // the real end-of-period date instead of removing it.
    setSubscriptionData({
      status: 'cancelled',
      nextBilling: '2026-09-28T00:00:00.000Z',
    });

    const sub = getSubscriptionData();
    expect(sub.status).toBe('cancelled');
    expect(localStorage.getItem(SUBSCRIPTION_KEYS.STATUS)).toBe('cancelled');
    // The real Stripe date survives so the period-end notice stays truthful.
    expect(localStorage.getItem(SUBSCRIPTION_KEYS.NEXT_BILLING)).toBe('2026-09-28T00:00:00.000Z');
  });
});
