// pages/states/index.js — IEP Approved
// 50-state hub — links to /states/[state] for Unlimited members

import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';

const STATES = [
  { code: 'AL', name: 'Alabama' },{ code: 'AK', name: 'Alaska' },{ code: 'AZ', name: 'Arizona' },
  { code: 'AR', name: 'Arkansas' },{ code: 'CA', name: 'California' },{ code: 'CO', name: 'Colorado' },
  { code: 'CT', name: 'Connecticut' },{ code: 'DE', name: 'Delaware' },{ code: 'FL', name: 'Florida' },
  { code: 'GA', name: 'Georgia' },{ code: 'HI', name: 'Hawaii' },{ code: 'ID', name: 'Idaho' },
  { code: 'IL', name: 'Illinois' },{ code: 'IN', name: 'Indiana' },{ code: 'IA', name: 'Iowa' },
  { code: 'KS', name: 'Kansas' },{ code: 'KY', name: 'Kentucky' },{ code: 'LA', name: 'Louisiana' },
  { code: 'ME', name: 'Maine' },{ code: 'MD', name: 'Maryland' },{ code: 'MA', name: 'Massachusetts' },
  { code: 'MI', name: 'Michigan' },{ code: 'MN', name: 'Minnesota' },{ code: 'MS', name: 'Mississippi' },
  { code: 'MO', name: 'Missouri' },{ code: 'MT', name: 'Montana' },{ code: 'NE', name: 'Nebraska' },
  { code: 'NV', name: 'Nevada' },{ code: 'NH', name: 'New Hampshire' },{ code: 'NJ', name: 'New Jersey' },
  { code: 'NM', name: 'New Mexico' },{ code: 'NY', name: 'New York' },{ code: 'NC', name: 'North Carolina' },
  { code: 'ND', name: 'North Dakota' },{ code: 'OH', name: 'Ohio' },{ code: 'OK', name: 'Oklahoma' },
  { code: 'OR', name: 'Oregon' },{ code: 'PA', name: 'Pennsylvania' },{ code: 'RI', name: 'Rhode Island' },
  { code: 'SC', name: 'South Carolina' },{ code: 'SD', name: 'South Dakota' },{ code: 'TN', name: 'Tennessee' },
  { code: 'TX', name: 'Texas' },{ code: 'UT', name: 'Utah' },{ code: 'VT', name: 'Vermont' },
  { code: 'VA', name: 'Virginia' },{ code: 'WA', name: 'Washington' },{ code: 'WV', name: 'West Virginia' },
  { code: 'WI', name: 'Wisconsin' },{ code: 'WY', name: 'Wyoming' },
];

