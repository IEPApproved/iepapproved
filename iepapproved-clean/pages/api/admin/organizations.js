// pages/api/admin/organizations.js
// Admin-only CRUD for the organizations directory (service key, bypasses RLS).

import { createAdminClient } from '../../../lib/supabase'

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  'kimberly.sandro@iepapproved.com',
  'info@iepapproved.com',
].filter(Boolean)

const TYPES = ['pti', 'advocacy', 'protection_advocacy']

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

  const { action } = req.body || {}

  // LIST — all orgs for a state (admin sees hidden rows too)
  if (action === 'list') {
    const { state_code } = req.body || {}
    let query = supabase
      .from('organizations')
      .select('*')
      .order('type', { ascending: true })
      .order('sort_order', { ascending: true })
    if (state_code && state_code.trim()) {
      query = query.ilike('state_code', state_code.trim())
    }
    const { data, error } = await query
    if (error) {
      console.error('organizations list error:', error)
      return res.status(500).json({ error: 'Lookup failed' })
    }
    return res.status(200).json({ organizations: data || [] })
  }

  // SAVE — insert (no id) or update (with id)
  if (action === 'save') {
    const { org } = req.body || {}
    if (!org || !org.state_code || !org.name || !org.type) {
      return res.status(400).json({ error: 'state_code, name, and type are required' })
    }
    if (!TYPES.includes(org.type)) {
      return res.status(400).json({ error: 'Invalid type' })
    }
    const so = parseInt(org.sort_order, 10)
    const row = {
      state_code: String(org.state_code).trim().toUpperCase(),
      type: org.type,
      name: String(org.name).trim(),
      website: org.website ? String(org.website).trim() : null,
      phone: org.phone ? String(org.phone).trim() : null,
      description: org.description ? String(org.description).trim() : null,
      sort_order: Number.isFinite(so) ? so : 0,
      is_active: org.is_active === false ? false : true,
      updated_at: new Date().toISOString(),
    }
    let result
    if (org.id) {
      result = await supabase.from('organizations').update(row).eq('id', org.id).select().single()
    } else {
      result = await supabase.from('organizations').insert(row).select().single()
    }
    if (result.error) {
      console.error('organizations save error:', result.error)
      return res.status(500).json({ error: 'Save failed' })
    }
    return res.status(200).json({ organization: result.data })
  }

  // DELETE — remove by id
  if (action === 'delete') {
    const { id } = req.body || {}
    if (!id) return res.status(400).json({ error: 'id required' })
    const { error } = await supabase.from('organizations').delete().eq('id', id)
    if (error) {
      console.error('organizations delete error:', error)
      return res.status(500).json({ error: 'Delete failed' })
    }
    return res.status(200).json({ ok: true })
  }

  return res.status(400).json({ error: 'Unknown action' })
}
