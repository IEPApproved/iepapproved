// pages/community.js
import Head from 'next/head';
import Link from 'next/link';
import { useState } from 'react';
import Nav from '../components/Nav';
import { useLanguage } from '../context/LanguageContext';

export default function CommunityPage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'community' }),
      });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  return (
    <>
      <Head>
        <title>Community — IEP Approved</title>
        <meta name="description" content="Join the IEP Approved community. Connect with parents, get law alerts, and advocate together." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Nav />

      <div style={s.page}>

        {/* HERO */}
        <div style={s.hero}>
          <p style={s.eyebrow}>{lang === 'es' ? 'COMUNIDAD' : 'COMMUNITY'}</p>
          <h1 style={s.title}>
            {lang === 'es'
              ? 'No estás solo en esto.'
              : 'You are not alone in this.'}
          </h1>
          <p style={s.subtitle}>
            {lang === 'es'
              ? 'Conéctate con otros padres, recibe alertas de cambios en la ley y defiende a tu hijo junto a una comunidad que entiende.'
              : 'Connect with other parents, receive law change alerts, and advocate for your child alongside a community that understands.'}
          </p>

          {/* EMAIL SIGNUP */}
          {!submitted ? (
            <form onSubmit={handleSubmit} style={s.form}>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={lang === 'es' ? 'Tu correo electrónico' : 'Your email address'}
                style={s.input}
                required
              />
              <button type="submit" style={s.submitBtn}>
                {lang === 'es' ? 'Unirse Gratis — Recibir Alertas' : 'Join Free — Get Alerts'}
              </button>
            </form>
          ) : (
            <div style={s.successBox}>
              <p style={s.successText}>
                {lang === 'es'
                  ? 'Bienvenido a la comunidad. Te avisaremos cuando abramos.'
                  : "You're on the list. We'll notify you when we open."}
              </p>
              <Link href="/intake" style={s.createAccountBtn}>
                {lang === 'es' ? 'Crear tu cuenta gratuita' : 'Create your free account'}
              </Link>
            </div>
          )}

          <p style={s.fine}>
            {lang === 'es'
              ? 'Sin spam. Cancela cuando quieras.'
              : 'No spam. Unsubscribe anytime.'}
          </p>
        </div>

        {/* COMING SOON FEATURES */}
        <div style={s.features}>
          <h2 style={s.featTitle}>
            {lang === 'es' ? 'Lo que viene' : "What's Coming"}
          </h2>
          <div style={s.grid}>
            {[
              {
                icon: '📍',
                title: lang === 'es' ? 'Grupos por Estado' : 'State-Based Groups',
                desc: lang === 'es'
                  ? 'Conéctate con padres en tu estado que conocen las leyes locales.'
                  : 'Connect with parents in your state who know the local laws.'
              },
              {
                icon: '🧠',
                title: lang === 'es' ? 'Grupos por Diagnóstico' : 'Diagnosis-Specific Groups',
                desc: lang === 'es'
                  ? 'Encuentra familias con experiencias similares a la tuya.'
                  : 'Find families navigating the same diagnosis as your child.'
              },
              {
                icon: '🔔',
                title: lang === 'es' ? 'Alertas de Ley' : 'Law Change Alerts',
                desc: lang === 'es'
                  ? 'Sé el primero en saber cuando cambia la ley federal de educación especial.'
                  : 'Be the first to know when federal special education law changes.'
              },
              {
                icon: '🤝',
                title: lang === 'es' ? 'Reuniones Locales' : 'Local Meetups',
                desc: lang === 'es'
                  ? 'Coordina encuentros con familias cercanas a ti.'
                  : 'Coordinate meetups and playdates with nearby families.'
              },
              {
                icon: '💬',
                title: lang === 'es' ? 'Foros de Apoyo' : 'Support Forums',
                desc: lang === 'es'
                  ? 'Comparte experiencias, haz preguntas, celebra victorias.'
                  : 'Share experiences, ask questions, celebrate wins together.'
              },
              {
                icon: '⭐',
                title: lang === 'es' ? 'Acceso Prioritario para Ada Sin Límites' : 'Ada Unlimited Priority Access',
                desc: lang === 'es'
                  ? 'Los suscriptores de Ada Sin Límites obtienen funciones mejoradas de comunidad.'
                  : 'Ada Unlimited subscribers get enhanced community features and early access.'
              },
            ].map((feat, i) => (
              <div key={i} style={s.featCard}>
                <div style={s.featIcon}>{feat.icon}</div>
                <h3 style={s.featCardTitle}>{feat.title}</h3>
                <p style={s.featCardDesc}>{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* UPGRADE PROMPT */}
        <div style={s.upgradeSection}>
          <h2 style={s.upgradeTitle}>
            {lang === 'es'
              ? 'Los miembros de Ada Sin Límites obtienen acceso prioritario a la comunidad'
              : 'Ada Unlimited members get priority community access'}
          </h2>
          <p style={s.upgradeDesc}>
            {lang === 'es'
              ? 'Por $4.99/mes, obtén acceso ilimitado a Ada más las funciones mejoradas de comunidad cuando lancemos.'
              : 'For $4.99/month, get unlimited Ada access plus enhanced community features when we launch.'}
          </p>
          <Link href="/signup" style={s.upgradeBtn}>
            {lang === 'es' ? 'Obtener Ada Sin Límites — $4.99/mes' : 'Get Ada Unlimited — $4.99/month'}
          </Link>
          <p style={s.upgradeNote}>
            {lang === 'es' ? 'Cancela en cualquier momento.' : 'Cancel anytime. No contracts.'}
          </p>
        </div>

      </div>

      {/* FOOTER */}
      <footer style={s.footer}>
        <p style={s.footerText}>
          {lang === 'es'
            ? '© 2026 IEP Approved LLC · Ada es una IA, no una abogada.'
            : '© 2026 IEP Approved LLC · Ada is an AI assistant, not an attorney.'}
        </p>
      </footer>
    </>
  );
}

const s = {
  page: { backgroundColor: '#0f0a1a', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' },
  hero: { maxWidth: '720px', margin: '0 auto', padding: '80px 24px 60px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px' },
  title: { color: '#fff', fontSize: '48px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 20px', lineHeight: '1.15' },
  subtitle: { color: '#b8a8d0', fontSize: '18px', lineHeight: '1.7', margin: '0 0 36px' },
  form: { display: 'flex', gap: '12px', maxWidth: '520px', margin: '0 auto 12px', flexWrap: 'wrap' },
  input: { flex: 1, minWidth: '240px', backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.4)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '13px 16px', fontFamily: 'Outfit, sans-serif', outline: 'none' },
  submitBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '8px', padding: '13px 24px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' },
  fine: { color: 'rgba(184,168,208,0.4)', fontSize: '12px' },
  successBox: { backgroundColor: 'rgba(212,168,67,0.1)', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', padding: '24px', maxWidth: '480px', margin: '0 auto 12px' },
  successText: { color: '#e8e0f0', fontSize: '16px', margin: '0 0 16px' },
  createAccountBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '10px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' },
  features: { backgroundColor: '#1a0f2e', padding: '64px 24px' },
  featTitle: { color: '#e8e0f0', fontSize: '32px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', textAlign: 'center', marginBottom: '40px' },
  grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' },
  featCard: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '28px 24px' },
  featIcon: { fontSize: '28px', marginBottom: '12px' },
  featCardTitle: { color: '#D4A843', fontSize: '17px', fontWeight: '700', margin: '0 0 8px', fontFamily: 'Outfit, sans-serif' },
  featCardDesc: { color: '#b8a8d0', fontSize: '14px', lineHeight: '1.6', margin: 0 },
  upgradeSection: { maxWidth: '640px', margin: '0 auto', padding: '64px 24px', textAlign: 'center' },
  upgradeTitle: { color: '#e8e0f0', fontSize: '28px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 16px' },
  upgradeDesc: { color: '#b8a8d0', fontSize: '16px', lineHeight: '1.6', margin: '0 0 28px' },
  upgradeBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' },
  upgradeNote: { color: 'rgba(184,168,208,0.4)', fontSize: '12px', marginTop: '12px' },
  footer: { backgroundColor: '#080512', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' },
  footerText: { color: 'rgba(184,168,208,0.3)', fontSize: '12px', margin: 0 },
};
