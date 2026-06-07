import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', role: '', subject: '', message: '' })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const update = (field, value) => setForm(prev => ({ ...prev, [field]: value }))

  if (!mounted) return null

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      setError('Please fill in your name, email, and message.')
      return
    }
    if (!form.email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        setSubmitted(true)
      } else {
        setError('Something went wrong. Please try again or email us directly.')
      }
    } catch {
      setError('Something went wrong. Please email us directly at info@iepapproved.com')
    }
    setSubmitting(false)
  }

  return (
    <>
      <Head>
        <title>Contact — IEP Approved</title>
        <meta name="description" content="Contact the IEP Approved team." />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <nav style={s.nav}>
        <a href="/" style={s.navLogo}>IEP <span style={{color:'#D4A843'}}>Approved</span></a>
        <a href="/" style={s.backLink}>← Back to Home</a>
      </nav>

      <div style={s.page}>
        <div style={s.container}>

          {/* LEFT — info */}
          <div style={s.left}>
            <span style={s.label}>Get in Touch</span>
            <h1 style={s.title}>We&apos;re here to help.</h1>
            <p style={s.sub}>Have a question about IEP Approved, Ada, or your subscription? We&apos;d love to hear from you. We read and respond to every message.</p>

            <div style={s.infoCards}>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>📧</div>
                <div>
                  <div style={s.infoTitle}>Email us directly</div>
                  <a href="mailto:info@iepapproved.com" style={s.infoLink}>info@iepapproved.com</a>
                </div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>⏱️</div>
                <div>
                  <div style={s.infoTitle}>Response time</div>
                  <div style={s.infoDesc}>We typically respond within 1-2 business days</div>
                </div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>🤖</div>
                <div>
                  <div style={s.infoTitle}>Quick answers</div>
                  <div style={s.infoDesc}>For IEP law questions, <a href="/ada" style={s.infoLink}>ask Ada</a> — she&apos;s available 24/7</div>
                </div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoIcon}>🏢</div>
                <div>
                  <div style={s.infoTitle}>District & school inquiries</div>
                  <div style={s.infoDesc}>Interested in staff training or district licensing? Let us know in your message.</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — form */}
          <div style={s.right}>
            {submitted ? (
              <div style={s.successCard}>
                <div style={s.successIcon}>✓</div>
                <h2 style={s.successTitle}>Message received!</h2>
                <p style={s.successSub}>Thank you for reaching out. We&apos;ll get back to you at <strong>{form.email}</strong> within 1-2 business days.</p>
                <p style={s.successNote}>You can also reach us anytime at <a href="mailto:info@iepapproved.com" style={s.infoLink}>info@iepapproved.com</a></p>
                <a href="/" style={s.homeBtn}>← Back to Home</a>
              </div>
            ) : (
              <div style={s.card}>
                <h2 style={s.cardTitle}>Send us a message</h2>

                <div style={s.row}>
                  <div style={s.formGroup}>
                    <label style={s.fieldLabel}>Your name <span style={{color:'#ef4444'}}>*</span></label>
                    <input style={s.input} type="text" placeholder="Kimberly Sandro" value={form.name} onChange={e => update('name', e.target.value)} />
                  </div>
                  <div style={s.formGroup}>
                    <label style={s.fieldLabel}>Email address <span style={{color:'#ef4444'}}>*</span></label>
                    <input style={s.input} type="email" placeholder="you@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
                  </div>
                </div>

                <div style={s.formGroup}>
                  <label style={s.fieldLabel}>I am a...</label>
                  <select style={s.select} value={form.role} onChange={e => update('role', e.target.value)}>
                    <option value="">Select your role</option>
                    <option value="Parent">Parent</option>
                    <option value="Grandparent/Caregiver">Grandparent / Caregiver</option>
                    <option value="Foster Parent/Guardian">Foster Parent / Guardian</option>
                    <option value="Educator">Educator</option>
                    <option value="Healthcare Professional">Healthcare Professional</option>
                    <option value="School Administrator">School Administrator</option>
                    <option value="Special Education Advocate">Special Education Advocate</option>
                    <option value="Attorney">Attorney</option>
                    <option value="District Representative">District Representative</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={s.formGroup}>
                  <label style={s.fieldLabel}>Subject</label>
                  <select style={s.select} value={form.subject} onChange={e => update('subject', e.target.value)}>
                    <option value="">What is this about?</option>
                    <option value="Question about Ada">Question about Ada</option>
                    <option value="Subscription / Billing">Subscription / Billing</option>
                    <option value="Technical issue">Technical issue</option>
                    <option value="District or school licensing">District or school licensing</option>
                    <option value="Partnership inquiry">Partnership inquiry</option>
                    <option value="Press / Media">Press / Media</option>
                    <option value="General feedback">General feedback</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div style={s.formGroup}>
                  <label style={s.fieldLabel}>Message <span style={{color:'#ef4444'}}>*</span></label>
                  <textarea
                    style={s.textarea}
                    placeholder="Tell us how we can help..."
                    value={form.message}
                    onChange={e => update('message', e.target.value)}
                    rows={5}
                  />
                </div>

                {error && <div style={s.error}>{error}</div>}

                <button
                  style={{...s.btn, opacity: submitting ? 0.7 : 1}}
                  onClick={handleSubmit}
                  disabled={submitting}
                >
                  {submitting ? 'Sending...' : 'Send Message →'}
                </button>

                <p style={s.directEmail}>
                  Or email us directly: <a href="mailto:info@iepapproved.com" style={s.infoLink}>info@iepapproved.com</a>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <footer style={s.footer}>
        <p style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', marginBottom:'12px'}}>© 2026 IEP Approved LLC. All rights reserved.</p>
        <div style={{display:'flex', gap:'24px', justifyContent:'center', flexWrap:'wrap'}}>
          {[['Terms', '/terms'], ['Privacy', '/privacy'], ['Disclaimer', '/disclaimer'], ['Contact', '/contact']].map(([label, href]) => (
            <a key={href} href={href} style={{fontSize:'12px', color:'rgba(255,255,255,0.4)', textDecoration:'none'}}>{label}</a>
          ))}
        </div>
      </footer>

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Outfit',sans-serif; background:#F3F0FA; }
        input:focus, select:focus, textarea:focus { outline:none; border-color:#2D1B4E !important; box-shadow:0 0 0 3px rgba(45,27,78,0.08); }
        textarea { resize:vertical; font-family:'Outfit',sans-serif; }
      `}</style>
    </>
  )
}

const s = {
  nav: { background:'#2D1B4E', padding:'0 32px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:100 },
  navLogo: { fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:700, color:'#fff', textDecoration:'none' },
  backLink: { color:'rgba(255,255,255,0.5)', textDecoration:'none', fontSize:'13px' },
  page: { minHeight:'100vh', background:'#F3F0FA', padding:'48px 24px 80px' },
  container: { maxWidth:'1100px', margin:'0 auto', display:'flex', gap:'48px', alignItems:'flex-start', flexWrap:'wrap' },

  // LEFT
  left: { flex:1, minWidth:'280px' },
  label: { display:'inline-block', fontSize:'11px', fontWeight:700, letterSpacing:'2px', textTransform:'uppercase', color:'#D4A843', marginBottom:'12px' },
  title: { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(32px,5vw,48px)', fontWeight:700, color:'#2D1B4E', lineHeight:1.1, marginBottom:'16px' },
  sub: { fontSize:'16px', color:'#3D3350', lineHeight:1.7, marginBottom:'32px' },
  infoCards: { display:'flex', flexDirection:'column', gap:'16px' },
  infoCard: { display:'flex', alignItems:'flex-start', gap:'14px', background:'#fff', borderRadius:'12px', padding:'16px 20px', border:'1px solid #E8E2F5' },
  infoIcon: { fontSize:'22px', flexShrink:0 },
  infoTitle: { fontSize:'13px', fontWeight:700, color:'#2D1B4E', marginBottom:'4px' },
  infoDesc: { fontSize:'13px', color:'#7A6E8E', lineHeight:1.5 },
  infoLink: { color:'#2D1B4E', fontWeight:600, textDecoration:'underline', textDecorationColor:'#D4A843' },

  // RIGHT
  right: { width:'520px', flexShrink:0, maxWidth:'100%' },
  card: { background:'#fff', borderRadius:'20px', padding:'36px', boxShadow:'0 4px 24px rgba(45,27,78,0.1)' },
  cardTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'26px', fontWeight:700, color:'#2D1B4E', marginBottom:'24px' },
  row: { display:'flex', gap:'16px', flexWrap:'wrap' },
  formGroup: { marginBottom:'18px', flex:1, minWidth:'200px' },
  fieldLabel: { display:'block', fontSize:'13px', fontWeight:600, color:'#2D1B4E', marginBottom:'6px' },
  input: { width:'100%', padding:'11px 14px', border:'1.5px solid #E8E2F5', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', color:'#1A1026', background:'#F9F8FC', transition:'border-color 0.2s' },
  select: { width:'100%', padding:'11px 14px', border:'1.5px solid #E8E2F5', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', color:'#1A1026', background:'#F9F8FC', cursor:'pointer' },
  textarea: { width:'100%', padding:'11px 14px', border:'1.5px solid #E8E2F5', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', color:'#1A1026', background:'#F9F8FC', lineHeight:1.6 },
  error: { background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'#DC2626', marginBottom:'16px' },
  btn: { width:'100%', background:'#2D1B4E', color:'#fff', border:'none', borderRadius:'12px', padding:'14px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Outfit,sans-serif', marginBottom:'16px', transition:'background 0.2s' },
  directEmail: { textAlign:'center', fontSize:'12px', color:'#9CA3AF' },

  // SUCCESS
  successCard: { background:'#fff', borderRadius:'20px', padding:'48px 36px', boxShadow:'0 4px 24px rgba(45,27,78,0.1)', textAlign:'center' },
  successIcon: { width:'56px', height:'56px', background:'#22c55e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'#fff', fontSize:'24px', fontWeight:700 },
  successTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', fontWeight:700, color:'#2D1B4E', marginBottom:'12px' },
  successSub: { fontSize:'15px', color:'#3D3350', lineHeight:1.7, marginBottom:'12px' },
  successNote: { fontSize:'13px', color:'#7A6E8E', marginBottom:'24px' },
  homeBtn: { display:'inline-block', background:'#2D1B4E', color:'#fff', textDecoration:'none', borderRadius:'10px', padding:'12px 24px', fontSize:'14px', fontWeight:700 },

  footer: { background:'#2D1B4E', padding:'32px', textAlign:'center' },
}
