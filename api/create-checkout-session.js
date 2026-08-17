import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
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
    const session = await stripe.checkout.sessions.create({
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
    });
    res.status(200).json({ url: session.url, tier: tierName, interval: intervalName });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}
