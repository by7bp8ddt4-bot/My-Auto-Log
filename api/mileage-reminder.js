import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create Gmail SMTP transporter (same sender as forgot password emails)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export default async function handler(req, res) {
  // Security check — only the cron job can call this
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // Only allow GET (cron-job.org sends GET requests)
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // 1. Fetch all premium users with their profiles
    const { data: premiumUsers, error: userError } = await supabase
      .from('profiles')
      .select('id, email, premium')
      .eq('premium', true);

    if (userError) throw userError;

    console.log(`Found ${premiumUsers?.length || 0} premium users.`);

    if (!premiumUsers || premiumUsers.length === 0) {
      return res.status(200).json({
        success: true,
        sent: 0,
        skipped: 0,
        message: 'No premium users to notify.',
      });
    }

    // 2. For each premium user, get their vehicles and latest mileage
    const results = await Promise.all(premiumUsers.map(async (profile) => {
      const email = profile.email;
      if (!email) {
        return { userId: profile.id, status: 'skipped', reason: 'No email on profile' };
      }

      // Get user's vehicles with current mileage
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, name, make, model, year, mileage')
        .eq('user_id', profile.id);

      // Get the most recent maintenance log for a mileage reference
      const { data: recentLog } = await supabase
        .from('maintenance_logs')
        .select('mileage, date')
        .eq('user_id', profile.id)
        .order('date', { ascending: false })
        .limit(1)
        .single();

      const vehicleCount = vehicles?.length || 0;
      const vehicleList = vehicles?.map(v =>
        `${v.year} ${v.make} ${v.model} (${v.name}) — ${v.mileage?.toLocaleString() || '?'} mi`
      ).join('<br>') || 'No vehicles added yet.';

      const lastLogMileage = recentLog?.mileage
        ? `${recentLog.mileage.toLocaleString()} mi on ${recentLog.date}`
        : 'No service logs yet.';

      const appUrl = 'https://mtxtrkr.vercel.app';

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: `📅 Time to update your mileage — MTXtrkr`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
              <!-- Header -->
              <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 32px 24px; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">⛽</div>
                <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">Time for a Mileage Check-In</h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Keep your maintenance schedule on track</p>
              </div>

              <!-- Body -->
              <div style="padding: 24px;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hi there,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  It's been a month — time to update your mileage in MTXtrkr so your maintenance schedule stays accurate.
                </p>

                <!-- Vehicle Summary -->
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <h3 style="color: #0f172a; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Your Vehicles (${vehicleCount})
                  </h3>
                  <div style="font-size: 13px; color: #334155; line-height: 1.8;">
                    ${vehicleList}
                  </div>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                  <div style="font-size: 12px; color: #64748b;">
                    <strong>Last service logged:</strong><br>
                    ${lastLogMileage}
                  </div>
                </div>

                <!-- CTA -->
                <div style="text-align: center; margin: 24px 0;">
                  <a href="${appUrl}" style="display: inline-block; background: linear-gradient(135deg, #2563eb, #06b6d4); color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px; font-weight: 600; box-shadow: 0 4px 12px rgba(37,99,235,0.3);">
                    Update Mileage Now
                  </a>
                </div>

                <!-- Why it matters -->
                <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; margin: 16px 0;">
                  <p style="color: #475569; font-size: 12px; margin: 0; line-height: 1.5;">
                    <strong>💡 Why this matters:</strong> Accurate mileage keeps your maintenance schedule, 
                    service reminders, and fuel economy tracking precise. Just a quick tap to stay on top of it.
                  </p>
                </div>
              </div>

              <!-- Footer -->
              <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                  You're receiving this monthly reminder because you're a <strong>MTXtrkr Premium</strong> member.<br>
                  MTXtrkr — Smart vehicle maintenance tracking
                </p>
              </div>
            </div>
          `,
        });

        return { userId: profile.id, email, status: 'sent' };
      } catch (sendError) {
        console.error(`Failed to send to ${email}:`, sendError);
        return { userId: profile.id, email, status: 'failed', error: sendError.message };
      }
    }));

    const sent = results.filter(r => r.status === 'sent').length;
    const failed = results.filter(r => r.status === 'failed').length;
    const skipped = results.filter(r => r.status === 'skipped').length;

    res.status(200).json({
      success: true,
      totalPremium: premiumUsers.length,
      sent,
      failed,
      skipped,
      results,
    });
  } catch (err) {
    console.error('Error in mileage-reminder:', err);
    res.status(500).json({ error: err.message });
  }
}