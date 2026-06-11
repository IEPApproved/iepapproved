// pages/api/create-portal.js
// Opens the Stripe customer billing portal so members can manage or cancel their subscription

import Stripe from 'stripe'
import { createServerClient } from '../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

try {
const supabase = createServerClient(req, res)
const { data: { user } } = await supabase.auth.getUser()
if (!user || !user.email) return res.status(401).json({ error: 'Sign in required' })

const customers = await stripe.customers.list({ email: user.email, limit: 1 })
const customer = customers?.data?.[0]
if (!customer) return res.status(404).json({ error: 'No billing record found for this account' })

const session = await stripe.billingPortal.sessions.create({
customer: customer.id,
return_url: 'https://www.iepapproved.com/ada',
})

return res.status(200).json({ url: session.url })
} catch (err) {
console.error('Portal error:', err)
return res.status(500).json({ error: 'Could not open billing portal' })
}
}
