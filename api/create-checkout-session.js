import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const { userId, plan } = req.body;

  if (!userId) {
    return res.status(400).json({ error: 'User ID is required' });
  }

  let priceId;
  if (plan === 'yearly') {
    priceId = process.env.STRIPE_PRICE_ID_YEARLY;
  } else {
    priceId = process.env.STRIPE_PRICE_ID_MONTHLY;
  }

  if (!priceId) {
    console.error('Stripe Price ID not configured for plan:', plan);
    return res.status(500).json({ error: 'Stripe price ID not configured' });
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
      success_url: `${req.headers.origin}/dashboard?payment_success=true`,
      cancel_url: `${req.headers.origin}/dashboard?payment_cancelled=true`,
      metadata: {
        userId: userId,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    res.status(500).json({ error: err.message });
  }
}