// pages/social.js
import Head from 'next/head';
import Nav from '../components/Nav';
import { useLanguage } from '../context/LanguageContext';

export default function SocialPage() {
  const { lang } = useLanguage();

  const platforms = [
    {
      name: 'TikTok',
      handle: '@iepapproved.com',
      url: 'https://www.tiktok.com/@iepapproved.com',
      desc: lang === 'es'
        ? 'Videos cortos sobre derechos del IEP, consejos de defensa, y la historia de Robbie. Síguenos para contenido semanal.'
        : 'Short videos on IEP rights, advocacy tips, and Robbie\'s story. Follow us for weekly content.',
      color: '#010101',
      textColor: '#ffffff',
      logo: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.76a4.85 4.85 0 01-1.01-.07z"/>
        </svg>
      ),
    },
    {
      name: 'Facebook',
      handle: 'IEPapproved',
      url: 'https://www.facebook.com/IEPapproved',
      desc: lang === 'es'
        ? 'Actualizaciones, recursos y conversaciones de la comunidad en Facebook. Únete a nuestra página para estar al día.'
        : 'Updates, resources, and community conversations on Facebook. Join our page to stay informed.',
      color: '#1877F2',
      textColor: '#ffffff',
      logo: (
        <svg width="36" height="36" viewBox="0 0 24 24" fill="white">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
  ];

  return (
    <>
      <Head>
        <title>Find Us On Social Media — IEP Approved</title>
        <meta name="description" content="Follow IEP Approved on TikTok and Facebook for IEP law tips, advocacy resources, and community updates." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Nav />

      <div style={s.page}>
        <div style={s.hero}>
          <p style={s.eyebrow}>{lang === 'es' ? 'REDES SOCIALES' : 'SOCIAL MEDIA'}</p>
          <h1 style={s.title}>
            {lang === 'es' ? 'Encuéntranos en Redes Sociales' : 'Find Us on Social Media'}
          </h1>
          <p style={s.subtitle}>
            {lang === 'es'
              ? 'Síguenos para recibir consejos de defensa del IEP, actualizaciones de la ley y la historia de Robbie — en inglés y español.'
              : 'Follow us for IEP advocacy tips, law updates, and Robbie\'s story — in English and Spanish.'}
          </p>
        </div>

        <div style={s.cards}>
          {platforms.map((platform) => (
            <a key={platform.name} href={platform.url} target="_blank" rel="noopener noreferrer"
              style={{ ...s.card, backgroundColor: platform.color }}>
              <div style={s.cardTop}>
                <div style={s.platformLogo}>{platform.logo}</div>
                <div>
                  <h2 style={{ ...s.platformName, color: platform.textColor }}>{platform.name}</h2>
                  <p style={{ ...s.platformHandle, color: 'rgba(255,255,255,0.7)' }}>{platform.handle}</p>
                </div>
              </div>
              <p style={{ ...s.platformDesc, color: 'rgba(255,255,255,0.85)' }}>{platform.desc}</p>
              <div style={s.followBtn}>
                {lang === 'es' ? `Seguir en ${platform.name}` : `Follow on ${platform.name}`}
              </div>
            </a>
          ))}
        </div>

        {/* CONTENT PREVIEW */}
        <div style={s.contentSection}>
          <h2 style={s.contentTitle}>
            {lang === 'es' ? 'Qué publicamos' : 'What We Post'}
          </h2>
          <div style={s.contentGrid}>
            {[
              { title: lang === 'es' ? 'Conoce Tus Derechos' : 'Know Your Rights', desc: lang === 'es' ? 'Un derecho por video — en lenguaje sencillo' : 'One right per video — in plain language' },
              { title: lang === 'es' ? 'La Historia de Robbie' : "Robbie's Story", desc: lang === 'es' ? 'El viaje real que inspiró IEP Approved' : 'The real journey that inspired IEP Approved' },
              { title: lang === 'es' ? 'El Método Know Me' : 'The Know Me Method', desc: lang === 'es' ? 'Consejos de defensa de Kimberly' : 'Advocacy tips from Kimberly' },
              { title: lang === 'es' ? 'Demos de Ada en Vivo' : 'Live Ada Demos', desc: lang === 'es' ? 'Pregúntale a Ada en cámara' : 'Watch Ada answer real questions on camera' },
              { title: lang === 'es' ? 'Contenido en Español' : 'Spanish Content', desc: lang === 'es' ? 'Los mismos pilares, en español' : 'Same pillars, reaching Hispanic families' },
              { title: lang === 'es' ? 'Victorias de la Comunidad' : 'Community Wins', desc: lang === 'es' ? 'Historias de padres con permiso' : 'Parent stories shared with permission' },
            ].map((item, i) => (
              <div key={i} style={s.contentCard}>
                <h3 style={s.contentCardTitle}>{item.title}</h3>
                <p style={s.contentCardDesc}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={s.cta}>
          <p style={s.ctaText}>
            {lang === 'es'
              ? '¿Quieres recibir alertas directamente en tu bandeja de entrada?'
              : 'Want alerts delivered directly to your inbox?'}
          </p>
          <a href="/intake" style={s.ctaBtn}>
            {lang === 'es' ? 'Unirse Gratis — Recibir Alertas' : 'Join Free — Get Alerts'}
          </a>
        </div>
      </div>

      <footer style={s.footer}>
        <p style={s.footerText}>© 2026 IEP Approved LLC · Ada is an AI assistant, not an attorney.</p>
      </footer>
    </>
  );
}

const s = {
  page: { backgroundColor: '#0f0a1a', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' },
  hero: { maxWidth: '640px', margin: '0 auto', padding: '72px 24px 48px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '16px' },
  title: { color: '#fff', fontSize: '42px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 16px', lineHeight: '1.2' },
  subtitle: { color: '#b8a8d0', fontSize: '17px', lineHeight: '1.7', margin: 0 },
  cards: { maxWidth: '800px', margin: '0 auto', padding: '0 24px 64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  card: { borderRadius: '16px', padding: '32px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'transform 0.2s', cursor: 'pointer' },
  cardTop: { display: 'flex', alignItems: 'center', gap: '16px' },
  platformLogo: { width: '52px', height: '52px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: '12px' },
  platformName: { fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: 0 },
  platformHandle: { fontSize: '14px', margin: '4px 0 0', fontFamily: 'Outfit, sans-serif' },
  platformDesc: { fontSize: '15px', lineHeight: '1.6', margin: 0, fontFamily: 'Outfit, sans-serif' },
  followBtn: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginTop: '4px' },
  contentSection: { backgroundColor: '#1a0f2e', padding: '60px 24px' },
  contentTitle: { color: '#e8e0f0', fontSize: '30px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', textAlign: 'center', margin: '0 0 36px' },
  contentGrid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' },
  contentCard: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '10px', padding: '20px' },
  contentCardTitle: { color: '#D4A843', fontSize: '15px', fontWeight: '700', margin: '0 0 6px' },
  contentCardDesc: { color: '#b8a8d0', fontSize: '13px', lineHeight: '1.5', margin: 0 },
  cta: { maxWidth: '560px', margin: '0 auto', padding: '60px 24px', textAlign: 'center' },
  ctaText: { color: '#b8a8d0', fontSize: '17px', marginBottom: '20px' },
  ctaBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' },
  footer: { backgroundColor: '#080512', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' },
  footerText: { color: 'rgba(184,168,208,0.3)', fontSize: '12px', margin: 0 },
};
