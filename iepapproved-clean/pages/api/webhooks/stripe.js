// pages/api/webhooks/stripe.js  ← CREATE this file
// Handles Stripe events: payment → upgrade Supabase tier + send welcome email

import Stripe from 'stripe'
import { createAdminClient } from '../../../lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

// Stripe price ID to Supabase tier
const PRICE_TIERS = {
'price_1TfOauPsMEtDZUDk1o4Vcy1c': 'unlimited',
'price_1Tgs6gPsMEtDZUDkdT1pi1ZU': 'unlimited',
'price_1TgsAIPsMEtDZUDkhGthFCEP': 'pro',
'price_1TgsQbPsMEtDZUDkkda2cmdN': 'pro',
'price_1TgsDOPsMEtDZUDkIvPRq7Hf': 'advocate',
'price_1TgsT7PsMEtDZUDkDeSfzA7l': 'advocate',
}

// REQUIRED: disable body parsing so we get the raw body for Stripe signature verification
export const config = {
  api: {
    bodyParser: false,
  },
}

// Helper: read raw body from request
async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('data', chunk => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
    req.on('error', reject)
  })
}

// Welcome email - English
function welcomeEmailEN(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f7ff;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#1a5276 0%,#1f618d 100%);padding:40px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;color:white;">IEP<span style="color:#52d68a;">approved</span></div>
        <div style="color:#a9cce3;font-size:14px;margin-top:4px;">Ada Unlimited · Active</div>
      </div>
      <div style="padding:40px;">
        <h1 style="font-size:24px;color:#1a5276;margin:0 0 16px;">Welcome to IEP Approved, ${name || 'friend'}. 💙</h1>
        <p style="color:#4a4a4a;line-height:1.7;font-size:16px;">I'm so glad you're here. As a parent who has sat across that IEP table feeling overwhelmed and unsure what questions to even ask — I built this for you.</p>
        <p style="color:#4a4a4a;line-height:1.7;font-size:16px;">Your <strong>Ada Unlimited</strong> subscription is now active. That means:</p>
        <ul style="color:#4a4a4a;line-height:2;font-size:15px;padding-left:20px;">
          <li>✅ <strong>Unlimited conversations</strong> with Ada, your AI IEP advocate</li>
          <li>✅ <strong>State-specific guidance</strong> — laws, PTI centers, and advocacy orgs in your state</li>
          <li>✅ <strong>Bilingual support</strong> — English and Spanish, always</li>
          <li>✅ <strong>Voice input & output</strong> — ask questions your way</li>
        </ul>
        <div style="text-align:center;margin:32px 0;">
          <a href="https://iepapproved.com/ada" style="background:#1a5276;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">Talk to Ada Now →</a>
        </div>
        <p style="color:#4a4a4a;line-height:1.7;font-size:15px;">You are not alone in this. Ada is here whenever you need her — 24 hours a day, no waiting room, no judgment.</p>
        <hr style="border:none;border-top:1px solid #e8edf2;margin:32px 0;">
        <p style="color:#7f8c8d;font-size:14px;text-align:center;">
          Join our community: <a href="https://www.facebook.com/iepapproved" style="color:#1a5276;">Facebook</a> · <a href="https://www.tiktok.com/@iepapproved" style="color:#1a5276;">TikTok</a> · <a href="https://www.instagram.com/iepapproved" style="color:#1a5276;">Instagram</a>
        </p>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8edf2;">
          <p style="color:#4a4a4a;font-size:15px;margin:0;">With you every step,</p>
          <p style="color:#1a5276;font-size:18px;font-style:italic;margin:4px 0 0;">Kimberly</p>
          <p style="color:#7f8c8d;font-size:13px;margin:4px 0 0;">Founder, IEP Approved LLC · IEP Parent · Your Advocate</p>
        </div>
      </div>
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e8edf2;">
        <p style="color:#aab7c4;font-size:12px;margin:0;">© ${new Date().getFullYear()} IEP Approved, LLC · Ada provides AI information, not legal advice.</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

// Welcome email - Spanish
function welcomeEmailES(name) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f0f7ff;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
      <div style="background:linear-gradient(135deg,#1a5276 0%,#1f618d 100%);padding:40px;text-align:center;">
        <div style="font-size:28px;font-weight:bold;color:white;">IEP<span style="color:#52d68a;">approved</span></div>
        <div style="color:#a9cce3;font-size:14px;margin-top:4px;">Ada Sin Límites · Activo</div>
      </div>
      <div style="padding:40px;">
        <h1 style="font-size:24px;color:#1a5276;margin:0 0 16px;">Bienvenida a IEP Approved, ${name || 'amiga'}. 💙</h1>
        <p style="color:#4a4a4a;line-height:1.7;font-size:16px;">Me alegra mucho que estés aquí. Como madre que ha estado sentada frente a esa mesa de IEP sintiéndose abrumada — construí esto para ti.</p>
        <p style="color:#4a4a4a;line-height:1.7;font-size:16px;">Tu suscripción <strong>Ada Sin Límites</strong> ya está activa. Eso significa:</p>
        <ul style="color:#4a4a4a;line-height:2;font-size:15px;padding-left:20px;">
          <li>✅ <strong>Conversaciones ilimitadas</strong> con Ada</li>
          <li>✅ <strong>Orientación específica por estado</strong></li>
          <li>✅ <strong>Apoyo bilingüe</strong> — inglés y español, siempre</li>
          <li>✅ <strong>Entrada y salida de voz</strong></li>
        </ul>
        <div style="text-align:center;margin:32px 0;">
          <a href="https://iepapproved.com/ada" style="background:#1a5276;color:white;padding:14px 32px;border-radius:50px;text-decoration:none;font-size:16px;font-weight:bold;display:inline-block;">Habla con Ada Ahora →</a>
        </div>
        <div style="margin-top:32px;padding-top:24px;border-top:1px solid #e8edf2;">
          <p style="color:#4a4a4a;font-size:15px;margin:0;">Contigo en cada paso,</p>
          <p style="color:#1a5276;font-size:18px;font-style:italic;margin:4px 0 0;">Kimberly</p>
          <p style="color:#7f8c8d;font-size:13px;margin:4px 0 0;">Fundadora, IEP Approved LLC</p>
        </div>
      </div>
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e8edf2;">
        <p style="color:#aab7c4;font-size:12px;margin:0;">© ${new Date().getFullYear()} IEP Approved, LLC</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

async function sendWelcomeEmail(email, name, lang) {
  const isSpanish = lang === 'es'
  const subject = isSpanish
    ? '¡Bienvenida a IEP Approved — Ada Sin Límites está activa! 💙'
    : 'Welcome to IEP Approved — Ada Unlimited is active! 💙'

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Kimberly at IEP Approved <info@iepapproved.com>',
      to: [email],
      subject,
      html: isSpanish ? welcomeEmailES(name) : welcomeEmailEN(name),
    }),
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(`Resend failed: ${errText}`)
  }
  return res.json()
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const rawBody = await getRawBody(req)
  const signature = req.headers['stripe-signature']

  if (!signature) {
    return res.status(400).json({ error: 'No stripe-signature header' })
  }

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
  } catch (err) {
    console.error('Webhook signature error:', err.message)
    return res.status(400).json({ error: `Webhook Error: ${err.message}` })
  }

  const supabase = createAdminClient()

  try {
    switch (event.type) {

      // ✅ PAYMENT SUCCESS → upgrade to unlimited + welcome email
      case 'checkout.session.completed': {
        const session = event.data.object
        const customerEmail = session.customer_details?.email || session.customer_email
        const customerId = session.customer
        const subscriptionId = session.subscription

// Determine tier from the purchased price (defaults to unlimited)
let purchasedTier = 'unlimited'
try {
const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 1 })
const purchasedPriceId = lineItems?.data?.[0]?.price?.id
if (purchasedPriceId && PRICE_TIERS[purchasedPriceId]) purchasedTier = PRICE_TIERS[purchasedPriceId]
} catch (liErr) {
console.error('Line item lookup error (defaulting to unlimited):', liErr.message)
}

        if (!customerEmail) {
          console.error('No email in checkout session')
          break
        }

        // Upsert so this works even if the profile row doesn't exist yet
        // (e.g. user paid before creating an account)
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .upsert(
            {
              email: customerEmail,
              tier: purchasedTier,
              stripe_customer_id: customerId,
              stripe_subscription_id: subscriptionId,
              subscription_status: 'active',
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'email' }
          )
          .select()
          .single()

        if (profileError) {
          console.error('Profile update error:', profileError)
        } else {
          console.log('✅ Upgraded:', customerEmail)
          try {
            await sendWelcomeEmail(
              customerEmail,
              profile?.full_name || '',
              profile?.language_preference || 'en'
            )
            console.log('✅ Welcome email sent:', customerEmail)
          } catch (emailErr) {
            // Non-fatal — log but don't fail the webhook
            console.error('Email error (non-fatal):', emailErr)
          }
        }
        break
      }

      // ✅ Subscription active (renewal)
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object
        const customerId = invoice.customer
        const customer = await stripe.customers.retrieve(customerId)
        if (customer.deleted || !customer.email) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'active', updated_at: new Date().toISOString() })
          .eq('email', customer.email)
        break
      }

      // ❌ Cancelled → revert to free
      case 'customer.subscription.deleted':
      case 'customer.subscription.paused': {
        const sub = event.data.object
        const customer = await stripe.customers.retrieve(sub.customer)
        if (customer.deleted || !customer.email) break

        await supabase
          .from('profiles')
          .update({
            tier: 'free',
            subscription_status: 'cancelled',
            stripe_subscription_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customer.email)

        console.log('⬇️ Reverted to free:', customer.email)
        break
      }

      // ⚠️ Payment failed
      case 'invoice.payment_failed': {
        const invoice = event.data.object
        const customer = await stripe.customers.retrieve(invoice.customer)
        if (customer.deleted || !customer.email) break

        await supabase
          .from('profiles')
          .update({ subscription_status: 'past_due', updated_at: new Date().toISOString() })
          .eq('email', customer.email)
        break
      }

      // Plan changed (upgrade or downgrade via billing portal) - sync tier
      case 'customer.subscription.updated': {
        const sub = event.data.object
        if (sub.status !== 'active' && sub.status !== 'trialing') break
        const customer = await stripe.customers.retrieve(sub.customer)
        if (customer.deleted || !customer.email) break
        const priceId = sub.items?.data?.[0]?.price?.id
        const newTier = PRICE_TIERS[priceId]
        if (!newTier) break
        await supabase
          .from('profiles')
          .update({
            tier: newTier,
            subscription_status: 'active',
            stripe_customer_id: sub.customer,
            stripe_subscription_id: sub.id,
            updated_at: new Date().toISOString(),
          })
          .eq('email', customer.email)
        console.log('Plan synced:', customer.email, newTier)
        break
      }

      default:
        console.log(`Unhandled: ${event.type}`)
    }

    return res.status(200).json({ received: true })

  } catch (err) {
    console.error('Webhook handler error:', err)
    return res.status(500).json({ error: err.message })
  }
}
