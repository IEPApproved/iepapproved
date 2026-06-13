// pages/redeem.js
// Shareable trial-code landing page. Example link: /redeem?code=TIKTOK7
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head'
import { useAuth } from '../context/AuthContext'
import { createClient } from '../lib/supabase'

export default function Redeem() {
  const { user, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [code, setCode] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(null)

  // Prefill code from the URL (?code=TIKTOK7)
  useEffect(() => {
    const q = router.query.code
    if (q) setCode(String(q).toUpperCase())
  }, [router.query.code])

  const handleRedeem = async () => {
    setError('')
    setBusy(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const res = await fetch('/api/redeem-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`,
        },
        body: JSON.stringify({ code }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Could not apply that code.')
      } else {
        setSuccess(data)
        if (refreshProfile) await refreshProfile()
      }
    } catch (e) {
      setError('Network error — please try again.')
    }
    setBusy(false)
  }

  return (
    <div style={s.page}>
      <Head><title>Redeem your code — IEP Approved</title></Head>

      <Link href="/" style={s.logo}>IEP<span style={s.logoGold}>Approved</span></Link>

      <div style={s.card}>
        {success ? (
          <>
            <div style={s.check}>✓</div>
            <h1 style={s.title}>You're in.</h1>
            <p style={s.sub}>
              {success.days} days of {success.tier === 'pro' ? 'Pro' : 'Unlimited'} access are unlocked.
              Ada is ready whenever you are.
            </p>
            <Link href="/ada" style={s.btn}>Talk to Ada now</Link>
          </>
        ) : loading ? (
          <p style={s.sub}>Loading…</p>
        ) : !user ? (
          <>
            <div style={s.eyebrow}>YOUR FREE TRIAL</div>
            <h1 style={s.title}>Create a free account to claim it</h1>
            <p style={s.sub}>
              Takes a few seconds. Come back to this same link after you sign up
              {code ? <> — your code <strong>{code}</strong> is saved.</> : '.'}
            </p>
            <Link href="/signup" style={s.btn}>Create free account</Link>
            <Link href="/login" style={s.linkBtn}>I already have an account</Link>
          </>
        ) : (
          <>
            <div style={s.eyebrow}>YOUR FREE TRIAL</div>
            <h1 style={s.title}>Enter your code</h1>
            <p style={s.sub}>Unlock your trial and start asking Ada anything.</p>
            <input
              value={code}
              onChange={e => setCode(e.target.value.toUpperCase())}
              placeholder="ENTER CODE"
              style={s.input}
            />
            {error && <p style={s.error}>{error}</p>}
            <button onClick={handleRedeem} disabled={busy || !code} style={{ ...s.btn, opacity: busy || !code ? 0.6 : 1 }}>
              {busy ? 'Applying…' : 'Redeem'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#2D1B4E', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'Outfit, sans-serif' },
  logo: { position: 'absolute', top: '24px', left: '24px', color: '#fff', fontSize: '20px', fontWeight: '800', textDecoration: 'none' },
  logoGold: { color: '#D4A843' },
  card: { backgroundColor: '#fff', borderRadius: '16px', padding: '40px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 10px 40px rgba(0,0,0,0.25)' },
  eyebrow: { color: '#D4A843', fontSize: '12px', fontWeight: '800', letterSpacing: '0.1em', marginBottom: '12px' },
  title: { color: '#2D1B4E', fontSize: '28px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 12px' },
  sub: { color: '#5b5170', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' },
  input: { width: '100%', padding: '14px', fontSize: '18px', textAlign: 'center', letterSpacing: '0.15em', border: '2px solid #2D1B4E', borderRadius: '10px', marginBottom: '16px', boxSizing: 'border-box', textTransform: 'uppercase', fontFamily: 'Outfit, sans-serif' },
  btn: { display: 'block', width: '100%', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px', borderRadius: '10px', fontSize: '16px', fontWeight: '800', border: 'none', cursor: 'pointer', textDecoration: 'none', fontFamily: 'Outfit, sans-serif', boxSizing: 'border-box' },
  linkBtn: { display: 'block', marginTop: '14px', color: '#5b5170', fontSize: '14px', textDecoration: 'underline' },
  check: { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#D4A843', color: '#2D1B4E', fontSize: '30px', fontWeight: '800', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' },
  error: { color: '#c0392b', fontSize: '14px', margin: '0 0 12px' },
}
