// pages/api/email-signup.js
// Handles email signups from homepage, Ada limit modal, intake page
// Sends branded welcome email via Resend in user's language preference

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { email, name, source, lang = 'en' } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const es = lang === 'es';
  const firstName = name ? name.split(' ')[0] : null;
  const greeting = firstName ? (es ? `Hola ${firstName},` : `Hi ${firstName},`) : (es ? 'Hola,' : 'Hi there,');

  const subject = es
    ? 'Bienvenido a IEP Approved — Ada está lista para ti'
    : 'Welcome to IEP Approved — Ada is ready for you';

  const htmlBody = es ? `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #2D1B4E; padding: 40px; border-radius: 12px;">
      <img src="https://www.iepapproved.com/logo.png" alt="IEP Approved" style="height: 50px; margin-bottom: 24px;" />
      <h1 style="color: #D4A843; font-size: 28px; margin: 0 0 20px;">Bienvenido a IEP Approved.</h1>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">${greeting}</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Me alegra mucho que estés aquí. Esta comunidad fue construida para familias como la tuya — porque cada padre y cuidador merece entrar a esa sala informado, preparado y listo para abogar por su hijo.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Ahora tienes <strong style="color: #D4A843;">10 preguntas gratuitas con Ada este mes</strong>. Pregúntale cualquier cosa — tus derechos, el proceso del IEP, lo que dice la ley. Ella está aquí para ti, en inglés y español, a cualquier hora del día.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Y cuando estés listo para más — Ada Sin Límites es solo $4.99 al mes. Menos que una taza de café. Piénsalo como tomarte un café con una amiga que resulta que sabe todo sobre la ley de educación especial — disponible cuando la necesites, sin cita previa.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.iepapproved.com/ada" style="background: #D4A843; color: #2D1B4E; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; font-family: Arial, sans-serif;">Habla con Ada hoy →</a>
      </div>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Estamos construyendo algo especial aquí. No solo una herramienta — una comunidad. Un lugar donde el conocimiento se encuentra con el corazón, y donde cada victoria se celebra.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Únete a nosotros en las redes sociales — síguenos para conocer los derechos del IEP, historias reales de familias, eventos comunitarios y celebrar cada victoria:</p>
      <p style="color: #D4A843; font-size: 15px;">TikTok: @iepapproved.com<br/>Facebook: facebook.com/IEPapproved</p>
      <p style="color: #b8a8d0; font-size: 15px; line-height: 1.7; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">— Kimberly<br/><em>Mamá de Robbie y Fundadora, IEP Approved LLC</em></p>
    </div>
  ` : `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #2D1B4E; padding: 40px; border-radius: 12px;">
      <img src="https://www.iepapproved.com/logo.png" alt="IEP Approved" style="height: 50px; margin-bottom: 24px;" />
      <h1 style="color: #D4A843; font-size: 28px; margin: 0 0 20px;">Welcome to IEP Approved.</h1>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">${greeting}</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">I'm so glad you're here. This community was built for families like yours — because every parent and caregiver deserves to walk into that room informed, prepared, and ready to advocate for their child.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">You now have <strong style="color: #D4A843;">10 free questions with Ada this month</strong>. Ask her anything — your rights, the IEP process, what the law says. She's here for you, in English and Spanish, any time of day.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">And when you're ready for more — Ada Unlimited is just $4.99 a month. Less than a cup of coffee. Think of it like grabbing coffee with a friend who happens to know everything about special education law — available whenever you need her, no appointment necessary.</p>
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://www.iepapproved.com/ada" style="background: #D4A843; color: #2D1B4E; padding: 14px 28px; border-radius: 8px; text-decoration: none; font-weight: 800; font-size: 16px; font-family: Arial, sans-serif;">Talk to Ada today →</a>
      </div>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">We're building something special here. Not just a tool — a community. A place where knowledge meets heart, and where every win gets celebrated.</p>
      <p style="color: #e8e0f0; font-size: 16px; line-height: 1.7;">Join us on social media — follow along for IEP rights, real family stories, community events, and celebrating every win:</p>
      <p style="color: #D4A843; font-size: 15px;">TikTok: @iepapproved.com<br/>Facebook: facebook.com/IEPapproved</p>
      <p style="color: #b8a8d0; font-size: 15px; line-height: 1.7; margin-top: 32px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 24px;">— Kimberly<br/><em>Robbie's Mom and Founder, IEP Approved LLC</em></p>
    </div>
  `;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Kimberly at IEP Approved <info@iepapproved.com>',
        to: [email],
        subject,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('Resend error:', err);
      return res.status(500).json({ error: 'Email failed to send' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Email signup error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
