// pages/api/admin/set-tier.js
// Admin-only: manually change a member's tier (comp, fix, downgrade).
// Verifies the caller is a known admin before touching anyone's account.

import { createAdminClient } from '../../../lib/supabase'

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  'kimberly.sandro@iepapproved.com',
  'info@iepapproved.com',
].filter(Boolean)

const VALID_TIERS = ['free', 'unlimited', 'pro', 'advocate']

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  const { id, tier } = req.body || {}
  if (!id || !VALID_TIERS.includes(tier)) {
    return res.status(400).json({ error: 'Invalid request' })
  }

  const supabase = createAdminClient()

  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData?.user || !ADMIN_EMAILS.includes(userData.user.email)) {
    return res.status(403).json({ error: 'Admins only' })
  }

  // Manual tier change clears any trial countdown (a comp is open-ended).
  const { error } = await supabase
    .from('profiles')
    .update({ tier, trial_ends_at: null, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) {
    console.error('set-tier error:', error)
    return res.status(500).json({ error: 'Update failed' })
  }

  return res.status(200).json({ ok: true, id, tier })
}
