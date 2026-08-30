import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    const rawBody = await getRawBody(req);
    event = stripe.webhooks.constructEvent(rawBody, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`Received event: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Map the subscription to a tier name so the client stores the right
    // plan key. Sessions created by api/create-checkout-session.js carry
    // metadata.tier ('family' | 'fleet') + metadata.interval ('monthly' |
    // 'yearly'); anything else defaults to 'family' monthly (legacy monthly
    // subs migrate to Family monthly; legacy yearly subs to Family yearly).
    const tier = session.metadata?.tier === 'fleet' ? 'fleet' : 'family';
    const interval = session.metadata?.interval === 'yearly' ? 'yearly' : 'monthly';

    // ── Robust user resolution ──────────────────────────────────────────
    // The grant of premium is made DURABLY here (profiles.premium = true) and
    // is the ONLY thing tying a payment to an account. Resolution order:
    //   1. session.metadata.userId  — set by create-checkout-session.js
    //   2. session.client_reference_id — same flow, belt-and-braces
    //   3. lookup by stripe_customer_id (profiles.stripe_customer_id)
    //   4. lookup by customer_email (profiles.email)
    // This closes the legacy buy.stripe.com payment-link path where the id
    // was lost: even then we can still attribute the payment via the Stripe
    // customer or email. When no user can be matched we LOG LOUDLY instead of
    // silently no-oping (a silent no-op is what caused paying customers to
    // look "canceled" on a fresh device).
    let userId = session.metadata?.userId || session.client_reference_id || null;

    if (!userId) {
      const customerId = session.customer || null;
      const customerEmail = session.customer_details?.email || null;

      if (customerId || customerEmail) {
        let query = supabase.from('profiles').select('id').limit(1);
        if (customerId) query = query.eq('stripe_customer_id', customerId);
        else query = query.eq('email', customerEmail);
        const { data, error } = await query.maybeSingle();
        if (error) {
          console.error(
            `[webhook] Failed to resolve user for checkout ${session.id}: ` +
            `customer=${customerId}, email=${customerEmail}, error=${error.message}`,
          );
        } else if (data?.id) {
          userId = data.id;
        }
      }
    }

    if (!userId) {
      // Loud, actionable log — the webhook intentionally returns 200 so Stripe
      // doesn't retry forever, but ops must investigate (payment not attributed).
      console.error(
        `[webhook] ⚠️ checkout.session.completed for ${session.id} could NOT be ` +
        `attributed to a user. client_reference_id=${session.client_reference_id}, ` +
        `metadata.userId=${session.metadata?.userId}, customer=${session.customer}, ` +
        `email=${session.customer_details?.email}, tier=${tier}, interval=${interval}. ` +
        `NO grant written — user will appear not-premium until a matching profile exists.`,
      );
      return res.status(200).json({ received: true });
    }

    const stripeCustomerId = session.customer || null;

    const { error } = await supabase
      .from('profiles')
      .upsert({
                    id: userId,
                    premium: true,
                    stripe_customer_id: stripeCustomerId,
                    updated_at: new Date().toISOString()
                  });

    if (error) {
      console.error(`[webhook] Error updating profile for user ${userId}:`, error);
      return res.status(500).json({ error: 'Failed to update profile' });
    }
    console.log(
      `[webhook] ✅ Grant recorded: user=${userId}, tier=${tier}, interval=${interval}, ` +
      `stripe_customer_id=${stripeCustomerId}, checkout=${session.id}, ` +
      `resolvedVia=${session.metadata?.userId ? 'metadata.userId' : session.client_reference_id ? 'client_reference_id' : 'profile-lookup'}`,
    );
  }

  res.status(200).json({ received: true });
}

async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}
