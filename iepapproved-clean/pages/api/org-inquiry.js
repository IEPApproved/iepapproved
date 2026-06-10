// pages/api/org-inquiry.js
// Organizations lead capture: sends inquiry to IEP Approved via Resend

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

const { name, email, organization, role, size, message } = req.body;
if (!name || !email || !organization) {
return res.status(400).json({ error: 'Name, email, and organization are required' });
}

const html = `
<div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
<h2 style='color: #2D1B4E;'>New Organization Inquiry</h2>
<p><strong>Name:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Organization:</strong> ${organization}</p>
<p><strong>Role:</strong> ${role || 'Not provided'}</p>
<p><strong>Organization size:</strong> ${size || 'Not provided'}</p>
<p><strong>Message:</strong></p>
<p style='background: #f5f3ff; padding: 12px; border-radius: 8px;'>${message || 'No message'}</p>
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
from: 'IEP Approved Organizations <info@iepapproved.com>',
to: ['info@iepapproved.com'],
reply_to: email,
subject: `Organization inquiry: ${organization}`,
html,
}),
});

if (!response.ok) {
const err = await response.text();
console.error('Resend error:', err);
return res.status(500).json({ error: 'Failed to send inquiry' });
}

return res.status(200).json({ success: true });
} catch (err) {
console.error('Org inquiry error:', err);
return res.status(500).json({ error: 'Internal server error' });
}
}
