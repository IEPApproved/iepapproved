// components/Nav.js
// Unified nav — identical on ALL pages
// Professional, no emojis in links, polished

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Nav({ questionCount = null, userTier = null }) {
  const { lang, toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  if (!mounted) return null;

  const navLinks = [
    { label: lang === 'es' ? 'Cómo Funciona' : 'How It Works', href: '/#how-it-works' },
    { label: lang === 'es' ? 'Tienda' : 'Storefront', href: '/storefront' },
    { label: lang === 'es' ? 'Comunidad' : 'Community', href: '/community' },
    { label: lang === 'es' ? 'Contáctenos' : 'Contact Us', href: '/contact' },
    { label: lang === 'es' ? 'Nuestra Historia' : 'Our Story', href: '/#our-story' },
  ];

  // Smart question badge
  const renderQuestionBadge = () => {
    if (userTier === 'unlimited' || questionCount === null) return null;
    const left = questionCount;
    if (left <= 0) {
      return (
        <Link href="/signup" style={s.badgeUrgent}>
          {lang === 'es' ? 'Actualizar para continuar' : 'Upgrade to continue'}
        </Link>
      );
    }
    if (left <= 2) {
      return (
        <Link href="/signup" style={s.badgeWarning}>
          {left} {lang === 'es' ? 'preguntas restantes' : `question${left === 1 ? '' : 's'} left`}
        </Link>
      );
    }
    return (
      <Link href="/intake" style={s.badgeNormal}>
        {left} {lang === 'es' ? 'preguntas gratis' : 'free questions'}
      </Link>
    );
  };

  return (
    <nav style={s.nav}>
      <div style={s.inner}>

        {/* LOGO */}
        <Link href="/" style={s.logoLink}>
          <img src="/logo.png" alt="IEP Approved" style={s.logo}
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }} />
          <div style={{ ...s.logoFallback, display: 'none' }}>
            <span style={s.logoIEP}>IEP</span>
            <span style={s.logoApproved}>APPROVED</span>
          </div>
        </Link>

        {/* DESKTOP */}
        {!isMobile && (
          <div style={s.desktopLinks}>
            {navLinks.map(link => (
              <Link key={link.href} href={link.href} style={s.link}>{link.label}</Link>
            ))}

            {renderQuestionBadge()}

            <button onClick={toggleLang} style={s.langToggle} aria-label="Toggle language">
              <span style={lang === 'en' ? s.langOn : s.langOff}>EN</span>
              <span style={s.langDiv}>|</span>
              <span style={lang === 'es' ? s.langOn : s.langOff}>ES</span>
            </button>

            <Link href="/intake" style={s.joinBtn}>
              {lang === 'es' ? 'Únete Gratis' : 'Join Free'}
            </Link>
            <Link href="/signup" style={s.unlimitedBtn}>
              {lang === 'es' ? 'Ada Sin Límites' : 'Ada Unlimited'}
            </Link>
          </div>
        )}

        {/* MOBILE RIGHT */}
        {isMobile && (
          <div style={s.mobileRight}>
            <button onClick={toggleLang} style={s.langToggleSm}>
              <span style={lang === 'en' ? s.langOn : s.langOff}>EN</span>
              <span style={s.langDiv}>|</span>
              <span style={lang === 'es' ? s.langOn : s.langOff}>ES</span>
            </button>
            <Link href="/intake" style={s.joinBtnSm}>
              {lang === 'es' ? 'Gratis' : 'Join Free'}
            </Link>
            <Link href="/signup" style={s.unlimitedBtnSm}>
              {lang === 'es' ? 'Sin Límites' : 'Unlimited'}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} style={s.hamburger} aria-label="Menu">
              <span style={s.bar} />
              <span style={{ ...s.bar, opacity: menuOpen ? 0 : 1 }} />
              <span style={s.bar} />
            </button>
          </div>
        )}
      </div>

      {/* MOBILE MENU */}
      {isMobile && menuOpen && (
        <div style={s.mobileMenu}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={s.mobileLink}
              onClick={() => setMenuOpen(false)}>{link.label}</Link>
          ))}
          {renderQuestionBadge()}
          <div style={s.mobileDivider} />
          <Link href="/intake" style={s.mobileJoin} onClick={() => setMenuOpen(false)}>
            {lang === 'es' ? 'Unirse Gratis — 10 preguntas/mes' : 'Join Free — 10 questions/month'}
          </Link>
          <Link href="/signup" style={s.mobileUnlimited} onClick={() => setMenuOpen(false)}>
            {lang === 'es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/month'}
          </Link>
        </div>
      )}
    </nav>
  );
}

const s = {
  nav: { position: 'sticky', top: 0, zIndex: 100, backgroundColor: '#2D1B4E', borderBottom: '2px solid #D4A843', width: '100%' },
  inner: { maxWidth: '1280px', margin: '0 auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  logoLink: { textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 },
  logo: { height: '42px', width: 'auto', objectFit: 'contain' },
  logoFallback: { alignItems: 'center', gap: '3px' },
  logoIEP: { fontSize: '18px', fontWeight: '800', color: '#D4A843', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '2px' },
  logoApproved: { fontSize: '18px', fontWeight: '800', color: '#fff', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '2px' },

  desktopLinks: { display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'nowrap' },
  link: { color: '#e8e0f0', textDecoration: 'none', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: '400', whiteSpace: 'nowrap' },

  // Question badges
  badgeNormal: { backgroundColor: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', whiteSpace: 'nowrap', textDecoration: 'none' },
  badgeWarning: { backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '700', whiteSpace: 'nowrap', textDecoration: 'none' },
  badgeUrgent: { backgroundColor: 'rgba(212,168,67,0.2)', border: '2px solid #D4A843', color: '#D4A843', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '800', whiteSpace: 'nowrap', textDecoration: 'none' },

  langToggle: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,168,67,0.5)', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: '700' },
  langToggleSm: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,168,67,0.5)', borderRadius: '20px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: 'Outfit, sans-serif', fontWeight: '700' },
  langOn: { color: '#D4A843' },
  langOff: { color: 'rgba(255,255,255,0.3)' },
  langDiv: { color: 'rgba(255,255,255,0.2)' },

  joinBtn: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  unlimitedBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },

  // Mobile
  mobileRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  joinBtnSm: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '5px 8px', borderRadius: '5px', textDecoration: 'none', fontSize: '11px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  unlimitedBtnSm: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '5px 8px', borderRadius: '5px', textDecoration: 'none', fontSize: '11px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  hamburger: { display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  bar: { width: '22px', height: '2px', backgroundColor: '#D4A843', display: 'block' },

  mobileMenu: { backgroundColor: '#2D1B4E', borderTop: '1px solid rgba(212,168,67,0.2)', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: '4px' },
  mobileLink: { color: '#e8e0f0', textDecoration: 'none', fontSize: '16px', fontFamily: 'Outfit, sans-serif', fontWeight: '400', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  mobileDivider: { height: '1px', backgroundColor: 'rgba(212,168,67,0.2)', margin: '12px 0' },
  mobileJoin: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', textAlign: 'center' },
  mobileUnlimited: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginTop: '8px' },
};
