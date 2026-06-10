// pages/subscribe.js — IEP Approved
// Social traffic landing page — TikTok, Instagram, Facebook
// Single goal: convert cold visitor to Ada Unlimited subscriber

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Nav from '../components/Nav';

const ADA_UNLIMITED_PRICE_ID = 'price_1TfOauPsMEtDZUDk1o4Vcy1c';

export default function Subscribe() {
  const { user, profile, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [error, setError] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user?.email) setEmail(user.email); }, [user]);

  const handleCheckout = async () => {
    if (!email || !email.includes('@')) { setError('Please enter a valid email address'); return; }
    setCheckoutLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId: ADA_UNLIMITED_PRICE_ID, email }),
      });
      const data = await res.json();
      if (data.url) { window.location.href = data.url; }
      else { setError(data.error || 'Something went wrong. Please try again.'); setCheckoutLoading(false); }
    } catch (err) { setError('Something went wrong. Please try again.'); setCheckoutLoading(false); }
  };

  if (!mounted || loading) return null;

  if (profile?.tier === 'unlimited') {
    return (
      <>
        <Nav />
        <div style={s.alreadyWrap}>
          <div style={s.alreadyCard}>
            <div style={s.alreadyIcon}>✦</div>
            <h2 style={s.alreadyTitle}>You already have Ada Unlimited</h2>
            <p style={s.alreadySub}>Everything is unlocked — unlimited questions, all 50 state pages, and Ada reads every answer aloud.</p>
            <Link href='/ada' style={s.alreadyBtn}>Talk to Ada Now →</Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Ada Unlimited — IEP Approved</title>
        <meta name='description' content='Unlimited access to Ada — your AI guide to IEP law. IDEA, ADA, Section 504. State-specific resources. $4.99/month.' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </Head>
      <Nav />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.eyebrow}>ADA UNLIMITED</div>
          <h1 style={s.heroTitle}>Know the law.<br /><em style={s.heroGold}>Walk in prepared.</em></h1>
          <p style={s.heroSub}>Ada is your AI guide to the IEP process — IDEA, ADA, and Section 504 explained in plain language, backed by the actual law, available any time you need it.</p>
          <div style={s.heroPriceRow}>
            <span style={s.heroPrice}>$4.99</span>
            <span style={s.heroPricePer}>/month</span>
            <span style={s.heroPriceFine}>Cancel anytime. No contracts.</span>
          </div>
          <div style={s.heroForm}>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCheckout()} placeholder='your@email.com' style={s.heroInput} readOnly={!!user} />
            <button onClick={handleCheckout} disabled={checkoutLoading} style={s.heroBtn}>{checkoutLoading ? 'Redirecting...' : 'Get Ada Unlimited →'}</button>
          </div>
          {error && <p style={s.heroError}>{error}</p>}
          <p style={s.heroSecure}>Secure checkout powered by Stripe</p>
        </div>
      </section>
      <section style={s.featSection}>
        <div style={s.featInner}>
          <p style={s.featEyebrow}>WHAT ADA UNLIMITED INCLUDES</p>
          <div style={s.featGrid}>
            {[
              { title: 'Unlimited Questions to Ada', desc: 'Ask as many questions as you need — any time, day or night. No monthly cap, no waiting.' },
              { title: 'All 50 State Pages', desc: 'Your state complaint procedures, PTI center, advocacy organizations, and laws that go beyond federal IDEA.' },
              { title: 'Ada Reads Every Answer Aloud', desc: 'Kaylin voice reads Ada responses — so you can listen while you drive, cook, or get ready.' },
              { title: 'Voice Input — English and Spanish', desc: 'Ask Ada by speaking. Two mic buttons — one for English, one for Spanish. Hands free.' },
              { title: 'Federal Law Coverage', desc: 'IDEA, ADA, and Section 504 — the three federal laws that protect your child, explained in plain language.' },
              { title: 'Community Access', desc: 'State-based parent groups, diagnosis-specific connections, and local meetup coordination.' },
            ].map((f, i) => (
              <div key={i} style={s.featCard}><div style={s.featCheck}>✓</div><div><h3 style={s.featTitle}>{f.title}</h3><p style={s.featDesc}>{f.desc}</p></div></div>
            ))}
          </div>
        </div>
      </section>
      <section style={s.quoteSection}>
        <div style={s.quoteInner}>
          <blockquote style={s.quote}>
            "Knowledge is power. And knowing the law gives you the confidence to walk into any room and advocate for your child's future."
          </blockquote>
          <div style={s.quoteAttr}>
            <div style={s.quoteAvatar}>K</div>
            <div>
              <p style={s.quoteAuthor}>Kimberly Sandro</p>
              <p style={s.quoteTitle}>Robbie's Mom and Founder of IEP Approved LLC</p>
            </div>
          </div>
        </div>
      </section>
      <section style={s.faqSection}>
        <div style={s.faqInner}>
          <p style={s.faqEyebrow}>COMMON QUESTIONS</p>
          <div style={s.faqGrid}>
            {[
              { q: 'Is Ada a real attorney?', a: 'No. Ada provides legal information — not legal advice. She cites real federal law so you understand your rights. For complex disputes, she will tell you when you need an attorney.' },
              { q: 'What law does Ada know?', a: 'IDEA, Section 504, and the ADA in educational settings. She also knows your state-specific procedures and resources.' },
              { q: 'Can I ask questions in Spanish?', a: 'Yes. Type or speak in Spanish and Ada responds in Spanish with the same legal accuracy.' },
              { q: 'What if I need to cancel?', a: 'Cancel any time from your account — one click, no fees, no questions asked. You keep access through the end of your billing period.' },
              { q: 'Do I need an account first?', a: 'You can go straight to checkout. We recommend creating a free account first so your subscription links automatically.' },
              { q: 'What are the state pages?', a: 'Every Unlimited member gets state-specific complaint procedures, their federally-funded PTI center, local advocacy organizations, and laws that exceed federal IDEA.' },
            ].map((item, i) => (
              <div key={i} style={s.faqCard}><h3 style={s.faqQ}>{item.q}</h3><p style={s.faqA}>{item.a}</p></div>
            ))}
          </div>
        </div>
      </section>
      <section style={s.ctaSection}>
        <div style={s.ctaInner}>
          <h2 style={s.ctaTitle}>Your child's IEP meeting is coming.<br /><em style={s.ctaGold}>Walk in knowing the law.</em></h2>
          <div style={s.ctaForm}>
            <input type='email' value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleCheckout()} placeholder='your@email.com' style={s.ctaInput} readOnly={!!user} />
            <button onClick={handleCheckout} disabled={checkoutLoading} style={s.ctaBtn}>{checkoutLoading ? 'Redirecting...' : 'Get Ada Unlimited — $4.99/mo →'}</button>
          </div>
          {error && <p style={s.ctaError}>{error}</p>}
          <div style={s.ctaLinks}>
            <Link href='/ada' style={s.ctaLinkSecondary}>Try Ada free first</Link>
            <span style={s.ctaDot}>·</span>
            <Link href='/login?mode=signup' style={s.ctaLinkSecondary}>Create free account</Link>
          </div>
          <p style={s.ctaFine}>No contracts. Cancel anytime. Secure checkout by Stripe.</p>
        </div>
      </section>
      <style>{`* { box-sizing: border-box; } body { margin: 0; } a { text-decoration: none; }`}</style>
    </>
  );
}

