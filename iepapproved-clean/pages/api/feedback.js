// pages/api/feedback.js
// Receives feedback form submissions, sends to info@iepapproved.com via Resend

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { name, email, stars, message, lang } = req.body;
  if (!message) return res.status(400).json({ error: 'Message required' });

  const isPublic = stars >= 4;
  const starDisplay = '★'.repeat(stars) + '☆'.repeat(5 - stars);

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'IEP Approved <info@iepapproved.com>',
        to: ['info@iepapproved.com'],
        subject: `${isPublic ? '[PUBLIC REVIEW]' : '[FEEDBACK]'} ${starDisplay} — ${name || 'Anonymous'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2D1B4E;">New ${isPublic ? 'Public Review' : 'Feedback'} Received</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 8px; font-weight: bold; color: #666;">Name:</td><td style="padding: 8px;">${name || 'Anonymous'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #666;">Email:</td><td style="padding: 8px;">${email || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #666;">Rating:</td><td style="padding: 8px; color: #D4A843; font-size: 20px;">${starDisplay} (${stars}/5)</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #666;">Language:</td><td style="padding: 8px;">${lang === 'es' ? 'Spanish' : 'English'}</td></tr>
              <tr><td style="padding: 8px; font-weight: bold; color: #666;">Public:</td><td style="padding: 8px;">${isPublic ? 'YES — eligible for public display' : 'No'}</td></tr>
            </table>
            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin-top: 16px;">
              <p style="font-style: italic; font-size: 16px; line-height: 1.6; margin: 0;">"${message}"</p>
            </div>
            ${isPublic ? '<p style="color: #D4A843; font-weight: bold; margin-top: 16px;">This review is eligible to be added to the public testimonials on the feedback page.</p>' : ''}
          </div>
        `,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Feedback API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
