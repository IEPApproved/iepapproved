import Stripe from 'stripe'
import { createAdminClient } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId, email } = req.body

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Valid email required' })
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  })

  try {
    // Pre-create (upsert) a Supabase profile for this email so the
    // Stripe webhook has a row to update on checkout.session.completed.
    // If the user already has an account this is a no-op (onConflict: email).
    const supabase = createAdminClient()
    const { error: upsertError } = await supabase
      .from('profiles')
      .upsert(
        {
          email,
          tier: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: 'email',
          ignoreDuplicates: true, // don't overwrite existing profiles
        }
      )

    if (upsertError) {
      // Non-fatal — log but proceed. Webhook will handle the upgrade.
      console.error('Profile pre-create error (non-fatal):', upsertError.message)
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      customer_email: email,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: 'https://www.iepapproved.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://www.iepapproved.com/signup',
    })

    return res.status(200).json({ url: session.url })
  } catch (err) {
    console.error('Stripe error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}
