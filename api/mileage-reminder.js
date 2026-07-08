import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Health check — no auth needed, just verify the function is alive
  if (req.query.health === '1') {
    const config = {
      supabaseConfigured: !!(process.env.VITE_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
      smtpConfigured: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      cronConfigured: !!process.env.CRON_SECRET,
    };
    return res.status(200).json({ status: 'ok', config });
  }

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
    // Verify config is complete
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return res.status(500).json({ error: 'SMTP not configured — missing SMTP_USER or SMTP_PASS env vars' });
    }

    // Create transporter lazily (inside handler, not at module level)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter works
    await transporter.verify();

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

      // Get user's vehicles with current mileage and lease info
      const { data: vehicles } = await supabase
        .from('vehicles')
        .select('id, name, make, model, year, mileage, isLeased, leaseMileageLimit, leaseEndDate, purchaseDate, purchaseMileage')
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
      const vehicleList = vehicles?.map(v => {
        const base = `${v.year} ${v.make} ${v.model} (${v.name}) — ${v.mileage?.toLocaleString() || '?'} mi`;
        if (v.isLeased && v.leaseMileageLimit) {
          // Calculate projected mileage vs limit if we have purchase data
          let leaseMsg = '';
          if (v.purchaseDate && v.purchaseMileage >= 0) {
            const daysSince = Math.floor((Date.now() - new Date(v.purchaseDate).getTime()) / (24 * 60 * 60 * 1000));
            if (daysSince > 0) {
              const dailyAvg = Math.max(0, (v.mileage - v.purchaseMileage) / daysSince);
              if (dailyAvg > 0 && v.leaseEndDate) {
                const daysToEnd = Math.max(0, Math.floor((new Date(v.leaseEndDate).getTime() - Date.now()) / (24 * 60 * 60 * 1000)));
                const projected = Math.round(v.mileage + dailyAvg * daysToEnd);
                const overUnder = projected > v.leaseMileageLimit
                  ? `<span style="color:#ef4444;">⚠ ${(projected - v.leaseMileageLimit).toLocaleString()} mi over</span>`
                  : `<span style="color:#10b981;">${(v.leaseMileageLimit - projected).toLocaleString()} mi remaining</span>`;
                leaseMsg = ` — <strong>Lease:</strong> ${v.leaseMileageLimit.toLocaleString()} mi limit, projected ${projected.toLocaleString()} mi (${overUnder})`;
              }
            }
          }
          if (!leaseMsg) {
            leaseMsg = ` — <strong>Lease:</strong> ${v.leaseMileageLimit.toLocaleString()} mi limit`;
          }
          return base + leaseMsg;
        }
        return base;
      }).join('<br>') || 'No vehicles added yet.';

      // Per-vehicle CTA buttons with deep-links to select the vehicle in the app
      const vehicleCtas = vehicles?.map(v => {
        const ctaUrl = `${appUrl}/?vehicle=${encodeURIComponent(v.id)}`;
        return `
          <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #334155; line-height: 1.6;">
                    <strong>${v.year} ${v.make} ${v.model}</strong> — ${v.name}<br>
                    <span style="color: #64748b; font-size: 12px;">Current: ${v.mileage?.toLocaleString() || '?'} mi</span>
                  </td>
                  <td width="140" style="text-align: right;">
                    <a href="${ctaUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 8px 16px; border-radius: 8px; text-decoration: none; font-size: 13px; font-weight: 600;">
                      Update Mileage
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>`;
      }).join('') || '';

      const lastLogMileage = recentLog?.mileage
        ? `${recentLog.mileage.toLocaleString()} mi on ${recentLog.date}`
        : 'No service logs yet.';

      const appUrl = 'https://mtxtrkr.com';

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: `📅 Time to update your mileage — MTXtrkr`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 32px 24px; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">⛽</div>
                <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">Time for a Mileage Check-In</h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">Keep your maintenance schedule on track</p>
              </div>
              <div style="padding: 24px;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hi there,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  It's been a month — time to update your mileage in MTXtrkr so your maintenance schedule stays accurate.
                </p>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <h3 style="color: #0f172a; font-size: 13px; margin: 0 0 8px; text-transform: uppercase; letter-spacing: 0.5px;">
                    Your Vehicles (${vehicleCount})
                  </h3>
                  <table width="100%" cellpadding="0" cellspacing="0">
                    ${vehicleCtas}
                  </table>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 12px 0;" />
                  <div style="font-size: 12px; color: #64748b;">
                    <strong>Last service logged:</strong><br>
                    ${lastLogMileage}
                  </div>
                </div>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; margin: 16px 0;">
                  <p style="color: #475569; font-size: 12px; margin: 0; line-height: 1.5;">
                    <strong>💡 Why this matters:</strong> Accurate mileage keeps your maintenance schedule, 
                    service reminders, and fuel economy tracking precise. Just a quick tap to stay on top of it.
                  </p>
                </div>
                ${vehicles?.some(v => v.isLeased) ? `
                <div style="background: #fef3c7; border-radius: 8px; padding: 12px; margin: 16px 0; border: 1px solid #fcd34d;">
                  <p style="color: #92400e; font-size: 12px; margin: 0; line-height: 1.5;">
                    <strong>🔑 Lease Mileage Alert:</strong> You have ${vehicles.filter(v => v.isLeased).length} leased vehicle(s). 
                    Keep your mileage current to avoid over-mileage charges at lease end.
                  </p>
                </div>
                ` : ''}
              </div>
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