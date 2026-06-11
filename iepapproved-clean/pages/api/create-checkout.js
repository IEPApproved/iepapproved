import Stripe from 'stripe'
import { createAdminClient } from '../../lib/supabase'

// Server-side plan to Stripe price mapping. Never trust raw price IDs from the client.
const PLAN_PRICES = {
unlimited: 'price_1TfOauPsMEtDZUDk1o4Vcy1c',
pro: 'price_1TgsAIPsMEtDZUDkhGthFCEP',
advocate: 'price_1TgsDOPsMEtDZUDkIvPRq7Hf',
unlimited_annual: 'price_1Tgs6gPsMEtDZUDkdT1pi1ZU',
pro_annual: 'price_1TgsQbPsMEtDZUDkkda2cmdN',
advocate_annual: 'price_1TgsT7PsMEtDZUDkDeSfzA7l',
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { plan, priceId: clientPriceId, email } = req.body

// Resolve price: prefer the plan key; allow a legacy client priceId only if it is one of ours
const priceId = PLAN_PRICES[plan] || (Object.values(PLAN_PRICES).includes(clientPriceId) ? clientPriceId : null)

if (!priceId) {
return res.status(400).json({ error: 'Invalid plan' })
}

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
