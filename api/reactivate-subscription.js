import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Self-service subscription reactivation for a period-end-cancelled subscriber.
 *
 * POST { userId }
 *
 * Flow:
 *   1. Resolve the user's Stripe customer id from their Supabase profile
 *      (written by the checkout webhook).
 *   2. Find their active Stripe subscription.
 *   3. If it exists AND is marked `cancel_at_period_end === true`, UN-cancel it
 *      via `stripe.subscriptions.update(id, { cancel_at_period_end: false })`
 *      and return `{ reactivated: true, status, nextBilling, cancelAtPeriodEnd }`.
 *      This keeps the SAME subscription (and its already-paid period) — no new
 *      Checkout Session, no new Stripe subscription, no overlapping double
 *      charge, and `profiles.stripe_customer_id` is never overwritten.
 *   4. If there is no Stripe customer, no active subscription, or the active
 *      subscription is NOT period-end-cancelled, return `{ reactivated: false }`
 *      with HTTP 200 so the client can fall back to a fresh Checkout Session
 *      (e.g. a user whose subscription actually lapsed and has nothing to
 *      resume). These are NOT errors — we never throw here.
 *
 * NOTE: like cancel-subscription.js / switch-subscription.js, this trusts the
 * client-supplied userId to resolve the profile (existing pattern, out of scope
 * to redesign here). No Supabase writes occur — the DB stays READ-ONLY and the
 * reactivation is reflected entirely in Stripe + client localStorage.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  try {
    // 1. Resolve the user's Stripe customer id from their profile.
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('stripe_customer_id')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    const customerId = profile?.stripe_customer_id;
    if (!customerId) {
      return res.status(200).json({ reactivated: false });
    }

    // 2. Find the customer's active subscription (the one to un-cancel).
    const { data: subs } = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (!subs || subs.length === 0) {
      return res.status(200).json({ reactivated: false });
    }
    const subscription = subs[0];

    // 3. Only un-cancel a subscription that is actually scheduled to cancel at
    //    period end. Anything else (already active with no pending cancel, or a
    //    trialing/past_due state that didn't match the active filter) has
    //    nothing to resume → let the client fall back to checkout.
    if (subscription.cancel_at_period_end !== true) {
      return res.status(200).json({ reactivated: false });
    }

    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: false,
    });

    return res.status(200).json({
      reactivated: true,
      status: updated.status,
      nextBilling: new Date(updated.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: false,
    });
  } catch (err) {
    console.error('Error reactivating subscription:', err);
    res.status(500).json({ error: err.message });
  }
}
