// pages/signup.js — Updated with auth check
// If already subscribed → redirect to /ada
// If logged in but not subscribed → pre-fill email from profile

import Head from 'next/head'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAuth } from '../context/AuthContext'

const ADA_UNLIMITED_PRICE_ID = 'price_1TfOauPsMEtDZUDk1o4Vcy1c'

export default function Signup() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [error, setError] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  // If already unlimited → redirect to Ada
  useEffect(() => {
    if (!loading && profile?.tier === 'unlimited') {
      router.replace('/ada')
    }
  }, [loading, profile])

  // Pre-fill email if logged in
  useEffect(() => {
    if (user?.email) setEmail(user.email)
  }, [user])

  const handleCheckout = async () => {
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address')
      return
    }
    setCheckoutLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: ADA_UNLIMITED_PRICE_ID, email })
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
        setCheckoutLoading(false)
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
      setCheckoutLoading(false)
    }
  }

  if (!mounted || loading) return null

  // Already unlimited — show redirect message briefly
  if (profile?.tier === 'unlimited') {
    return (
      <div style={{ minHeight: '100vh', background: '#F3F0FA', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Outfit, sans-serif' }}>
        <div style={{ textAlign: 'center', color: '#2D1B4E' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✦</div>
          <p style={{ fontSize: '18px', fontWeight: '700' }}>You already have Ada Unlimited!</p>
          <p style={{ color: '#7A6E8E', marginTop: '8px' }}>Redirecting you to Ada...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Ada Unlimited — IEP Approved</title>
        <meta name="description" content="Unlimited access to Ada, your IEP law guide." />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>
        <nav style={s.nav}>
          <a href="/" style={s.navLogo}>IEP <span style={{color:'#D4A843'}}>Approved</span></a>
          {/* Show sign in link if not logged in */}
          {!user && (
            <a href="/login" style={{ color: '#D4A843', fontSize: '13px', fontWeight: '600', textDecoration: 'none', marginLeft: 'auto' }}>
              Already have an account? Sign In
            </a>
          )}
        </nav>

        <div style={s.container}>
          {/* LEFT */}
          <div style={s.left}>
            <div style={s.badge}>Ada Unlimited</div>
            <h1 style={s.headline}>Unlimited access to Ada.<br/>For <span style={{color:'#D4A843'}}>$4.99/month.</span></h1>
            <p style={s.sub}>Ask Ada as many questions as you need — any time, day or night. Federal special education law, explained in plain language.</p>

            <div style={s.features}>
              {[
                ['♾️', 'Unlimited questions to Ada', 'No monthly limits'],
                ['⚖️', 'Federal law coverage', 'IDEA, ADA, and Section 504'],
                ['🔊', 'Ada Responds', 'Ada provides both text and voice response'],
                ['🎤', 'Ask Ada — Voice Recognition', 'Ask Ada by typing or using the mic, hands free'],
                ['🌎', 'English and Spanish', 'Ada responds in the language you ask — English or Español'],
              ].map(([icon, title, desc], i) => (
                <div key={i} style={s.feature}>
                  <span style={s.featureIcon}>{icon}</span>
                  <div>
                    <div style={s.featureTitle}>{title}</div>
                    <div style={s.featureDesc}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>

            <div style={s.guarantee}>
              <span style={{fontSize:'20px'}}>🛡️</span>
              <div>
                <div style={{fontWeight:700, color:'#2D1B4E', fontSize:'14px'}}>Cancel anytime</div>
                <div style={{fontSize:'12px', color:'#7A6E8E'}}>No contracts. No commitment. Cancel in one click.</div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div style={s.right}>
            <div style={s.card}>
              <div style={s.adaWrap}>
                <img src="/ada-avatar.png" alt="Ada" style={s.adaImg} />
              </div>
              <h2 style={s.cardTitle}>Start Ada Unlimited</h2>
              <p style={s.cardSub}>
                {user
                  ? `Upgrading account for ${user.email}`
                  : 'Enter your email to continue to secure checkout'}
              </p>

              {/* If not logged in, show note to create account first */}
              {!user && (
                <div style={{ background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '10px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#2D1B4E' }}>
                  💡 <strong>Tip:</strong> <a href="/login?mode=signup" style={{ color: '#2D1B4E', fontWeight: '700' }}>Create a free account first</a> so your subscription links automatically.
                </div>
              )}

              <div style={s.formGroup}>
                <label style={s.label}>Email address</label>
                <input
                  style={{...s.input, backgroundColor: user ? '#f5f3ff' : '#F9F8FC'}}
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleCheckout()}
                  readOnly={!!user}
                />
              </div>

              {error && <div style={s.error}>{error}</div>}

              <button
                style={{...s.btn, opacity: checkoutLoading ? 0.7 : 1}}
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? 'Redirecting to checkout...' : 'Continue to Checkout →'}
              </button>

              <div style={s.price}>
                <span style={s.priceAmount}>$4.99</span>
                <span style={s.pricePer}>/month</span>
              </div>

              <p style={s.secure}>🔒 Secure checkout powered by Stripe</p>
              <p style={s.legal}>By subscribing you agree to our <a href="/terms" style={s.link}>Terms of Service</a> and <a href="/privacy" style={s.link}>Privacy Policy</a>.</p>
            </div>

            <div style={s.comingSoon}>
              <div style={s.comingSoonTitle}>More plans coming soon</div>
              <div style={s.comingSoonTiers}>
                <div style={s.tier}>
                  <div style={s.tierName}>IEP Pro</div>
                  <div style={s.tierPrice}>$9.99/mo</div>
                  <div style={s.tierDesc}>Ada + all downloadable resources + community</div>
                  <div style={s.tierBadge}>Coming Soon</div>
                </div>
                <div style={s.tier}>
                  <div style={s.tierName}>Advocate+</div>
                  <div style={s.tierPrice}>$24.99/mo</div>
                  <div style={s.tierDesc}>Everything + advanced tools + attorney directory</div>
                  <div style={s.tierBadge}>Coming Soon</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Outfit',sans-serif; background:#F3F0FA; }
        input:focus { outline:none; border-color:#2D1B4E !important; }
      `}</style>
    </>
  )
}

const s = {
  page: { minHeight:'100vh', background:'#F3F0FA', fontFamily:"'Outfit',sans-serif" },
  nav: { background:'#2D1B4E', padding:'0 32px', height:'64px', display:'flex', alignItems:'center' },
  navLogo: { fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:700, color:'#fff', textDecoration:'none' },
  container: { maxWidth:'1100px', margin:'0 auto', padding:'48px 24px', display:'flex', gap:'48px', alignItems:'flex-start', flexWrap:'wrap' },
  left: { flex:1, minWidth:'300px' },
  badge: { display:'inline-block', background:'#D4A843', color:'#1E1035', fontSize:'11px', fontWeight:700, letterSpacing:'1.5px', textTransform:'uppercase', padding:'5px 14px', borderRadius:'100px', marginBottom:'20px' },
  headline: { fontFamily:"'Cormorant Garamond',serif", fontSize:'clamp(28px,4vw,42px)', fontWeight:700, color:'#2D1B4E', lineHeight:1.2, marginBottom:'16px' },
  sub: { fontSize:'16px', color:'#3D3350', lineHeight:1.7, marginBottom:'32px' },
  features: { display:'flex', flexDirection:'column', gap:'16px', marginBottom:'32px' },
  feature: { display:'flex', alignItems:'flex-start', gap:'14px' },
  featureIcon: { fontSize:'24px', flexShrink:0, marginTop:'2px' },
  featureTitle: { fontSize:'14px', fontWeight:700, color:'#2D1B4E', marginBottom:'2px' },
  featureDesc: { fontSize:'13px', color:'#7A6E8E' },
  guarantee: { display:'flex', alignItems:'center', gap:'12px', background:'#fff', border:'1px solid #E8E2F5', borderRadius:'12px', padding:'16px 20px' },
  right: { width:'380px', flexShrink:0 },
  card: { background:'#fff', borderRadius:'20px', padding:'32px', boxShadow:'0 4px 24px rgba(45,27,78,0.12)', marginBottom:'20px' },
  adaWrap: { width:'72px', height:'72px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 16px', border:'3px solid #D4A843' },
  adaImg: { width:'100%', height:'100%', objectFit:'cover' },
  cardTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'24px', fontWeight:700, color:'#2D1B4E', textAlign:'center', marginBottom:'8px' },
  cardSub: { fontSize:'13px', color:'#7A6E8E', textAlign:'center', marginBottom:'24px' },
  formGroup: { marginBottom:'16px' },
  label: { display:'block', fontSize:'13px', fontWeight:600, color:'#2D1B4E', marginBottom:'6px' },
  input: { width:'100%', padding:'12px 14px', border:'1.5px solid #E8E2F5', borderRadius:'10px', fontSize:'14px', fontFamily:'Outfit,sans-serif', color:'#1A1026' },
  error: { background:'#FEF2F2', border:'1px solid #FECACA', borderRadius:'8px', padding:'10px 14px', fontSize:'13px', color:'#DC2626', marginBottom:'14px' },
  btn: { width:'100%', background:'#2D1B4E', color:'#fff', border:'none', borderRadius:'12px', padding:'15px', fontSize:'15px', fontWeight:700, cursor:'pointer', fontFamily:'Outfit,sans-serif', marginBottom:'16px' },
  price: { textAlign:'center', marginBottom:'8px' },
  priceAmount: { fontSize:'28px', fontWeight:700, color:'#2D1B4E' },
  pricePer: { fontSize:'14px', color:'#7A6E8E', marginLeft:'4px' },
  secure: { textAlign:'center', fontSize:'12px', color:'#7A6E8E', marginBottom:'12px' },
  legal: { textAlign:'center', fontSize:'11px', color:'#9CA3AF', lineHeight:1.5 },
  link: { color:'#2D1B4E', textDecoration:'underline' },
  comingSoon: { background:'rgba(45,27,78,0.05)', border:'1px solid rgba(45,27,78,0.1)', borderRadius:'16px', padding:'20px' },
  comingSoonTitle: { fontSize:'11px', fontWeight:700, color:'#7A6E8E', letterSpacing:'1px', textTransform:'uppercase', marginBottom:'14px', textAlign:'center' },
  comingSoonTiers: { display:'flex', gap:'12px' },
  tier: { flex:1, background:'#fff', borderRadius:'12px', padding:'14px', border:'1px solid #E8E2F5' },
  tierName: { fontSize:'13px', fontWeight:700, color:'#2D1B4E', marginBottom:'2px' },
  tierPrice: { fontSize:'16px', fontWeight:700, color:'#D4A843', marginBottom:'6px' },
  tierDesc: { fontSize:'11px', color:'#7A6E8E', lineHeight:1.4, marginBottom:'8px' },
  tierBadge: { display:'inline-block', background:'#F3F0FA', color:'#7A6E8E', fontSize:'10px', fontWeight:700, padding:'3px 8px', borderRadius:'100px' },
}
