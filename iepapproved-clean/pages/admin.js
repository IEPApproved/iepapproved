// pages/admin.js  ← CREATE this file
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'
import { createClient } from '../lib/supabase'

const ADMIN_EMAILS = [
  process.env.NEXT_PUBLIC_ADMIN_EMAIL,
  'kimberly.sandro@iepapproved.com',
  'info@iepapproved.com',
].filter(Boolean)
const isAdmin = (email) => ADMIN_EMAILS.includes(email)

const US_STATES = [
  'Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut',
  'Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa',
  'Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan',
  'Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada',
  'New Hampshire','New Jersey','New Mexico','New York','North Carolina',
  'North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island',
  'South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont',
  'Virginia','Washington','West Virginia','Wisconsin','Wyoming'
]

const STATE_CODES = {
  'Alabama':'AL','Alaska':'AK','Arizona':'AZ','Arkansas':'AR','California':'CA',
  'Colorado':'CO','Connecticut':'CT','Delaware':'DE','Florida':'FL','Georgia':'GA',
  'Hawaii':'HI','Idaho':'ID','Illinois':'IL','Indiana':'IN','Iowa':'IA',
  'Kansas':'KS','Kentucky':'KY','Louisiana':'LA','Maine':'ME','Maryland':'MD',
  'Massachusetts':'MA','Michigan':'MI','Minnesota':'MN','Mississippi':'MS',
  'Missouri':'MO','Montana':'MT','Nebraska':'NE','Nevada':'NV','New Hampshire':'NH',
  'New Jersey':'NJ','New Mexico':'NM','New York':'NY','North Carolina':'NC',
  'North Dakota':'ND','Ohio':'OH','Oklahoma':'OK','Oregon':'OR','Pennsylvania':'PA',
  'Rhode Island':'RI','South Carolina':'SC','South Dakota':'SD','Tennessee':'TN',
  'Texas':'TX','Utah':'UT','Vermont':'VT','Virginia':'VA','Washington':'WA',
  'West Virginia':'WV','Wisconsin':'WI','Wyoming':'WY'
}

