// pages/community.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function CommunityPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'community', lang }),
      });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <Head>
        <title>{es ? 'Comunidad — IEP Approved' : 'Community — IEP Approved'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <div style={s.page}>

        {/* HERO */}
        <div style={s.hero}>
          <p style={s.eyebrow}>{es ? 'COMUNIDAD' : 'COMMUNITY'}</p>
          <h1 style={s.title}>
            {es ? 'No estás solo en esto.' : 'You are not alone in this.'}
          </h1>
          <p style={s.subtitle}>
            {es
              ? 'Conéctate con grupos locales, accede a recursos de la comunidad y encuentra el apoyo que tu familia merece.'
              : 'Connect with local groups, access community resources, and find the support your family deserves.'}
          </p>

          {!submitted ? (
            <form onSubmit={handleSubmit} style={s.form}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={es ? 'Tu correo electrónico' : 'Your email address'}
                style={s.input} required />
              <button type="submit" style={s.submitBtn}>
                {es ? 'Unirse Gratis — Recibir Alertas' : 'Join Free — Get Alerts'}
              </button>
            </form>
          ) : (
            <div style={s.successBox}>
              <p style={s.successText}>
                {es ? 'Bienvenido a la comunidad.' : "You're in. Welcome to the community."}
              </p>
              <Link href="/intake" style={s.createBtn}>
                {es ? 'Crear tu cuenta gratuita →' : 'Create your free account →'}
              </Link>
            </div>
          )}
          <p style={s.fine}>{es ? 'Sin spam. Cancela cuando quieras.' : 'No spam. Unsubscribe anytime.'}</p>
        </div>

        {/* WHAT YOU GET */}
        <div style={s.features}>
          <h2 style={s.featTitle}>{es ? 'Lo Que Obtienes' : 'What You Get'}</h2>
          <div style={s.grid}>
            {[
              {
                title: es ? 'Grupos y Sociedades Locales' : 'Local Groups and Societies',
                desc: es
                  ? 'Conéctate con grupos locales, sociedades de discapacidad y organizaciones sociales dentro de tu comunidad.'
                  : 'Connect with local groups, disability societies, and social organizations within your community.',
              },
              {
                title: es ? 'Acceso a Grupos por Estado con Ada Sin Límites' : 'State-Specific Groups with Ada Unlimited',
                desc: es
                  ? 'Los miembros de Ada Sin Límites desbloquean grupos y capítulos específicos de su estado.'
                  : 'Ada Unlimited members unlock state-specific groups and chapters relevant to their family.',
              },
              {
                title: es ? 'Eventos y Encuentros' : 'Events and Meetups',
                desc: es
                  ? 'Información sobre eventos comunitarios y encuentros según disponibilidad.'
                  : 'Information on community events and meetups as available.',
              },
            ].map((item, i) => (
              <div key={i} style={s.featCard}>
                <h3 style={s.featCardTitle}>{item.title}</h3>
                <p style={s.featCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UPGRADE */}
        <div style={s.upgradeSection}>
          <h2 style={s.upgradeTitle}>
            {es ? 'Ada Sin Límites desbloquea acceso prioritario a la comunidad' : 'Ada Unlimited unlocks priority community access'}
          </h2>
          <p style={s.upgradeDesc}>
            {es
              ? 'Por $4.99/mes, obtén acceso ilimitado a Ada más grupos y capítulos específicos de tu estado.'
              : 'For $4.99/month, get unlimited Ada access plus state-specific groups and chapters.'}
          </p>
          <Link href="/signup" style={s.upgradeBtn}>
            {es ? 'Obtener Ada Sin Límites — $4.99/mes' : 'Get Ada Unlimited — $4.99/month'}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

const s = {
  page: { backgroundColor: '#0f0a1a', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' },
  hero: { maxWidth: '680px', margin: '0 auto', padding: '72px 24px 56px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px' },
  title: { color: '#fff', fontSize: '44px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 20px', lineHeight: '1.15' },
  subtitle: { color: '#b8a8d0', fontSize: '17px', lineHeight: '1.7', margin: '0 0 32px' },
  form: { display: 'flex', gap: '12px', maxWidth: '500px', margin: '0 auto 12px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '220px', backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.4)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '13px 16px', fontFamily: 'Outfit, sans-serif', outline: 'none' },
  submitBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '13px 24px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' },
  fine: { color: 'rgba(184,168,208,0.4)', fontSize: '12px', marginTop: '8px' },
  successBox: { backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '24px', maxWidth: '460px', margin: '0 auto 12px' },
  successText: { color: '#e8e0f0', fontSize: '16px', margin: '0 0 12px' },
  createBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '800' },
  features: { backgroundColor: '#1a0f2e', padding: '60px 24px' },
  featTitle: { color: '#e8e0f0', fontSize: '30px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', textAlign: 'center', marginBottom: '36px' },
  grid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' },
  featCard: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '28px 24px' },
  featCardTitle: { color: '#D4A843', fontSize: '17px', fontWeight: '700', margin: '0 0 10px' },
  featCardDesc: { color: '#b8a8d0', fontSize: '14px', lineHeight: '1.6', margin: 0 },
  upgradeSection: { maxWidth: '580px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' },
  upgradeTitle: { color: '#e8e0f0', fontSize: '26px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 14px' },
  upgradeDesc: { color: '#b8a8d0', fontSize: '16px', lineHeight: '1.6', margin: '0 0 24px' },
  upgradeBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '800' },
};