export default function StatesHub() {
  const { user, profile } = useAuth();
  const [search, setSearch] = useState('');
  const isUnlimited = profile?.tier === 'pro' || profile?.tier === 'advocate';
  const filtered = STATES.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.code.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <>
      <Head>
        <title>IEP Resources by State — IEP Approved</title>
        <meta name="description" content="Find your state's IEP complaint procedures, PTI centers, advocacy organizations, and state-specific special education laws." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.eyebrow}>STATE-BY-STATE RESOURCES</div>
          <h1 style={s.heroTitle}>Know your state's IEP laws.<br /><em style={s.heroGold}>Advocate with confidence.</em></h1>
          <p style={s.heroSub}>Federal law sets the floor. Your state may go further — with stricter timelines, additional protections, and local resources only IEP Pro members can access.</p>
          {!isUnlimited && (
            <div style={s.unlockBanner}>
              <span style={s.unlockText}>State-specific resources are available to IEP Pro members.</span>
              <Link href="/signup" style={s.unlockBtn}>Get IEP Pro — $9.99/mo</Link>
            </div>
          )}
        </div>
      </section>
      <section style={s.featuresSection}>
        <div style={s.featuresInner}>
          <p style={s.featEyebrow}>WHAT EACH STATE PAGE INCLUDES</p>
          <div style={s.featuresGrid}>
            {[
              { icon: String.fromCharCode(167), title: 'State Complaint Procedures', desc: 'How to file, timelines, and the exact agency responsible in your state.' },
              { icon: 'PTI', title: 'Parent Training Centers', desc: 'Your federally-funded PTI center — free training, advocacy support, and individual help.' },
              { icon: 'Law', title: 'State Laws Exceeding Federal', desc: 'Where your state gives you more protection than IDEA requires.' },
              { icon: 'Org', title: 'Advocacy Organizations', desc: 'Disability-specific orgs, legal aid, and parent groups in your state.' },
            ].map((f, i) => (
              <div key={i} style={s.featCard}>
                <div style={s.featIcon}>{f.icon}</div>
                <h3 style={s.featTitle}>{f.title}</h3>
                <p style={s.featDesc}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section style={s.gridSection}>
        <div style={s.gridInner}>
          <div style={s.searchRow}>
            <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search states..." style={s.searchInput} />
            <span style={s.stateCount}>{filtered.length} states</span>
          </div>
          <div style={s.stateGrid}>
            {filtered.map(state => (
              <Link key={state.code} href={isUnlimited ? '/states/' + state.code.toLowerCase() : '/signup'} style={s.stateCard}>
                <div style={s.stateCode}>{state.code}</div>
                <div style={s.stateName}>{state.name}</div>
                {isUnlimited ? <div style={s.stateArrow}>View</div> : <div style={s.stateLock}>Unlock</div>}
              </Link>
            ))}
          </div>
          {!isUnlimited && (
            <div style={s.bottomCta}>
              <p style={s.bottomCtaText}>IEP Pro unlocks all 50 state pages, plus unlimited questions to Ada.</p>
              <Link href="/signup" style={s.bottomCtaBtn}>Get IEP Pro — $9.99/month</Link>
              <p style={s.bottomCtaFine}>Cancel anytime. No contracts.</p>
            </div>
          )}
        </div>
      </section>
      <Footer />
      <style>{`* { box-sizing: border-box; } body { margin: 0; overflow-x: hidden; } a { text-decoration: none; }`}</style>
    </>
  );
}

const s = {
  hero: { backgroundColor: '#2D1B4E', padding: '72px 0 56px' },
  heroInner: { maxWidth: '800px', margin: '0 auto', padding: '0 24px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', fontFamily: 'Outfit,sans-serif', marginBottom: '16px' },
  heroTitle: { color: '#ffffff', fontSize: '48px', fontFamily: 'Cormorant Garamond,serif', fontWeight: '700', lineHeight: '1.2', margin: '0 0 20px' },
  heroGold: { color: '#D4A843', fontStyle: 'normal' },
  heroSub: { color: '#b8a8d0', fontSize: '17px', lineHeight: '1.7', fontFamily: 'Outfit,sans-serif', margin: '0 0 32px' },
  unlockBanner: { backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' },
  unlockText: { color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit,sans-serif' },
  unlockBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit,sans-serif', whiteSpace: 'nowrap' },
  featuresSection: { backgroundColor: '#f5f3ff', padding: '64px 0' },
  featuresInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  featEyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', fontFamily: 'Outfit,sans-serif', marginBottom: '32px', textAlign: 'center' },
  featuresGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: '20px' },
  featCard: { backgroundColor: '#ffffff', border: '1px solid rgba(45,27,78,0.08)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '10px' },
  featIcon: { color: '#D4A843', fontSize: '18px', fontWeight: '800', fontFamily: 'Cormorant Garamond,serif' },
  featTitle: { color: '#2D1B4E', fontSize: '15px', fontWeight: '700', fontFamily: 'Outfit,sans-serif', margin: 0 },
  featDesc: { color: '#6b7280', fontSize: '13px', lineHeight: '1.6', fontFamily: 'Outfit,sans-serif', margin: 0 },
  gridSection: { backgroundColor: '#0f0a1a', padding: '64px 0' },
  gridInner: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px' },
  searchRow: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' },
  searchInput: { flex: 1, backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '12px 16px', fontFamily: 'Outfit,sans-serif', outline: 'none', maxWidth: '360px' },
  stateCount: { color: '#b8a8d0', fontSize: '13px', fontFamily: 'Outfit,sans-serif' },
  stateGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '12px' },
  stateCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '10px', padding: '16px 14px', display: 'flex', flexDirection: 'column', gap: '4px', cursor: 'pointer' },
  stateCode: { color: '#D4A843', fontSize: '18px', fontWeight: '800', fontFamily: 'Cormorant Garamond,serif', letterSpacing: '1px' },
  stateName: { color: '#e8e0f0', fontSize: '13px', fontFamily: 'Outfit,sans-serif', fontWeight: '600' },
  stateArrow: { color: '#D4A843', fontSize: '12px', fontFamily: 'Outfit,sans-serif', marginTop: '4px' },
  stateLock: { color: 'rgba(184,168,208,0.4)', fontSize: '11px', fontFamily: 'Outfit,sans-serif', marginTop: '4px' },
  bottomCta: { textAlign: 'center', marginTop: '56px', padding: '40px 24px', backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '16px' },
  bottomCtaText: { color: '#b8a8d0', fontSize: '16px', fontFamily: 'Outfit,sans-serif', margin: '0 0 20px' },
  bottomCtaBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 32px', borderRadius: '8px', fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit,sans-serif' },
  bottomCtaFine: { color: 'rgba(184,168,208,0.4)', fontSize: '12px', fontFamily: 'Outfit,sans-serif', margin: '12px 0 0' },
};
