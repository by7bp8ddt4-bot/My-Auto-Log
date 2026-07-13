import { createClient } from '@supabase/supabase-js';
import nodemailer from 'nodemailer';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  // Cron security check
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify SMTP is configured
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

    // 1. Fetch enabled reminders with vehicle and profile (email) info
    const { data: reminders, error } = await supabase
      .from('reminders')
      .select(`
        *,
        vehicles (name, make, model, year, mileage),
        profiles (email)
      `)
      .eq('enabled', true);

    if (error) throw error;

    // 2. Filter for reminders that are due by date or mileage
    const now = new Date();
    const dueReminders = reminders.filter(r => {
      const isDateDue = r.due_date && new Date(r.due_date) <= now;
      const isMileageDue = r.due_mileage && r.vehicles && r.vehicles.mileage >= r.due_mileage;
      return isDateDue || isMileageDue;
    });

    console.log(`Found ${dueReminders.length} due reminders out of ${reminders.length} total.`);

    // 3. Send emails
    const results = await Promise.all(dueReminders.map(async r => {
      const email = r.profiles?.email;
      if (!email) {
        return { id: r.id, status: 'skipped', reason: 'No user email found' };
      }

      const vehicleInfo = `${r.vehicles?.year || ''} ${r.vehicles?.make || ''} ${r.vehicles?.model || ''}`.trim();
      const vehicleName = r.vehicles?.name || vehicleInfo;

      try {
        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: email,
          subject: `Maintenance Due: ${r.title} for your ${vehicleName}`,
          html: `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
              <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 32px 24px; text-align: center;">
                <div style="font-size: 36px; margin-bottom: 8px;">🔧</div>
                <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">Maintenance Reminder</h1>
                <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">MTXtrkr — MaintenX Tracker</p>
              </div>
              <div style="padding: 24px;">
                <p style="color: #334155; font-size: 15px; line-height: 1.6;">Hello,</p>
                <p style="color: #475569; font-size: 14px; line-height: 1.6;">
                  This is a reminder that maintenance is due for your <strong>${vehicleName}</strong>.
                </p>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; margin: 16px 0;">
                  <h3 style="color: #0f172a; font-size: 16px; margin: 0 0 8px;">${r.title}</h3>
                  <p style="color: #475569; font-size: 14px; line-height: 1.5; margin: 0 0 12px;">
                    ${r.description || 'No description provided.'}
                  </p>
                  <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                    ${r.due_mileage ? `
                    <tr>
                      <td style="padding: 6px 0; color: #64748b;">Due at:</td>
                      <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${r.due_mileage.toLocaleString()} miles</td>
                    </tr>` : ''}
                    ${r.due_date ? `
                    <tr>
                      <td style="padding: 6px 0; color: #64748b;">Due by:</td>
                      <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${new Date(r.due_date).toLocaleDateString()}</td>
                    </tr>` : ''}
                    <tr>
                      <td style="padding: 6px 0; color: #64748b;">Current mileage:</td>
                      <td style="padding: 6px 0; color: #0f172a; font-weight: 600; text-align: right;">${r.vehicles?.mileage?.toLocaleString() || 'Unknown'} mi</td>
                    </tr>
                  </table>
                </div>
                <div style="text-align: center; margin: 24px 0;">
                  <a href="https://mtxtrkr.com/dashboard" style="display: inline-block; background: #2563eb; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 14px;">
                    View Full Maintenance Log →
                  </a>
                </div>
                <div style="background: #f1f5f9; border-radius: 8px; padding: 12px; margin: 16px 0;">
                  <p style="color: #475569; font-size: 12px; margin: 0; line-height: 1.5;">
                    <strong>💡 Tip:</strong> Logging services on time helps prevent costly breakdowns and keeps your resale value high.
                  </p>
                </div>
              </div>
              <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
                  You are receiving this because you enabled maintenance reminders in MTXtrkr.<br>
                  MTXtrkr — <em>MaintenX Tracker</em> — Smart vehicle maintenance tracking
                </p>
              </div>
            </div>
          `
        });

        return { id: r.id, status: 'sent' };
      } catch (sendError) {
        console.error(`Failed to send email for reminder ${r.id}:`, sendError);
        return { id: r.id, status: 'failed', error: sendError.message };
      }
    }));

    res.status(200).json({ 
      success: true, 
      processed: reminders.length, 
      due: dueReminders.length, 
      results 
    });
  } catch (err) {
    console.error('Error in check-reminders:', err);
    res.status(500).json({ error: err.message });
  }
}