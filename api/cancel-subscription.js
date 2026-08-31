import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Self-service subscription cancellation for an EXISTING subscriber.
 *
 * POST { userId }
 *
 * Flow:
 *   1. Resolve the user's Stripe customer id from their Supabase profile
 *      (written by the checkout webhook). No customer → 404 (not a Stripe
 *      subscriber; they have no subscription to cancel).
 *   2. Find their active Stripe subscription.
 *   3. Schedule the cancellation at period end via
 *      `stripe.subscriptions.update(id, { cancel_at_period_end: true })` so
 *      the subscription STOPS renewing but the user keeps paid access until
 *      their already-paid time runs out.
 *   4. Return { status, nextBilling, cancelAtPeriodEnd: true } so the client
 *      can persist the REAL end-of-period date — the "remain active until end
 *      of period" notice becomes truthful instead of a guess.
 *
 * NOTE: like switch-subscription.js / get-subscription.js, this trusts the
 * client-supplied userId to resolve the profile (existing pattern, out of
 * scope to redesign here). No Supabase writes occur — the DB stays READ-ONLY
 * and the cancellation is reflected entirely in Stripe + client localStorage.
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
      return res.status(404).json({
        error: 'No Stripe customer found for this account. If you subscribed through an older flow, reactivate your plan instead.',
      });
    }

    // 2. Find the customer's active subscription (the one to cancel).
    const { data: subs } = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (!subs || subs.length === 0) {
      return res.status(404).json({ error: 'No active subscription found to cancel.' });
    }
    const subscription = subs[0];

    // 3. Schedule cancellation at the end of the current period — this is what
    //    actually stops the recurring charge while preserving paid access until
    //    current_period_end.
    const updated = await stripe.subscriptions.update(subscription.id, {
      cancel_at_period_end: true,
    });

    res.status(200).json({
      status: updated.status,
      nextBilling: new Date(updated.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: true,
    });
  } catch (err) {
    console.error('Error cancelling subscription:', err);
    res.status(500).json({ error: err.message });
  }
}
