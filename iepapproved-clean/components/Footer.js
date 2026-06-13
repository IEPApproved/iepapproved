// components/Footer.js
// Shared footer — appears on every page
// Import and add <Footer /> to every page

import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { lang } = useLanguage();
  const es = lang === 'es';

  return (
    <footer style={s.footer}>
      <div style={s.inner}>

        {/* BRAND */}
        <div style={s.brand}>
          <Link href="/" style={s.logoLink}>
            <img src="/logo.png" alt="IEP Approved" style={s.logo}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
            <span style={{display:'none', color:'#D4A843', fontSize:'20px', fontWeight:'800', fontFamily:'Cormorant Garamond, serif'}}>IEP APPROVED</span>
          </Link>
          <p style={s.tagline}>
            {es
              ? 'El conocimiento es poder. La colaboración es progreso. Juntos — convertimos los derechos en REALIDAD.'
              : 'Knowledge is power. Partnership is progress. Together — we turn rights into REALITY.'}
          </p>
          <div style={s.socialRow}>
            <a href="https://www.tiktok.com/@iepapproved.com" target="_blank" rel="noopener noreferrer" style={s.socialLink}>TikTok</a>
            <span style={s.socialDivider}>·</span>
            <a href="https://www.facebook.com/IEPapproved" target="_blank" rel="noopener noreferrer" style={s.socialLink}>Facebook</a>
          </div>
        </div>

        {/* PLATFORM */}
        <div style={s.col}>
          <p style={s.colTitle}>{es ? 'PLATAFORMA' : 'PLATFORM'}</p>
          <Link href="/ada" style={s.link}>{es ? 'Pregunta a Ada' : 'Ask Ada'}</Link>
          <Link href="/storefront" style={s.link}>{es ? 'Centro de Recursos' : 'Resource Center'}</Link>
          <Link href="/signup" style={s.link}>Ada Unlimited</Link>
          <Link href="/community" style={s.link}>{es ? 'Comunidad' : 'Community'}</Link>
        </div>

        {/* COMPANY */}
        <div style={s.col}>
          <p style={s.colTitle}>{es ? 'EMPRESA' : 'COMPANY'}</p>
          <Link href="/#our-story" style={s.link}>{es ? 'Nuestra Historia' : 'Our Story'}</Link>
          <Link href="/contact" style={s.link}>{es ? 'Contáctenos' : 'Contact Us'}</Link>
          <Link href="/social" style={s.link}>{es ? 'Redes Sociales' : 'Social Media'}</Link>
          <Link href="/feedback" style={s.link}>{es ? 'Comentarios' : 'Feedback'}</Link>
        </div>

        {/* LEGAL */}
        <div style={s.col}>
          <p style={s.colTitle}>{es ? 'LEGAL' : 'LEGAL'}</p>
          <Link href="/terms" style={s.link}>{es ? 'Términos de Servicio' : 'Terms of Service'}</Link>
          <Link href="/privacy" style={s.link}>{es ? 'Política de Privacidad' : 'Privacy Policy'}</Link>
          <Link href="/disclaimer" style={s.link}>{es ? 'Descargo de Responsabilidad' : 'Disclaimer'}</Link>
        </div>
      </div>

      {/* DISCLOSURE + COPYRIGHT */}
      <div style={s.bottom}>
        <p style={s.disclosure}>
          {es
            ? 'Ada es una asistente de IA, no una abogada humana. IEP Approved proporciona información legal solo con fines educativos y no constituye una relación abogado-cliente. Ada funciona con inteligencia artificial.'
            : 'Ada is an AI assistant, not a human attorney. IEP Approved provides legal information for educational purposes only and does not constitute an attorney-client relationship. Ada is powered by artificial intelligence.'}
        </p>
        <p style={s.copy}>
          {es
            ? '© 2026 IEP Approved LLC. Todos los derechos reservados.'
            : '© 2026 IEP Approved LLC. All rights reserved.'}
        </p>
      </div>
    </footer>
  );
}

const s = {
  footer: { backgroundColor: '#080512', fontFamily: 'Outfit, sans-serif' },
  inner: { maxWidth: '1200px', margin: '0 auto', padding: '56px 24px 32px', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '40px', flexWrap: 'wrap' },
  brand: { display: 'flex', flexDirection: 'column', gap: '12px' },
  logoLink: { textDecoration: 'none', display: 'inline-block' },
  logo: { height: '40px', width: 'auto', objectFit: 'contain' },
  tagline: { color: 'rgba(184,168,208,0.5)', fontSize: '13px', lineHeight: '1.6', margin: 0 },
  socialRow: { display: 'flex', alignItems: 'center', gap: '8px' },
  socialLink: { color: 'rgba(212,168,67,0.7)', textDecoration: 'none', fontSize: '13px', fontWeight: '600' },
  socialDivider: { color: 'rgba(255,255,255,0.2)', fontSize: '13px' },
  col: { display: 'flex', flexDirection: 'column', gap: '12px' },
  colTitle: { color: '#D4A843', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', margin: '0 0 4px' },
  link: { color: 'rgba(184,168,208,0.6)', textDecoration: 'none', fontSize: '14px', transition: 'color 0.2s' },
  bottom: { borderTop: '1px solid rgba(255,255,255,0.06)', padding: '24px', textAlign: 'center' },
  disclosure: { color: 'rgba(184,168,208,0.3)', fontSize: '12px', lineHeight: '1.6', maxWidth: '800px', margin: '0 auto 8px' },
  copy: { color: 'rgba(184,168,208,0.2)', fontSize: '11px', margin: 0 },
};
