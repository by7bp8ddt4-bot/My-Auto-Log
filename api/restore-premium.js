import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Protected by CRON_SECRET for safety
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // 1. Find the owner's profile by email
    const { data: profiles, error: queryError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', 'craigatupper83@gmail.com');

    if (queryError) throw queryError;

    if (!profiles || profiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No profile found for craigatupper83@gmail.com',
        note: 'The owner may need to sign up first — a profile is created on sign-up via Supabase Auth trigger.'
      });
    }

    const profile = profiles[0];
    const wasPremium = profile.premium;

    // 2. Set premium=true
    const { error: updateError } = await supabase
      .from('profiles')
      .update({ premium: true })
      .eq('id', profile.id);

    if (updateError) throw updateError;

    return res.status(200).json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        premium_was: wasPremium,
        premium_now: true,
      },
      message: wasPremium
        ? 'Owner already had premium status.'
        : 'Premium status restored for owner.',
    });
  } catch (err) {
    console.error('Error restoring premium:', err);
    return res.status(500).json({ error: err.message });
  }
}