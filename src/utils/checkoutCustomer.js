/**
 * Checkout customer reuse — pure decision logic for api/create-checkout-session.js.
 *
 * A Checkout Session that carries a `customer` id is billed against that
 * existing Stripe Customer (and reuses its saved payment methods); without it,
 * Stripe mints a brand-new Customer on every session, which the webhook then
 * writes back over `profiles.stripe_customer_id` — leaving orphaned duplicate
 * Customer records behind on every repeat subscription.
 *
 * This module keeps the "should we attach the stored customer?" decision free
 * of the Stripe/Supabase SDKs so it is trivially unit-testable.
 */

/**
 * Build the customer field to merge into a Checkout Session's params.
 *
 * @param {string|null|undefined} customerId — `profiles.stripe_customer_id`.
 * @returns {{}} when the id is null/empty (Stripe creates a fresh customer,
 *          which the webhook then persists — the new-user path), or
 *          `{ customer: customerId }` to reuse the existing customer.
 */
export function checkoutCustomerField(customerId) {
  if (!customerId) return {};
  return { customer: customerId };
}

/**
 * Whether a `stripe.customers.retrieve()` result is a live, usable customer.
 * Stripe represents a deleted customer as `{ deleted: true }` rather than
 * throwing — so a stored id can point at a deleted customer and must be
 * treated as "no reusable customer".
 *
 * @param {object|null|undefined} customer — result of `stripe.customers.retrieve`.
 * @returns {boolean} true when the customer exists and is not deleted.
 */
export function isUsableCustomer(customer) {
  return Boolean(customer) && customer.deleted !== true;
}
