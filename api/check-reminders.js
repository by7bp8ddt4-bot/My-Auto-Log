import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const supabase = createClient(
  process.env.VITE_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // Cron security check
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
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

      const { data, error: sendError } = await resend.emails.send({
        from: 'MyAutoLog <reminders@myautolog.app>',
        to: [email],
        subject: `Maintenance Due: ${r.title} for your ${vehicleName}`,
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Maintenance Reminder</h2>
            <p>Hello,</p>
            <p>This is a reminder that maintenance is due for your <strong>${vehicleName}</strong>.</p>
            <div style="background-color: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin: 20px 0;">
              <h3 style="margin-top: 0;">${r.title}</h3>
              <p>${r.description || 'No description provided.'}</p>
              ${r.due_mileage ? `<p><strong>Due at:</strong> ${r.due_mileage.toLocaleString()} miles</p>` : ''}
              ${r.due_date ? `<p><strong>Due by:</strong> ${new Date(r.due_date).toLocaleDateString()}</p>` : ''}
            </div>
            <p>Current vehicle mileage: ${r.vehicles?.mileage?.toLocaleString() || 'Unknown'} miles</p>
            <p>To view your full maintenance log or update your mileage, visit the MyAutoLog dashboard:</p>
            <a href="https://myautolog-app.vercel.app/dashboard" style="display: inline-block; background-color: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Dashboard</a>
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;" />
            <p style="color: #64748b; font-size: 12px;">You are receiving this because you enabled maintenance reminders in MyAutoLog.</p>
          </div>
        `
      });

      if (sendError) {
        console.error(`Failed to send email for reminder ${r.id}:`, sendError);
        return { id: r.id, status: 'failed', error: sendError };
      }

      return { id: r.id, status: 'sent', emailId: data.id };
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
