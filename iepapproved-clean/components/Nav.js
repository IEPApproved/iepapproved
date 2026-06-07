// components/Nav.js
// Shared navigation — used on homepage AND ada page
// Includes: logo fix, EN|ES toggle, Storefront, Community links

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

export default function Nav({ questionCount = null }) {
  const { lang, toggleLang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return null;

  return (
    <>
      <nav style={styles.nav}>
        <div style={styles.inner}>

          {/* LOGO — fixed to use next/image with fallback */}
          <Link href="/" style={styles.logoLink}>
            <img
              src="/images/logo.png"
              alt="IEP Approved"
              style={styles.logo}
              onError={(e) => {
                // Fallback if logo image missing
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            {/* Text fallback logo */}
            <div style={{ ...styles.logoFallback, display: 'none' }}>
              <span style={styles.logoTextIEP}>IEP</span>
              <span style={styles.logoTextApproved}>APPROVED</span>
            </div>
          </Link>

          {/* DESKTOP LINKS */}
          <div style={styles.links}>
            <Link href="/#how-it-works" style={styles.link}>{t('nav_howItWorks')}</Link>
            <Link href="/storefront" style={styles.link}>{t('nav_storefront')}</Link>
            <Link href="/community" style={styles.link}>{t('nav_community')}</Link>
            <Link href="/contact" style={styles.link}>{t('nav_contact')}</Link>

            {/* QUESTION COUNT — shows on Ada page when passed */}
            {questionCount !== null && (
              <span style={styles.questionBadge}>
                {questionCount} {lang === 'es' ? 'preguntas' : 'questions'}
              </span>
            )}

            {/* EN | ES TOGGLE */}
            <button onClick={toggleLang} style={styles.langToggle} aria-label="Toggle language">
              {lang === 'en' ? (
                <><span style={styles.langActive}>EN</span><span style={styles.langDivider}>|</span><span style={styles.langInactive}>ES</span></>
              ) : (
                <><span style={styles.langInactive}>EN</span><span style={styles.langDivider}>|</span><span style={styles.langActive}>ES</span></>
              )}
            </button>

            <Link href="/ada" style={styles.ctaBtn}>{t('nav_askAda')}</Link>
          </div>

          {/* MOBILE HAMBURGER */}
          <button
            style={styles.hamburger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span style={{ ...styles.bar, transform: menuOpen ? 'rotate(45deg) translateY(8px)' : 'none' }} />
            <span style={{ ...styles.bar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...styles.bar, transform: menuOpen ? 'rotate(-45deg) translateY(-8px)' : 'none' }} />
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div style={styles.mobileMenu}>
            <Link href="/#how-it-works" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav_howItWorks')}</Link>
            <Link href="/storefront" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav_storefront')}</Link>
            <Link href="/community" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav_community')}</Link>
            <Link href="/contact" style={styles.mobileLink} onClick={() => setMenuOpen(false)}>{t('nav_contact')}</Link>
            <button onClick={() => { toggleLang(); setMenuOpen(false); }} style={styles.mobileLangBtn}>
              {lang === 'en' ? 'Switch to Español' : 'Switch to English'}
            </button>
            <Link href="/ada" style={styles.mobileCta} onClick={() => setMenuOpen(false)}>{t('nav_askAda')}</Link>
          </div>
        )}
      </nav>
    </>
  );
}

const styles = {
  nav: {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    backgroundColor: '#2D1B4E',
    borderBottom: '2px solid #D4A843',
    width: '100%',
  },
  inner: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 24px',
    height: '68px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logoLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    height: '44px',
    width: 'auto',
    objectFit: 'contain',
  },
  logoFallback: {
    alignItems: 'center',
    gap: '4px',
  },
  logoTextIEP: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#D4A843',
    fontFamily: 'Cormorant Garamond, serif',
    letterSpacing: '2px',
  },
  logoTextApproved: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#ffffff',
    fontFamily: 'Cormorant Garamond, serif',
    letterSpacing: '2px',
  },
  links: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
    '@media (maxWidth: 768px)': { display: 'none' },
  },
  link: {
    color: '#e8e0f0',
    textDecoration: 'none',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '400',
    transition: 'color 0.2s',
    whiteSpace: 'nowrap',
  },
  questionBadge: {
    backgroundColor: 'rgba(212, 168, 67, 0.15)',
    border: '1px solid #D4A843',
    color: '#D4A843',
    padding: '4px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    whiteSpace: 'nowrap',
  },
  langToggle: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '5px 12px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
    fontSize: '13px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    transition: 'all 0.2s',
  },
  langActive: {
    color: '#D4A843',
  },
  langInactive: {
    color: 'rgba(255,255,255,0.4)',
  },
  langDivider: {
    color: 'rgba(255,255,255,0.3)',
  },
  ctaBtn: {
    backgroundColor: '#D4A843',
    color: '#2D1B4E',
    padding: '9px 18px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '13px',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    whiteSpace: 'nowrap',
    transition: 'background 0.2s',
  },
  hamburger: {
    display: 'none',
    flexDirection: 'column',
    gap: '5px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    '@media (maxWidth: 768px)': { display: 'flex' },
  },
  bar: {
    width: '24px',
    height: '2px',
    backgroundColor: '#D4A843',
    transition: 'all 0.3s',
    display: 'block',
  },
  mobileMenu: {
    backgroundColor: '#2D1B4E',
    borderTop: '1px solid rgba(212,168,67,0.3)',
    padding: '16px 24px 24px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  mobileLink: {
    color: '#e8e0f0',
    textDecoration: 'none',
    fontSize: '16px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '400',
    padding: '8px 0',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  mobileLangBtn: {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '6px',
    color: '#D4A843',
    padding: '10px 16px',
    fontSize: '15px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
  },
  mobileCta: {
    backgroundColor: '#D4A843',
    color: '#2D1B4E',
    padding: '12px 20px',
    borderRadius: '6px',
    textDecoration: 'none',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    textAlign: 'center',
  },
};
