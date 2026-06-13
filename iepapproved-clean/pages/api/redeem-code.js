// pages/api/redeem-code.js
// Validates a promo code server-side (service key) and applies a timed trial
// to the signed-in user's profile. Codes never touch the browser.

import { createAdminClient } from '../../lib/supabase'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!token) {
    return res.status(401).json({ error: 'Please sign in first.' })
  }

  const code = String(req.body?.code || '').trim().toUpperCase()
  if (!code) {
    return res.status(400).json({ error: 'Enter a code.' })
  }

  const supabase = createAdminClient()

  // Identify the user from their session token
  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData?.user) {
    return res.status(401).json({ error: 'Your session expired — please sign in again.' })
  }
  const user = userData.user

  // Look up the code (RLS-protected table; only the service key can read it)
  const { data: promo, error: promoErr } = await supabase
    .from('promo_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (promoErr || !promo || !promo.active) {
    return res.status(404).json({ error: "That code isn't valid." })
  }
  if (promo.max_uses != null && promo.uses >= promo.max_uses) {
    return res.status(409).json({ error: 'This code has been fully redeemed.' })
  }

  const trialEndsAt = new Date(Date.now() + promo.duration_days * 24 * 60 * 60 * 1000).toISOString()

  const { error: upErr } = await supabase
    .from('profiles')
    .upsert(
      {
        id: user.id,
        email: user.email,
        tier: promo.tier,
        trial_ends_at: trialEndsAt,
        trial_code: code,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    )

  if (upErr) {
    console.error('Redeem upsert error:', upErr)
    return res.status(500).json({ error: 'Something went wrong applying your code.' })
  }

  // Best-effort usage increment (non-fatal)
  await supabase.from('promo_codes').update({ uses: (promo.uses || 0) + 1 }).eq('code', code)

  return res.status(200).json({
    tier: promo.tier,
    days: promo.duration_days,
    trial_ends_at: trialEndsAt,
  })
}
