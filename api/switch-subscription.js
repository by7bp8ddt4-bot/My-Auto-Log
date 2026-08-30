import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';
import {
  normalizeTier,
  normalizeIntervalForTier,
  isValidTargetPlan,
} from '../src/utils/planSwitch.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Mirror of the 3-tier price routing in api/create-checkout-session.js.
// Family → STRIPE_PRICE_ID_MONTHLY or STRIPE_PRICE_ID_YEARLY; Fleet →
// STRIPE_PRICE_ID_FLEET (monthly only). We never invent a price id — if a
// price env var is unset we return a clean 500 so the client can fall back.
function mapTierToPriceId(tierName, interval) {
  if (tierName === 'fleet') {
    return { priceId: process.env.STRIPE_PRICE_ID_FLEET, notConfiguredError: 'Fleet price not configured' };
  }
  if (interval === 'yearly') {
    return { priceId: process.env.STRIPE_PRICE_ID_YEARLY, notConfiguredError: 'Yearly price not configured' };
  }
  return { priceId: process.env.STRIPE_PRICE_ID_MONTHLY, notConfiguredError: 'Stripe price ID not configured' };
}

/**
 * Self-service plan switch for an EXISTING subscriber.
 *
 * POST { userId, tier, interval }  ('family' | 'fleet'; interval 'monthly' |
 * 'yearly' — yearly is only valid for Family; Fleet always resolves to
 * monthly).
 *
 * Flow:
 *   1. Validate the requested target tier+interval against the known-good set
 *      (family-monthly / family-yearly / fleet-monthly). Anything else 400s —
 *      Fleet-yearly and unknown combos are rejected outright.
 *   2. Find the user's Supabase profile to get their Stripe customer id
 *      (stored by the checkout webhook). No customer → 404 (not a Stripe
 *      subscriber; they have no subscription to switch).
 *   3. Find their active Stripe subscription.
 *   4. Update the subscription's item to the target Price id with
 *      `proration_behavior: 'create_prorations'` so upgrades/interval-bumps
 *      bill the prorated difference immediately and downgrades/interval-drops
 *      credit the unused time toward the next invoice.
 *   5. Return the new tier/interval/status + next billing (Stripe's own
 *      current_period_end) so the client reflects the plan immediately.
 *
 * NOTE: tier/interval are not persisted server-side (Supabase DB is
 * READ-ONLY — no schema changes; no tier column). The premium grant is
 * unchanged (still paid). The client writes the new tier/interval/status to
 * localStorage from the response, consistent with the client-side tier model.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, tier, interval } = req.body || {};
  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Validate the RAW requested target against the known-good set BEFORE
  // normalizing, so invalid combos are rejected outright: unknown tiers and a
  // Fleet-yearly request are 400s (Fleet is MONTHLY ONLY). Only family-monthly,
  // family-yearly and fleet-monthly are accepted.
  if (!isValidTargetPlan(tier, interval)) {
    return res.status(400).json({
      error: 'Invalid plan: ' + String(tier) + '-' + String(interval) + '. Allowed targets are family-monthly, family-yearly, fleet-monthly (Fleet is monthly only).',
    });
  }

  // Now normalize to the canonical tier+interval for price mapping. Because the
  // target was validated above, this is lossless for the accepted combos.
  const targetTier = normalizeTier(tier);
  const targetInterval = normalizeIntervalForTier(targetTier, interval);

  const { priceId, notConfiguredError } = mapTierToPriceId(targetTier, targetInterval);
  if (!priceId) {
    console.error('Stripe Price ID not configured for tier:', targetTier, 'interval:', targetInterval);
    return res.status(500).json({ error: notConfiguredError });
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

    // 2. Find the customer's active subscription (the one to switch).
    const { data: subs } = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      limit: 1,
    });
    if (!subs || subs.length === 0) {
      return res.status(404).json({ error: 'No active subscription found to change.' });
    }
    const subscription = subs[0];
    // The single recurring item on the subscription (its price gets swapped).
    const item = subscription.items?.data?.[0];
    if (!item) {
      return res.status(500).json({ error: 'Subscription has no billable items to switch.' });
    }

    // 3. Detect a no-op: already on the target plan → tell the user cleanly.
    if (item.price?.id === priceId) {
      return res.status(200).json({
        tier: targetTier,
        interval: targetInterval,
        status: subscription.status,
        nextBilling: new Date(subscription.current_period_end * 1000).toISOString(),
        changed: false,
        message: 'You are already on this plan.',
      });
    }

    // 4. Switch the price with proration (create_prorations) so the change is
    //    reflected immediately and the difference is billed/credited.
    const updated = await stripe.subscriptions.update(subscription.id, {
      items: [{ id: item.id, price: priceId }],
      proration_behavior: 'create_prorations',
      expand: ['latest_invoice.payment_intent', 'schedule'],
    });

    res.status(200).json({
      tier: targetTier,
      interval: targetInterval,
      status: updated.status,
      nextBilling: new Date(updated.current_period_end * 1000).toISOString(),
      currentPeriodStart: new Date(updated.current_period_start * 1000).toISOString(),
      changed: true,
    });
  } catch (err) {
    console.error('Error switching subscription:', err);
    res.status(500).json({ error: err.message });
  }
}
