import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// 3-tier pricing (owner-ratified 2026-08-14). Monthly only — no annual.
// Family → STRIPE_PRICE_ID_MONTHLY ($4.99/mo)
// Fleet  → STRIPE_PRICE_ID_FLEET  ($9.99/mo — may be unset until the owner
//          creates the price; then a clean 500 'Fleet price not configured'
//          is returned — we never invent a price id).
function mapTierToPriceId(tierName) {
  if (tierName === 'fleet') {
    return { priceId: process.env.STRIPE_PRICE_ID_FLEET, notConfiguredError: 'Fleet price not configured' };
  }
  return { priceId: process.env.STRIPE_PRICE_ID_MONTHLY, notConfiguredError: 'Stripe price ID not configured' };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, tier, plan } = req.body || {};

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  // Normalize the requested tier:
  //   'family' | 'fleet'  → as-is
  //   'monthly'/'yearly'  → 'family' (legacy single-premium migration — monthly only now)
  //   missing/unknown     → 'family' (safe default for existing clients)
  let tierName = 'family';
  if (tier === 'fleet' || plan === 'fleet') tierName = 'fleet';

  const { priceId, notConfiguredError } = mapTierToPriceId(tierName);

  if (!priceId) {
    console.error('Stripe Price ID not configured for tier:', tierName);
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
      success_url: `${req.headers.origin}/dashboard?payment_success=true&tier=${tierName}`,
      cancel_url: `${req.headers.origin}/dashboard?payment_cancelled=true`,
      metadata: {
        userId: userId,
        tier: tierName,
      },
    });

    res.status(200).json({ url: session.url, tier: tierName });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}
