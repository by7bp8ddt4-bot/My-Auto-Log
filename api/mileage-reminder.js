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
      // Helper: calculate monthly lease allowance
      const getLeaseMonthlyAllowance = (v) => {
        if (!v.isLeased || !v.leaseMileageLimit || !v.leaseEndDate) return null;
        const now = new Date();
        const end = new Date(v.leaseEndDate);
        if (end <= now) return null;
        const monthsRemaining = Math.max(1, (end.getFullYear() - now.getFullYear()) * 12 + (end.getMonth() - now.getMonth()));
        const milesRemaining = Math.max(0, v.leaseMileageLimit - (v.mileage || 0));
        const monthlyAllowance = Math.round(milesRemaining / monthsRemaining);
        // Determine if they're over or under pace
        // Use purchase data to estimate actual monthly usage
        let actualMonthly = null;
        let statusColor = '#10b981'; // green
        let statusText = 'on track to stay under your limit';
        if (v.purchaseDate && v.purchaseMileage >= 0) {
          const monthsSince = Math.max(1, (now.getFullYear() - new Date(v.purchaseDate).getFullYear()) * 12 + (now.getMonth() - new Date(v.purchaseDate).getMonth()));
          const milesDriven = Math.max(0, (v.mileage || 0) - v.purchaseMileage);
          if (monthsSince > 0 && milesDriven > 0) {
            actualMonthly = Math.round(milesDriven / monthsSince);
            const projectedOver = (actualMonthly * monthsRemaining) > milesRemaining;
            if (projectedOver) {
              const overage = Math.round((actualMonthly * monthsRemaining) - milesRemaining);
              statusColor = '#ef4444';
              statusText = `at this pace, you'll exceed your limit by ${overage.toLocaleString()} mi`;
            }
          }
        }
        return { monthlyAllowance, monthsRemaining, milesRemaining, statusColor, statusText, actualMonthly };
      };

      // Text-based vehicle list (for display in email)
      const vehicleList = vehicles?.map(v => {
        const base = `${v.year} ${v.make} ${v.model} (${v.name}) — ${v.mileage?.toLocaleString() || '?'} mi`;
        if (v.isLeased && v.leaseMileageLimit) {
          const allowance = getLeaseMonthlyAllowance(v);
          if (allowance) {
            const statusIcon = allowance.statusColor === '#ef4444' ? '⚠' : '✓';
            return `${base}<br><span style="color:${allowance.statusColor};font-size:12px;">${statusIcon} Lease: ${allowance.monthlyAllowance.toLocaleString()} mi/month remaining — ${allowance.statusText}</span>`;
          }
          return `${base}<br><span style="color:#64748b;font-size:12px;">Lease: ${v.leaseMileageLimit.toLocaleString()} mi limit</span>`;
        }
        return base;
      }).join('<br>') || 'No vehicles added yet.';

      // Per-vehicle CTA rows with deep-links
      const vehicleCtas = vehicles?.map(v => {
        const ctaUrl = `${appUrl}/dashboard?update-mileage=${encodeURIComponent(v.id)}`;
        let leaseHtml = '';
        if (v.isLeased && v.leaseMileageLimit) {
          const allowance = getLeaseMonthlyAllowance(v);
          if (allowance) {
            const statusIcon = allowance.statusColor === '#ef4444' ? '⚠ ' : '✓ ';
            leaseHtml = `<br><span style="color:${allowance.statusColor}; font-size: 11px;">${statusIcon}Lease: ${allowance.monthlyAllowance.toLocaleString()} mi/month remaining — ${allowance.statusText}</span>`;
          } else {
            leaseHtml = `<br><span style="color:#64748b; font-size: 11px;">Lease: ${v.leaseMileageLimit.toLocaleString()} mi limit</span>`;
          }
        }
        return `
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 13px; color: #334155; line-height: 1.6;">
                    <strong>${v.year} ${v.make} ${v.model}</strong> — ${v.name}<br>
                    <span style="color: #64748b; font-size: 12px;">Current: ${v.mileage?.toLocaleString() || '?'} mi</span>
                    ${leaseHtml}
                  </td>
                  <td width="130" style="text-align: right; vertical-align: middle;">
                    <a href="${ctaUrl}" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 7px 14px; border-radius: 6px; text-decoration: none; font-size: 12px; font-weight: 600; white-space: nowrap;">
                      Update Mileage →
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

      // Get registration documents due for renewal
      const { data: regDocs } = await supabase
        .from('documents')
        .select('id, name, expiry_date, vehicle_id, reminders_sent')
        .eq('user_id', profile.id)
        .eq('folder', 'registration')
        .not('expiry_date', 'is', null)
        .order('expiry_date', { ascending: true });

      // Build registration renewal alerts for documents due within 90 days
      const regRenewals = (regDocs || []).map(doc => {
        const now = new Date();
        const expiry = new Date(doc.expiry_date);
        const daysUntil = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
        const vehicleName = vehicles?.find(v => v.id === doc.vehicle_id)?.name || 'Vehicle';
        
        // Check which reminders should be sent (90, 60, 30 days)
        const thresholds = [90, 60, 30];
        const sentBefore = doc.reminders_sent || [];
        const toSend = thresholds.filter(t => daysUntil <= t && !sentBefore.includes(t));
        
        return { doc, vehicleName, daysUntil, expiry, toSend };
      }).filter(r => r.daysUntil <= 90 && r.daysUntil >= 0);

      // Build HTML for registration renewal alerts
      const regAlertHtml = regRenewals.length > 0 ? `
        <div style="background: #e0f2fe; border-radius: 8px; padding: 12px; margin: 16px 0; border: 1px solid #7dd3fc;">
          <p style="color: #0369a1; font-size: 12px; margin: 0 0 8px; font-weight: 600;">
            📋 Registration Renewals Due
          </p>
          ${regRenewals.map(r => {
            const statusColor = r.daysUntil <= 30 ? '#dc2626' : r.daysUntil <= 60 ? '#d97706' : '#2563eb';
            const statusIcon = r.daysUntil <= 30 ? '🔴' : r.daysUntil <= 60 ? '🟡' : '🔵';
            return `
              <p style="color: ${statusColor}; font-size: 12px; margin: 0 0 4px; line-height: 1.5;">
                <strong>${statusIcon} ${r.vehicleName}:</strong>
                ${r.doc.name || 'Registration'} renews in <strong>${r.daysUntil} days</strong>
                (due ${r.expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })})
              </p>`;
          }).join('')}
          <p style="color: #64748b; font-size: 10px; margin: 8px 0 0;">
            Update or upload your registration documents in the MTXtrkr app.
          </p>
        </div>
      ` : '';

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: `📅 ${vehicleCount > 0 ? `Mileage check-in for your ${vehicleCount} ${vehicleCount === 1 ? 'vehicle' : 'vehicles'}` : 'MTXtrkr Monthly Update'}${regRenewals.length > 0 ? ` + ${regRenewals.length} registration renewal${regRenewals.length > 1 ? 's' : ''}` : ''} — MTXtrkr`,
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
                  ${vehicles.filter(v => v.isLeased && v.leaseMileageLimit && v.leaseEndDate).map(v => {
                    const allowance = getLeaseMonthlyAllowance(v);
                    if (!allowance) return '';
                    const isOver = allowance.statusColor === '#ef4444';
                    return `
                      <p style="color: #92400e; font-size: 12px; margin: 0 0 4px; line-height: 1.5;">
                        <strong>🔑 ${v.name} (${v.year} ${v.make} ${v.model}):</strong><br>
                        ${isOver
                          ? `<span style="color:#dc2626;">⚠ At this pace, you'll exceed your ${v.leaseMileageLimit.toLocaleString()} mi limit</span>`
                          : `<span style="color:#16a34a;">✓ You're on track to stay under your ${v.leaseMileageLimit.toLocaleString()} mi limit</span>`
                        }<br>
                        <span style="font-size:11px;">Monthly allowance: ${allowance.monthlyAllowance.toLocaleString()} mi/month over ${allowance.monthsRemaining} month${allowance.monthsRemaining > 1 ? 's' : ''}</span>
                      </p>`;
                  }).join('')}
                </div>
                ` : ''}
                ${regAlertHtml}
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

        // After successful send, update reminders_sent for registration documents
        if (regRenewals.length > 0) {
          for (const r of regRenewals) {
            if (r.toSend.length > 0) {
              const updatedSent = [...(r.doc.reminders_sent || []), ...r.toSend];
              await supabase.from('documents')
                .update({ reminders_sent: updatedSent })
                .eq('id', r.doc.id);
            }
          }
        }

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