export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { name, email, subject, message, role } = req.body

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Name, email, and message are required' })
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY

  if (!RESEND_API_KEY) {
    console.log('CONTACT FORM SUBMISSION (no Resend key):', { name, email, role, subject, message })
    return res.status(200).json({ success: true })
  }

  try {
    // EMAIL 1 — Notify Kimberly at info@iepapproved.com
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IEP Approved <info@iepapproved.com>',
        to: ['info@iepapproved.com'],
        reply_to: email,
        subject: `New Message: ${subject || 'General inquiry'} — from ${name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2D1B4E; padding: 24px; border-radius: 12px 12px 0 0;">
              <h2 style="color: #D4A843; margin: 0; font-size: 20px;">New Contact Form Message</h2>
              <p style="color: rgba(255,255,255,0.6); margin: 4px 0 0; font-size: 13px;">IEP Approved — info@iepapproved.com</p>
            </div>
            <div style="background: #F9F8FC; padding: 24px; border: 1px solid #E8E2F5; border-top: none; border-radius: 0 0 12px 12px;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                <tr>
                  <td style="padding: 8px 12px 8px 0; font-weight: bold; color: #2D1B4E; width: 100px; vertical-align: top;">Name:</td>
                  <td style="padding: 8px 0; color: #3D3350;">${name}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px 8px 0; font-weight: bold; color: #2D1B4E; vertical-align: top;">Email:</td>
                  <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #2D1B4E; font-weight: 600;">${email}</a></td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px 8px 0; font-weight: bold; color: #2D1B4E; vertical-align: top;">Role:</td>
                  <td style="padding: 8px 0; color: #3D3350;">${role || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 12px 8px 0; font-weight: bold; color: #2D1B4E; vertical-align: top;">Subject:</td>
                  <td style="padding: 8px 0; color: #3D3350;">${subject || 'General inquiry'}</td>
                </tr>
              </table>
              <div style="background: white; border-radius: 10px; padding: 20px; border: 1px solid #E8E2F5;">
                <p style="font-weight: bold; color: #2D1B4E; margin: 0 0 10px; font-size: 14px;">Message:</p>
                <p style="color: #3D3350; line-height: 1.7; margin: 0; font-size: 14px;">${message.replace(/\n/g, '<br>')}</p>
              </div>
              <p style="margin-top: 16px; font-size: 12px; color: #9CA3AF;">
                Hit reply to respond directly to ${name} at ${email}
              </p>
            </div>
          </div>
        `
      })
    })

    // EMAIL 2 — Auto-reply to the person who submitted
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kimberly at IEP Approved <info@iepapproved.com>',
        to: [email],
        subject: `We received your message — IEP Approved`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #2D1B4E; padding: 32px 24px; border-radius: 12px 12px 0 0; text-align: center;">
              <h1 style="color: #D4A843; margin: 0; font-size: 28px; font-family: Georgia, serif;">IEP Approved</h1>
              <p style="color: rgba(255,255,255,0.6); margin: 6px 0 0; font-size: 13px;">iepapproved.com</p>
            </div>
            <div style="background: #ffffff; padding: 36px 32px; border: 1px solid #E8E2F5; border-top: none;">
              <h2 style="color: #2D1B4E; font-size: 22px; margin: 0 0 16px; font-family: Georgia, serif;">Hi ${name},</h2>
              <p style="color: #3D3350; font-size: 15px; line-height: 1.7; margin: 0 0 16px;">
                Thank you for reaching out to IEP Approved. We received your message and will get back to you within <strong>1-2 business days</strong>.
              </p>
              <p style="color: #3D3350; font-size: 15px; line-height: 1.7; margin: 0 0 24px;">
                While you wait, Ada is available 24/7 to answer your IEP law questions — free, any time.
              </p>
              <div style="text-align: center; margin: 28px 0;">
                <a href="https://www.iepapproved.com/ada" style="background: #2D1B4E; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 10px; font-size: 15px; font-weight: bold; display: inline-block;">Ask Ada a Question →</a>
              </div>
              <div style="background: #F9F8FC; border-radius: 10px; padding: 16px 20px; border: 1px solid #E8E2F5; margin-top: 24px;">
                <p style="margin: 0; font-size: 13px; color: #7A6E8E; line-height: 1.6;">
                  <strong style="color: #2D1B4E;">Your message:</strong><br/>
                  ${message.replace(/\n/g, '<br>')}
                </p>
              </div>
            </div>
            <div style="background: #2D1B4E; padding: 20px 24px; border-radius: 0 0 12px 12px; text-align: center;">
              <p style="color: #D4A843; font-style: italic; font-size: 13px; margin: 0 0 8px;">
                Knowledge is power. Partnership is progress. Together — the IEP gets APPROVED.
              </p>
              <p style="color: rgba(255,255,255,0.4); font-size: 11px; margin: 0;">
                IEP Approved LLC | <a href="mailto:info@iepapproved.com" style="color: rgba(255,255,255,0.4);">info@iepapproved.com</a> | <a href="https://www.iepapproved.com" style="color: rgba(255,255,255,0.4);">iepapproved.com</a>
              </p>
            </div>
          </div>
        `
      })
    })

    return res.status(200).json({ success: true })

  } catch (err) {
    console.error('Contact form error:', err)
    return res.status(500).json({ error: 'Failed to send message' })
  }
}
