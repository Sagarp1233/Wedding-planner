import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS configuration for Vercel
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // The client will pass name and email
  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const firstName = name ? name.split(' ')[0] : 'there';

    const { data, error } = await resend.emails.send({
      from: 'Wedora <support@wedora.in>',
      to: [email],
      subject: 'Welcome to Wedora! Let\'s plan your dream wedding 💒',
      html: `
        <!DOCTYPE html>
        <html>
        <body style="margin:0;padding:40px 0;background-color:#f9f9fa;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
          <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-w-width:600px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px -5px rgba(0,0,0,0.05);border:1px solid #eaeaea;">
            <tr>
              <td style="padding:40px 30px;">
                <table width="100%" border="0" cellpadding="0" cellspacing="0">
                  <tr>
                    <td align="center" style="padding-bottom:30px;">
                      <h1 style="margin:0;font-family:Georgia,serif;font-size:32px;font-weight:bold;color:#111;">Wedora</h1>
                      <p style="margin:5px 0 0;color:#b76e79;font-size:14px;letter-spacing:1px;text-transform:uppercase;font-weight:bold;">The Modern Wedding Planner</p>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-bottom:30px;">
                      <h2 style="margin:0 0 15px;font-size:20px;font-weight:600;color:#111;">Hi ${firstName},</h2>
                      <p style="margin:0 0 15px;color:#555;font-size:16px;line-height:26px;">
                        Congratulations on your upcoming wedding! 🎉 We are so incredibly excited that you've chosen Wedora to help you organize the biggest day of your life.
                      </p>
                      <p style="margin:0 0 15px;color:#555;font-size:16px;line-height:26px;">
                        Planning a wedding shouldn't feel like a second job. That's why we built Wedora—your all-in-one digital workspace. Here's what you can do next:
                      </p>
                      <ul style="color:#555;font-size:16px;line-height:26px;margin-bottom:20px;">
                        <li><strong>Set your Budget:</strong> Let us help you track exactly where your money is going.</li>
                        <li><strong>Manage your Guests:</strong> Keep track of RSVPs and contact info without messy spreadsheets.</li>
                        <li><strong>Create Invitations:</strong> Use our viral templates to share WhatsApp invites instantly.</li>
                      </ul>
                    </td>
                  </tr>
                  <tr>
                    <td align="center" style="padding:10px 0 30px;">
                      <a href="https://wedora.in/login" style="background:linear-gradient(135deg, #b76e79 0%, #8a415a 100%);color:#ffffff;text-decoration:none;padding:16px 32px;border-radius:12px;font-size:16px;font-weight:600;display:inline-block;box-shadow:0 4px 10px rgba(183, 110, 121, 0.3);">Go to your Dashboard</a>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding-top:20px;border-top:1px solid #eaeaea;">
                      <p style="margin:0;color:#777;font-size:14px;line-height:24px;">Need help? Just hit reply to this email, and our team will be right there to assist you.</p>
                      <p style="margin:15px 0 0;color:#777;font-size:14px;line-height:24px;">Warmly,<br/><strong>The Wedora Team</strong></p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
          <p style="text-align:center;color:#999;font-size:12px;margin-top:20px;">© 2026 Wedora. Made with ❤️ in India.</p>
        </body>
        </html>
      `
    });

    if (error) {
      console.error('[Send Welcome Email Error Context]', error);
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('[Send Welcome Email Catch Block]', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
