import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // CORS headers
  const origin = req.headers.origin || '';
  const allowedOrigins = [
    'https://mtxtrkr.com',
    'https://mtxtrkr.vercel.app',
    'https://283ea1fcef05f942e0518c539cf23727.ctonew.app',
  ];
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body || {};

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        error: 'Missing required fields: name, email, subject, message',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email address' });
    }

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

    const recipient = 'craigatupper83@gmail.com';
    const fromName = 'MTXtrkr Support';
    const emailSubject = `[MTXtrkr Support] ${subject} - from ${name}`;

    // Build email body
    const htmlBody = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 560px; margin: 0 auto; background: #f8fafc; border-radius: 16px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #1e3a5f, #0f172a); padding: 32px 24px; text-align: center;">
          <h1 style="color: #ffffff; font-size: 20px; margin: 0; font-weight: 700;">📬 New Support Request</h1>
          <p style="color: #94a3b8; font-size: 14px; margin: 8px 0 0;">From the MTXtrkr contact form</p>
        </div>
        <div style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 12px;">Name</span><br>
                <span style="color: #0f172a; font-size: 14px; font-weight: 600;">${name}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 12px;">Email</span><br>
                <a href="mailto:${email}" style="color: #2563eb; font-size: 14px; text-decoration: none;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                <span style="color: #64748b; font-size: 12px;">Subject</span><br>
                <span style="color: #0f172a; font-size: 14px; font-weight: 600;">${subject}</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0;">
                <span style="color: #64748b; font-size: 12px;">Message</span><br>
                <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px; margin-top: 4px;">
                  <p style="color: #334155; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${message}</p>
                </div>
              </td>
            </tr>
          </table>
        </div>
        <div style="background: #f1f5f9; padding: 20px 24px; text-align: center; border-top: 1px solid #e2e8f0;">
          <p style="color: #94a3b8; font-size: 11px; margin: 0; line-height: 1.5;">
            MTXtrkr — Smart vehicle maintenance tracking
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"${fromName}" <${process.env.SMTP_USER}>`,
      to: recipient,
      replyTo: email,
      subject: emailSubject,
      html: htmlBody,
      text: `New Support Request\n\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage:\n${message}`,
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error in contact-support:', err);
    return res.status(500).json({ error: err.message || 'Failed to send message' });
  }
}