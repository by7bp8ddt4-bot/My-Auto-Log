import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  checkoutCustomerField,
  isUsableCustomer,
} from '../src/utils/checkoutCustomer.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// 3-tier pricing (owner-ratified 2026-08-14; amended 2026-08-17).
// Family → STRIPE_PRICE_ID_MONTHLY ($4.99/mo) or STRIPE_PRICE_ID_YEARLY
//          ($39.99/yr — yearly option restored by owner amendment).
// Fleet  → STRIPE_PRICE_ID_FLEET ($9.99/mo — MONTHLY ONLY; may be unset until
//          the owner creates the price; then a clean 500 'Fleet price not
//          configured' is returned — we never invent a price id).
function mapTierToPriceId(tierName, interval) {
  if (tierName === 'fleet') {
    return { priceId: process.env.STRIPE_PRICE_ID_FLEET, notConfiguredError: 'Fleet price not configured' };
  }
  if (interval === 'yearly') {
    return { priceId: process.env.STRIPE_PRICE_ID_YEARLY, notConfiguredError: 'Yearly price not configured' };
  }
  return { priceId: process.env.STRIPE_PRICE_ID_MONTHLY, notConfiguredError: 'Stripe price ID not configured' };
}
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }
  const { userId, tier, plan, interval } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }
  // Normalize the requested tier + billing interval:
  //   'fleet'              → 'fleet', monthly (Fleet is MONTHLY ONLY — a
  //                          yearly request is ignored and billed monthly)
  //   'family'             → 'family' + interval ('monthly' default,
  //                          'yearly' when requested)
  //   'monthly'/'yearly'   → 'family' (legacy single-premium migration:
  //                          monthly → family+monthly, yearly → family+yearly)
  //   missing/unknown      → 'family' monthly (safe default for old clients)
  let tierName = 'family';
  if (tier === 'fleet' || plan === 'fleet') tierName = 'fleet';
  let intervalName = 'monthly';
  if (tierName === 'family') {
    if (interval === 'yearly') {
      intervalName = 'yearly';
    } else if (plan === 'yearly') {
      intervalName = 'yearly';
    }
  }
  const { priceId, notConfiguredError } = mapTierToPriceId(tierName, intervalName);
  if (!priceId) {
    console.error('Stripe Price ID not configured for tier:', tierName, 'interval:', intervalName);
    return res.status(500).json({ error: notConfiguredError });
  }
  try {
    // Reuse the user's existing Stripe Customer (if one is on file) instead of
    // letting Stripe mint a brand-new Customer on every Checkout Session —
    // which used to overwrite profiles.stripe_customer_id and orphan the old
    // duplicate Customer records on each repeat subscription.
    const customerId = await resolveExistingCustomer(userId);

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      client_reference_id: userId,
      success_url: `${req.headers.origin}/dashboard?payment_success=true&tier=${tierName}&interval=${intervalName}`,
      cancel_url: `${req.headers.origin}/dashboard?payment_cancelled=true`,
      metadata: {
        userId: userId,
        tier: tierName,
        interval: intervalName,
      },
    };
    // Attach the existing customer when we have a live one; otherwise omit
    // `customer` entirely so Stripe creates a new customer (current behavior
    // for brand-new users) and the webhook persists it.
    Object.assign(sessionParams, checkoutCustomerField(customerId));

    const session = await stripe.checkout.sessions.create(sessionParams);
    res.status(200).json({ url: session.url, tier: tierName, interval: intervalName });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}

/**
 * Resolve the user's existing Stripe customer id from `profiles`, returning
 * `null` when there is none (new user) or the stored id is no longer usable
 * (deleted / failed lookup) so checkout falls back to creating a new customer
 * rather than failing outright.
 */
async function resolveExistingCustomer(userId) {
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', userId)
    .maybeSingle();
  if (profileError) {
    console.error('Failed to look up existing Stripe customer:', profileError);
    return null;
  }
  const customerId = profile?.stripe_customer_id;
  if (!customerId) return null;

  // Verify the stored customer still exists — Stripe reports a deleted
  // customer as `{ deleted: true }` (no throw), and a stale id passed to
  // checkout would otherwise hard-fail the session. Fall back to a new
  // customer when the id is stale so the checkout still proceeds.
  try {
    const customer = await stripe.customers.retrieve(customerId);
    if (isUsableCustomer(customer)) return customerId;
  } catch (err) {
    console.error('Stored Stripe customer lookup failed; creating a new customer:', err);
  }
  return null;
}
