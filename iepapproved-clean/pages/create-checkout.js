import Stripe from 'stripe'
 
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
 
  const { priceId, email } = req.body
 
  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Stripe not configured' })
  }
 
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
 
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email || undefined,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `https://www.iepapproved.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://www.iepapproved.com/signup`,
      metadata: { priceId },
    })
    res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err)
    res.status(500).json({ error: err.message })
  }
}
 
