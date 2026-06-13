// pages/api/admin/list-users.js
// Admin-only: list or search all members via the service key (bypasses RLS).

import { createAdminClient } from '../../../lib/supabase'

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  'kimberly.sandro@iepapproved.com',
  'info@iepapproved.com',
].filter(Boolean)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const token = (req.headers.authorization || '').replace('Bearer ', '').trim()
  if (!token) return res.status(401).json({ error: 'Not authenticated' })

  const supabase = createAdminClient()

  const { data: userData, error: userErr } = await supabase.auth.getUser(token)
  if (userErr || !userData?.user || !ADMIN_EMAILS.includes(userData.user.email)) {
    return res.status(403).json({ error: 'Admins only' })
  }

  const { q } = req.body || {}

  let query = supabase
    .from('profiles')
    .select('id, email, full_name, tier, state, subscription_status, questions_used_today, created_at')
    .order('created_at', { ascending: false })

  if (q && q.trim()) {
    query = query.ilike('email', '%' + q.trim() + '%').limit(50)
  } else {
    query = query.limit(500)
  }

  const { data, error } = await query
  if (error) {
    console.error('list-users error:', error)
    return res.status(500).json({ error: 'Lookup failed' })
  }

  return res.status(200).json({ users: data || [] })
}
