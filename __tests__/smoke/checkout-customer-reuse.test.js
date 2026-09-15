/**
 * Smoke Test: Checkout Session reuses an existing Stripe Customer.
 *
 * Regression for the checkout gap where api/create-checkout-session.js created
 * every Checkout Session WITHOUT a `customer` id — so Stripe minted a
 * brand-new Customer on each checkout and the webhook overwrote
 * `profiles.stripe_customer_id` with the new id, orphan-dropping the previous
 * duplicate Customer records on every repeat subscription.
 *
 * Covers src/utils/checkoutCustomer.js — the pure, SDK-free decision logic the
 * API handler uses:
 *   - checkoutCustomerField(id) → {} (omit customer → Stripe creates a new one)
 *     when the id is null/empty; { customer: id } otherwise.
 *   - isUsableCustomer(customer) → false for a deleted `{ deleted: true }`
 *     result or null, true for a live customer.
 */
import { describe, it, expect } from 'vitest';
import {
  checkoutCustomerField,
  isUsableCustomer,
} from '../../src/utils/checkoutCustomer.js';

describe('checkoutCustomerField — attach vs. omit the customer id', () => {
  it('omits customer for a null id (new user — Stripe creates a fresh customer)', () => {
    expect(checkoutCustomerField(null)).toEqual({});
  });

  it('omits customer for an undefined id', () => {
    expect(checkoutCustomerField(undefined)).toEqual({});
  });

  it('omits customer for an empty-string id', () => {
    expect(checkoutCustomerField('')).toEqual({});
  });

  it('attaches the stored customer id when one exists (reuse, no duplicate)', () => {
    expect(checkoutCustomerField('cus_1234567890')).toEqual({ customer: 'cus_1234567890' });
  });
});

describe('isUsableCustomer — a stale/deleted customer must fall back to a new one', () => {
  it('treats a live customer as usable', () => {
    expect(isUsableCustomer({ id: 'cus_1234567890', deleted: false })).toBe(true);
    expect(isUsableCustomer({ id: 'cus_1234567890' })).toBe(true);
  });

  it('treats a deleted customer ({ deleted: true }) as NOT usable', () => {
    expect(isUsableCustomer({ id: 'cus_1234567890', deleted: true })).toBe(false);
  });

  it('treats a null/undefined retrieve result as NOT usable', () => {
    expect(isUsableCustomer(null)).toBe(false);
    expect(isUsableCustomer(undefined)).toBe(false);
  });
});
