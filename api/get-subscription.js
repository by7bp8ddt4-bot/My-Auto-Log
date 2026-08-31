import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

/**
 * Read-only lookup of the user's REAL next billing date from Stripe.
 *
 * POST { userId }
 *
 * Flow:
 *   1. Resolve the user's Stripe customer id from their Supabase profile
 *      (written by the checkout webhook).
 *   2. Find their active Stripe subscription.
 *   3. Return a MINIMAL payload with only the fields the client needs:
 *      { status, nextBilling, cancelAtPeriodEnd }. No payment method, email,
 *      address, or any other Stripe field is ever returned.
 *
 * If there is no Stripe customer OR no active subscription, we return a clean
 * 200 { notFound: true } — the client treats that as "nothing real to show"
 * and keeps its fallback estimate (which is now labeled "Estimated").
 *
 * NOTE: like switch-subscription.js, this trusts the client-supplied userId to
 * resolve the profile. That matches the existing pattern (see note there) and
 * is out of scope to redesign here.
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
      return res.status(200).json({ notFound: true });
    }

    // 2. Find the customer's active subscription.
    const { data: subs } = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (!subs || subs.length === 0) {
      return res.status(200).json({ notFound: true });
    }
    const subscription = subs[0];

    // 3. Return ONLY the minimal fields the client needs.
    return res.status(200).json({
      status: subscription.status,
      nextBilling: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
    });
  } catch (err) {
    console.error('Error fetching subscription:', err);
    return res.status(500).json({ error: err.message });
  }
}
