import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY) : null;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Authenticate: verify caller via Bearer token
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];

  let callerUserId;
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired auth token' });
    }
    callerUserId = user.id;
  } catch (e) {
    return res.status(401).json({ error: 'Failed to verify auth token' });
  }

  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Missing userId' });
  }

  // Enforce: caller can only delete their own account
  if (callerUserId !== userId) {
    return res.status(403).json({ error: 'Forbidden: you can only delete your own account' });
  }

  try {
    // Check if user has an active Stripe subscription
    if (stripe) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('stripe_customer_id')
        .eq('id', userId)
        .single();

      if (profile?.stripe_customer_id) {
        const subscriptions = await stripe.subscriptions.list({
          customer: profile.stripe_customer_id,
          status: 'active',
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          return res.status(400).json({
            error: 'cancel_subscription_first',
            message: 'Please cancel your subscription first before deleting your account.',
          });
        }
      }
    }

    // Delete all user data
    const tables = ['vehicles', 'maintenance_logs', 'reminders', 'fuel_logs', 'modifications'];
    for (const table of tables) {
      await supabase.from(table).delete().eq('user_id', userId);
    }
    // Delete profile (uses id not user_id)
    await supabase.from('profiles').delete().eq('id', userId);

    // Delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);
    if (deleteError) {
      // If admin API fails (e.g. not available), try deleting from profiles and data only
      console.error('Could not delete auth user:', deleteError);
      return res.status(200).json({ success: true, note: 'Data deleted, auth user could not be removed. Contact support for full removal.' });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('[DeleteAccount] Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}