export default function AdminDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [tab, setTab] = useState('members')
  const [members, setMembers] = useState([])
  const [search, setSearch] = useState('')
  const [testimonials, setTestimonials] = useState([])
  const [stats, setStats] = useState({ total: 0, unlimited: 0, free: 0, todaySignups: 0 })
  const [dataLoading, setDataLoading] = useState(true)
  const [stateForm, setStateForm] = useState({ state_code: '', state_name: '', complaint_procedures: '', additional_context: '' })
  const [stateSaving, setStateSaving] = useState(false)
  const [stateSuccess, setStateSuccess] = useState('')

  // Auth guard
  useEffect(() => {
    if (!loading && (!user || !isAdmin(user.email))) {
      router.replace('/')
    }
  }, [user, loading])

  useEffect(() => {
    if (user?.email && isAdmin(user.email)) loadData()
  }, [user])

  const loadData = async () => {
    setDataLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''
    const membersRes = await fetch('/api/admin/list-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({}),
    })
    const membersJson = await membersRes.json().catch(() => ({}))
    const membersData = membersJson.users || []

    if (membersData) {
      setMembers(membersData)
      const today = new Date().toDateString()
      setStats({
        total: membersData.length,
        unlimited: membersData.filter(m => m.tier === 'unlimited').length,
        free: membersData.filter(m => m.tier === 'free').length,
        todaySignups: membersData.filter(m => new Date(m.created_at).toDateString() === today).length,
      })
    }

    const { data: testimonialsData } = await supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false })

    if (testimonialsData) setTestimonials(testimonialsData)
    setDataLoading(false)
  }

  const searchUsers = async (q) => {
    const { data: { session } } = await supabase.auth.getSession()
    const token = session?.access_token || ''
    const res = await fetch('/api/admin/list-users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ q }),
    })
    const json = await res.json().catch(() => ({}))
    setMembers(json.users || [])
  }

  const toggleTestimonial = async (id, approved) => {
    await supabase.from('testimonials').update({ approved: !approved }).eq('id', id)
    setTestimonials(prev => prev.map(t => t.id === id ? { ...t, approved: !approved } : t))
  }

  const updateTier = async (id, newTier) => {
    const prevMembers = members
    setMembers(ms => ms.map(m => m.id === id ? { ...m, tier: newTier } : m))
    const { data: { session } } = await supabase.auth.getSession()
    const res = await fetch('/api/admin/set-tier', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + (session?.access_token || '') },
      body: JSON.stringify({ id, tier: newTier }),
    })
    if (!res.ok) { setMembers(prevMembers); alert('Could not update tier.') } else { loadData() }
  }

  const handleStateNameChange = (name) => {
    setStateForm(f => ({
      ...f,
      state_name: name,
      state_code: STATE_CODES[name] || '',
    }))
  }

  const saveStateContent = async () => {
    if (!stateForm.state_code || !stateForm.state_name) return
    setStateSaving(true)
    setStateSuccess('')
    const { error } = await supabase.from('state_content').upsert({
      ...stateForm,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'state_code' })

    if (!error) {
      setStateSuccess(`✅ ${stateForm.state_name} saved!`)
      setStateForm({ state_code: '', state_name: '', complaint_procedures: '', additional_context: '' })
    }
    setStateSaving(false)
  }

  if (loading || !user) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: '32px', height: '32px', border: '3px solid #e8edf2', borderTop: '3px solid #1a5276', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!isAdmin(user.email)) return null

  const mrr = (stats.unlimited * 4.99).toFixed(2)

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Georgia, serif' }}>

      {/* Header */}
      <div style={{ background: '#1a5276', color: 'white', padding: '16px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold' }}>IEP Approved · Admin</div>
            <div style={{ color: '#a9cce3', fontSize: '13px' }}>Welcome back, Kimberly 👋</div>
          </div>
          <div style={{ color: '#a9cce3', fontSize: '13px' }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { label: 'Total Members', value: stats.total, bg: '#eff6ff', color: '#1d4ed8' },
            { label: 'Unlimited', value: stats.unlimited, bg: '#f0fdf4', color: '#16a34a' },
            { label: 'Free Users', value: stats.free, bg: '#f9fafb', color: '#374151' },
            { label: "Today's Signups", value: stats.todaySignups, bg: '#faf5ff', color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', color: s.color }}>{s.value}</div>
              <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* MRR */}
        <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '16px 20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', color: '#6b7280', fontWeight: '500' }}>Estimated Monthly Recurring Revenue</span>
          <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>${mrr}/mo</span>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '2px solid #e5e7eb', paddingBottom: '0' }}>
          {[['members', 'Members'], ['testimonials', 'Testimonials'], ['states', 'State Content']].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              style={{
                padding: '10px 20px',
                border: 'none',
                background: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                color: tab === id ? '#1a5276' : '#9ca3af',
                borderBottom: tab === id ? '2px solid #1a5276' : '2px solid transparent',
                marginBottom: '-2px',
                fontFamily: 'inherit',
              }}
            >
              {label}
              {id === 'testimonials' && testimonials.filter(t => !t.approved).length > 0 && (
                <span style={{ marginLeft: '6px', background: '#fef3c7', color: '#92400e', fontSize: '11px', padding: '2px 6px', borderRadius: '50px' }}>
                  {testimonials.filter(t => !t.approved).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Members tab */}
        {tab === 'members' && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: '8px', padding: '16px', borderBottom: '1px solid #e5e7eb', alignItems: 'center' }}>
              <input type="text" value={search} onChange={e => setSearch(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') searchUsers(search) }} placeholder="Search by email..." style={{ flex: 1, maxWidth: '320px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', fontFamily: 'inherit' }} />
              <button onClick={() => searchUsers(search)} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: '#2D1B4E', color: 'white', fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit' }}>Search</button>
              <button onClick={() => { setSearch(''); loadData() }} style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #d1d5db', background: 'white', color: '#6b7280', fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit' }}>Show all</button>
            </div>
            {dataLoading ? (
              <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      {['Name', 'Email', 'State', 'Tier', 'Status', 'Questions Today', 'Joined'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {members.map(m => (
                      <tr key={m.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                        <td style={{ padding: '12px 16px', fontWeight: '500', color: '#1a1a1a' }}>{m.full_name || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#6b7280' }}>{m.email}</td>
                        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{m.state || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <select value={m.tier || 'free'} onChange={e => updateTier(m.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #d1d5db', fontSize: '12px', fontFamily: 'inherit', cursor: 'pointer' }}>
                            <option value="free">free</option>
                            <option value="unlimited">unlimited</option>
                            <option value="pro">pro</option>
                            <option value="advocate">advocate</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px 16px', fontSize: '12px', color: m.subscription_status === 'active' ? '#16a34a' : m.subscription_status === 'past_due' ? '#dc2626' : '#9ca3af' }}>
                          {m.subscription_status}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#9ca3af' }}>{m.questions_used_today}</td>
                        <td style={{ padding: '12px 16px', color: '#9ca3af', fontSize: '12px' }}>{new Date(m.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {members.length === 0 && (
                  <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No members yet.</div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Testimonials tab */}
        {tab === 'testimonials' && (
          <div>
            <p style={{ color: '#6b7280', fontSize: '14px', marginBottom: '16px' }}>Approve 4–5 star reviews to display publicly on the site.</p>
            {testimonials.length === 0 && (
              <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '48px', textAlign: 'center', color: '#9ca3af' }}>No testimonials yet.</div>
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {testimonials.map(t => (
                <div key={t.id} style={{
                  background: 'white', borderRadius: '12px',
                  border: `1px solid ${t.approved ? '#bbf7d0' : '#e5e7eb'}`,
                  padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ color: '#fbbf24' }}>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</span>
                      <span style={{ fontWeight: '500', fontSize: '14px' }}>{t.author_name || 'Anonymous'}</span>
                      <span style={{ color: '#9ca3af', fontSize: '12px' }}>{new Date(t.created_at).toLocaleDateString()}</span>
                    </div>
                    <p style={{ color: '#374151', fontSize: '14px', lineHeight: '1.6', margin: 0 }}>{t.content}</p>
                  </div>
                  <button
                    onClick={() => toggleTestimonial(t.id, t.approved)}
                    style={{
                      flexShrink: 0, padding: '8px 16px', borderRadius: '8px', border: 'none',
                      cursor: 'pointer', fontSize: '13px', fontWeight: '500',
                      background: t.approved ? '#fef2f2' : '#f0fdf4',
                      color: t.approved ? '#dc2626' : '#16a34a',
                      fontFamily: 'inherit',
                    }}
                  >
                    {t.approved ? 'Unpublish' : 'Approve'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* State content tab */}
        {tab === 'states' && (
          <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 8px' }}>Upload State-Specific Content</h2>
            <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>
              This content is injected into Ada's context for Unlimited members in that state. More detail = better answers.
            </p>

            {stateSuccess && (
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '14px', color: '#16a34a' }}>
                {stateSuccess}
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>State</label>
                <select
                  value={stateForm.state_name}
                  onChange={e => handleStateNameChange(e.target.value)}
                  style={{ ...fieldStyle, background: 'white' }}
                >
                  <option value="">Select a state...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s} ({STATE_CODES[s]})</option>)}
                </select>
              </div>

              <div>
                <label style={labelStyle}>Complaint Procedures</label>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 6px' }}>
                  How to file a due process complaint, state complaint, mediation request, etc.
                </p>
                <textarea rows={5} value={stateForm.complaint_procedures}
                  onChange={e => setStateForm(f => ({ ...f, complaint_procedures: e.target.value }))}
                  placeholder="In Florida, parents can file a state complaint with the Bureau of Exceptional Education..."
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>

              <div>
                <label style={labelStyle}>Additional Context for Ada</label>
                <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 6px' }}>
                  PTI centers, advocacy orgs, state-specific laws, timelines, contact info. Ada will use this to answer questions.
                </p>
                <textarea rows={8} value={stateForm.additional_context}
                  onChange={e => setStateForm(f => ({ ...f, additional_context: e.target.value }))}
                  placeholder="Florida PTI Center: Family Network on Disabilities, 1-800-825-5736, fndfl.org..."
                  style={{ ...fieldStyle, resize: 'vertical' }}
                />
              </div>

              <button
                onClick={saveStateContent}
                disabled={stateSaving || !stateForm.state_code}
                style={{
                  background: stateSaving || !stateForm.state_code ? '#93afc4' : '#1a5276',
                  color: 'white', border: 'none', borderRadius: '10px',
                  padding: '12px 24px', fontSize: '14px', fontWeight: '600',
                  cursor: stateSaving || !stateForm.state_code ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', alignSelf: 'flex-start',
                }}
              >
                {stateSaving ? 'Saving...' : 'Save State Content'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const labelStyle = {
  display: 'block', fontSize: '13px', fontWeight: '600',
  color: '#374151', marginBottom: '6px'
}

const fieldStyle = {
  width: '100%', padding: '10px 14px', borderRadius: '10px',
  border: '1px solid #e5e7eb', fontSize: '14px', color: '#1a1a1a',
  outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box',
}
