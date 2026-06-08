// pages/social.js
import Head from 'next/head';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function SocialPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';

  const platforms = [
    {
      name: 'TikTok',
      handle: '@iepapproved.com',
      url: 'https://www.tiktok.com/@iepapproved.com',
      desc: es
        ? 'Síguenos para conocer los derechos del IEP, historias reales de familias, eventos comunitarios y celebrar cada victoria.'
        : 'Follow us for IEP rights, real family stories, community events, and celebrating every win.',
      color: '#010101',
    },
    {
      name: 'Facebook',
      handle: 'IEPapproved',
      url: 'https://www.facebook.com/IEPapproved',
      desc: es
        ? 'Únete a nuestra página para actualizaciones, recursos y conversaciones de la comunidad.'
        : 'Join our page for updates, resources, and community conversations.',
      color: '#1877F2',
    },
  ];

  const contentCards = [
    {
      title: es ? 'Conoce Tus Derechos' : 'Know Your Rights',
      desc: es ? 'Información sobre derechos, el lado humano de la discapacidad y lo que la ley significa para familias reales.' : 'Rights information, the human side of disability, and what the law means for real families.',
    },
    {
      title: es ? 'Nuestra Historia' : 'Our Story',
      desc: es ? 'Nuestra familia y situaciones reales donde conocer tus derechos es esencial.' : 'Our family and real situations where knowing your rights is essential.',
    },
    {
      title: es ? 'Ada en Acción' : 'Ada in Action',
      desc: es ? 'Mira a Ada responder preguntas reales en cámara.' : 'Watch Ada answer real questions in action.',
    },
    {
      title: es ? 'Eventos y Conexiones Comunitarias' : 'Community Events and Connections',
      desc: es ? 'Encuentros locales, eventos y cómo encontrar tu comunidad.' : 'Local meetups, events, and finding your people.',
    },
    {
      title: es ? 'Victorias de la Comunidad' : 'Community Wins',
      desc: es ? 'Celebrando victorias, grandes y pequeñas, juntos.' : 'Celebrating victories, big and small, together.',
    },
  ];

  return (
    <>
      <Head>
        <title>{es ? 'Encuéntranos en Redes Sociales — IEP Approved' : 'Find Us on Social Media — IEP Approved'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <div style={s.page}>
        <div style={s.hero}>
          <p style={s.eyebrow}>{es ? 'REDES SOCIALES' : 'SOCIAL MEDIA'}</p>
          <h1 style={s.title}>{es ? 'Encuéntranos en Redes Sociales' : 'Find Us on Social Media'}</h1>
          <p style={s.subtitle}>
            {es
              ? 'Síguenos para derechos del IEP, el lado humano de la discapacidad, comunidad, conexión y celebrar cada victoria.'
              : 'Follow us for IEP rights, the human side of disability, community, connection, and celebrating every win.'}
          </p>
        </div>

        <div style={s.platforms}>
          {platforms.map(p => (
            <a key={p.name} href={p.url} target="_blank" rel="noopener noreferrer"
              style={{...s.platformCard, backgroundColor: p.color}}>
              <div>
                <h2 style={s.platformName}>{p.name}</h2>
                <p style={s.platformHandle}>{p.handle}</p>
              </div>
              <p style={s.platformDesc}>{p.desc}</p>
              <div style={s.followBtn}>
                {es ? `Seguir en ${p.name}` : `Follow on ${p.name}`} →
              </div>
            </a>
          ))}
        </div>

        <div style={s.contentSection}>
          <h2 style={s.contentTitle}>{es ? 'Qué Publicamos' : 'What We Post'}</h2>
          <div style={s.contentGrid}>
            {contentCards.map((c, i) => (
              <div key={i} style={s.contentCard}>
                <h3 style={s.contentCardTitle}>{c.title}</h3>
                <p style={s.contentCardDesc}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div style={s.cta}>
          <p style={s.ctaText}>
            {es ? '¿Quieres alertas directamente en tu bandeja de entrada?' : 'Want alerts delivered directly to your inbox?'}
          </p>
          <a href="/intake" style={s.ctaBtn}>
            {es ? 'Unirse Gratis — Recibir Alertas' : 'Join Free — Get Alerts'}
          </a>
        </div>
      </div>
      <Footer />
    </>
  );
}

const s = {
  page: { backgroundColor: '#0f0a1a', minHeight: '100vh', fontFamily: 'Outfit, sans-serif' },
  hero: { maxWidth: '600px', margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px' },
  title: { color: '#fff', fontSize: '40px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 16px' },
  subtitle: { color: '#b8a8d0', fontSize: '17px', lineHeight: '1.7', margin: 0 },
  platforms: { maxWidth: '800px', margin: '0 auto', padding: '0 24px 48px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' },
  platformCard: { borderRadius: '16px', padding: '32px', textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: '14px' },
  platformName: { color: '#fff', fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: 0 },
  platformHandle: { color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '4px 0 0' },
  platformDesc: { color: 'rgba(255,255,255,0.85)', fontSize: '15px', lineHeight: '1.6', margin: 0 },
  followBtn: { backgroundColor: 'rgba(255,255,255,0.15)', color: '#fff', padding: '10px 20px', borderRadius: '8px', fontSize: '14px', fontWeight: '700', textAlign: 'center' },
  contentSection: { backgroundColor: '#1a0f2e', padding: '56px 24px' },
  contentTitle: { color: '#e8e0f0', fontSize: '28px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', textAlign: 'center', margin: '0 0 32px' },
  contentGrid: { maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' },
  contentCard: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '10px', padding: '20px' },
  contentCardTitle: { color: '#D4A843', fontSize: '15px', fontWeight: '700', margin: '0 0 6px' },
  contentCardDesc: { color: '#b8a8d0', fontSize: '13px', lineHeight: '1.5', margin: 0 },
  cta: { maxWidth: '520px', margin: '0 auto', padding: '56px 24px', textAlign: 'center' },
  ctaText: { color: '#b8a8d0', fontSize: '17px', marginBottom: '20px' },
  ctaBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontSize: '15px', fontWeight: '800' },
};
