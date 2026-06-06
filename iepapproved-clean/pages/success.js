import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function Success() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (router.isReady) {
      // Store unlimited status in localStorage
      try {
        localStorage.setItem('ada_plan', 'unlimited')
        const now = new Date()
        const month = `${now.getFullYear()}-${now.getMonth()}`
        const existing = JSON.parse(localStorage.getItem('ada_usage') || '{}')
        localStorage.setItem('ada_usage', JSON.stringify({
          ...existing,
          plan: 'unlimited',
          month
        }))
      } catch(e) {}
      setLoading(false)
    }
  }, [router.isReady])

  return (
    <>
      <Head>
        <title>Welcome to Ada Unlimited — IEP Approved</title>
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>
        <nav style={s.nav}>
          <a href="/" style={s.navLogo}>IEP <span style={{color:'#D4A843'}}>Approved</span></a>
        </nav>

        <div style={s.container}>
          <div style={s.card}>
            <div style={s.avatarWrap}>
              <img src="/ada-avatar.png" alt="Ada" style={s.avatar} />
            </div>
            <div style={s.checkmark}>✓</div>
            <h1 style={s.title}>You're in! Welcome to Ada Unlimited.</h1>
            <p style={s.sub}>You now have unlimited access to Ada — ask as many questions as you need, any time. Ada knows federal and state special education law, and she's here for you.</p>

            <div style={s.features}>
              {[
                '♾️ Unlimited questions — no monthly limits',
                '🔊 Ada reads every answer aloud in Kaylin\'s voice',
                '🎤 Speak your questions — hands-free',
                '🌎 English and Spanish supported',
                '⚖️ Federal and state law coverage',
              ].map((f, i) => (
                <div key={i} style={s.feature}>
                  <span style={{color:'#22c55e', fontWeight:700, marginRight:'8px'}}>✓</span>
                  {f}
                </div>
              ))}
            </div>

            <a href="/ada" style={s.btn}>Ask Ada Now →</a>

            <p style={s.note}>A confirmation email is on its way from Stripe. To manage your subscription, reply to that email or contact us at <a href="mailto:info@iepapproved.com" style={s.link}>info@iepapproved.com</a></p>

            <div style={s.tagline}>
              Knowledge is power. Partnership is progress.<br/>
              Together — the IEP gets APPROVED.
            </div>
          </div>
        </div>
      </div>

      <style>{`
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Outfit',sans-serif; background:#F3F0FA; }
      `}</style>
    </>
  )
}

const s = {
  page: { minHeight:'100vh', background:'#F3F0FA', fontFamily:"'Outfit',sans-serif" },
  nav: { background:'#2D1B4E', padding:'0 32px', height:'64px', display:'flex', alignItems:'center' },
  navLogo: { fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:700, color:'#fff', textDecoration:'none' },
  container: { maxWidth:'560px', margin:'0 auto', padding:'48px 24px' },
  card: { background:'#fff', borderRadius:'24px', padding:'40px', boxShadow:'0 4px 24px rgba(45,27,78,0.12)', textAlign:'center' },
  avatarWrap: { width:'80px', height:'80px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 8px', border:'3px solid #D4A843' },
  avatar: { width:'100%', height:'100%', objectFit:'cover' },
  checkmark: { width:'40px', height:'40px', background:'#22c55e', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 20px', color:'#fff', fontSize:'20px', fontWeight:700 },
  title: { fontFamily:"'Cormorant Garamond',serif", fontSize:'28px', fontWeight:700, color:'#2D1B4E', marginBottom:'14px', lineHeight:1.2 },
  sub: { fontSize:'15px', color:'#3D3350', lineHeight:1.7, marginBottom:'28px' },
  features: { display:'flex', flexDirection:'column', gap:'10px', marginBottom:'32px', textAlign:'left', background:'#F9F8FC', borderRadius:'12px', padding:'20px' },
  feature: { fontSize:'14px', color:'#3D3350', display:'flex', alignItems:'center' },
  btn: { display:'block', background:'#2D1B4E', color:'#fff', textDecoration:'none', borderRadius:'12px', padding:'15px 32px', fontSize:'16px', fontWeight:700, marginBottom:'20px', transition:'background 0.2s' },
  note: { fontSize:'12px', color:'#9CA3AF', lineHeight:1.6, marginBottom:'24px' },
  link: { color:'#2D1B4E' },
  tagline: { fontSize:'13px', color:'#D4A843', fontStyle:'italic', lineHeight:1.6 },
}