const s = {
  alreadyWrap: { backgroundColor: '#0f0a1a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' },
  alreadyCard: { backgroundColor: '#1a0f2e', border: '2px solid #D4A843', borderRadius: '20px', padding: '48px 40px', maxWidth: '480px', textAlign: 'center' },
  alreadyIcon: { color: '#D4A843', fontSize: '48px', marginBottom: '16px' },
  alreadyTitle: { color: '#ffffff', fontSize: '28px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', margin: '0 0 12px' },
  alreadySub: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: '0 0 28px' },
  alreadyBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '13px 28px', borderRadius: '8px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit,sans-serif' },
  hero: { backgroundColor: '#2D1B4E', padding: '80px 0 72px' },
  heroInner: { maxWidth: '680px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  eyebrow: { display: 'inline-block', backgroundColor: 'rgba(212,168,67,0.15)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', padding: '5px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', fontFamily: 'Outfit,sans-serif', marginBottom: '20px' },
  heroTitle: { color: '#ffffff', fontSize: '56px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', lineHeight: '1.1', margin: '0 0 20px' },
  heroGold: { color: '#D4A843', fontStyle: 'normal' },
  heroSub: { color: '#b8a8d0', fontSize: '18px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: '0 0 32px' },
  heroPriceRow: { display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: '4px', marginBottom: '28px' },
  heroPrice: { color: '#D4A843', fontSize: '48px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700' },
  heroPricePer: { color: '#b8a8d0', fontSize: '18px', fontFamily: 'Outfit,sans-serif' },
  heroPriceFine: { color: 'rgba(184,168,208,0.5)', fontSize: '13px', fontFamily: 'Outfit,sans-serif', marginLeft: '8px' },
  heroForm: { display: 'flex', gap: '10px', maxWidth: '520px', margin: '0 auto 12px', flexWrap: 'wrap' },
  heroInput: { flex: 1, minWidth: '200px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#ffffff', fontSize: '15px', padding: '13px 16px', fontFamily: 'Outfit,sans-serif', outline: 'none' },
  heroBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '13px 22px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' },
  heroError: { color: '#ef4444', fontSize: '13px', fontFamily: 'Outfit,sans-serif', margin: '8px 0 0' },
  heroSecure: { color: 'rgba(184,168,208,0.4)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: '8px 0 0' },
  featSection: { backgroundColor: '#f5f3ff', padding: '72px 0' },
  featInner: { maxWidth: '1000px', margin: '0 auto', padding: '0 24px' },
  featEyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', fontFamily: 'Outfit,sans-serif', textAlign: 'center', marginBottom: '40px' },
  featGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' },
  featCard: { backgroundColor: '#ffffff', border: '1px solid rgba(45,27,78,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', gap: '14px', alignItems: 'flex-start' },
  featCheck: { color: '#D4A843', fontSize: '18px', fontWeight: '800', flexShrink: 0, marginTop: '1px' },
  featTitle: { color: '#2D1B4E', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: '0 0 6px' },
  featDesc: { color: '#6b7280', fontSize: '13px', lineHeight: '1.6', fontFamily: 'Outfit,sans-serif', margin: 0 },
  quoteSection: { backgroundColor: '#2D1B4E', padding: '72px 0' },
  quoteInner: { maxWidth: '760px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  quote: { color: '#e8e0f0', fontSize: '24px', fontFamily: 'Cormorant Garamond,serif', fontStyle: 'italic', lineHeight: '1.7', margin: '0 0 28px' },
  quoteAttr: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' },
  quoteAvatar: { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#D4A843', color: '#2D1B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '800', fontFamily: 'Cormorant Garamond,serif', flexShrink: 0 },
  quoteAuthor: { color: '#e8e0f0', fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: '0 0 2px', textAlign: 'left' },
  quoteTitle: { color: '#b8a8d0', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: 0, textAlign: 'left' },
  faqSection: { backgroundColor: '#0f0a1a', padding: '72px 0' },
  faqInner: { maxWidth: '1000px', margin: '0 auto', padding: '0 24px' },
  faqEyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', fontFamily: 'Outfit,sans-serif', textAlign: 'center', marginBottom: '40px' },
  faqGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '16px' },
  faqCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '24px' },
  faqQ: { color: '#D4A843', fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: '0 0 10px' },
  faqA: { color: '#b8a8d0', fontSize: '13px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: 0 },
  ctaSection: { backgroundColor: '#2D1B4E', padding: '80px 0' },
  ctaInner: { maxWidth: '640px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  ctaTitle: { color: '#ffffff', fontSize: '40px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', lineHeight: '1.2', margin: '0 0 32px' },
  ctaGold: { color: '#D4A843', fontStyle: 'normal' },
  ctaForm: { display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap', justifyContent: 'center' },
  ctaInput: { flex: 1, minWidth: '220px', backgroundColor: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#ffffff', fontSize: '15px', padding: '13px 16px', fontFamily: 'Outfit,sans-serif', outline: 'none' },
  ctaBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '13px 20px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' },
  ctaError: { color: '#ef4444', fontSize: '13px', fontFamily: 'Outfit,sans-serif', margin: '0 0 12px' },
  ctaLinks: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '16px' },
  ctaLinkSecondary: { color: 'rgba(184,168,208,0.7)', fontSize: '13px', fontFamily: 'Outfit,sans-serif' },
  ctaDot: { color: 'rgba(184,168,208,0.3)', fontSize: '13px' },
  ctaFine: { color: 'rgba(184,168,208,0.4)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: 0 },
};
