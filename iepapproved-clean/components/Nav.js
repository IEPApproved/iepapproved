// components/Nav.js
// Updated with auth state — Sign In, user dropdown, tier badge

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useLanguage } from '../context/LanguageContext';
import { useAuth, useIsUnlimited } from '../context/AuthContext';

export default function Nav({ questionCount = null }) {
  const { lang, toggleLang } = useLanguage();
  const { user, profile, signOut, loading } = useAuth();
  const isUnlimited = useIsUnlimited();
const tierLabel = profile?.tier === 'advocate' ? 'IEP Advocate' : profile?.tier === 'pro' ? 'IEP Pro' : profile?.tier === 'unlimited' ? (lang === 'es' ? 'Ada Sin Límites' : 'Ada Unlimited') : null;
  const router = useRouter();

  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setMounted(true);
    const check = () => setIsMobile(window.innerWidth < 900);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (!e.target.closest('#user-menu-wrap')) setUserMenuOpen(false);
    };
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  if (!mounted) return null;

  const handleSignOut = async () => {
    await signOut();
    setUserMenuOpen(false);
    setMenuOpen(false);
    router.push('/');
  };

  const openPortal = async () => {
try {
const res = await fetch('/api/create-portal', { method: 'POST' });
const data = await res.json();
if (data.url) { window.location.href = data.url; } else { alert('Could not open the billing portal. Please contact info@iepapproved.com.'); }
} catch (e) {
alert('Could not open the billing portal. Please contact info@iepapproved.com.');
}
};

const navLinks = [
    { label: lang === 'es' ? 'Cómo Funciona' : 'How It Works', href: '/#how-it-works' },
{ label: lang === 'es' ? 'Por Estado' : 'States', href: '/states' },
    { label: lang === 'es' ? 'Tienda' : 'Storefront', href: '/storefront' },
    { label: lang === 'es' ? 'Comunidad' : 'Community', href: '/community' },
    { label: lang === 'es' ? 'Contáctenos' : 'Contact Us', href: '/contact' },
    { label: lang === 'es' ? 'Nuestra Historia' : 'Our Story', href: '/#our-story' },
  ];

  // Question badge for free users
  const renderQuestionBadge = () => {
    if (isUnlimited || questionCount === null) return null;
    const left = questionCount;
    if (left <= 0) {
      return (
        <Link href="/login?mode=signup" style={s.badgeUrgent}>
          {lang === 'es' ? 'Actualizar para continuar' : 'Upgrade to continue'}
        </Link>
      );
    }
    if (left <= 2) {
      return (
        <Link href="/login?mode=signup" style={s.badgeWarning}>
          {left} {lang === 'es' ? 'preguntas restantes' : `question${left === 1 ? '' : 's'} left`}
        </Link>
      );
    }
    return (
      <span style={s.badgeNormal}>
        {left} {lang === 'es' ? 'preguntas gratis' : 'free questions'}
      </span>
    );
  };

  // Auth section - desktop
  const renderAuthDesktop = () => {
    if (loading) {
      return <div style={s.authLoading} />;
    }

    if (user) {
      const displayName = profile?.full_name?.split(' ')[0] || user.email?.split('@')[0] || 'Account';

      return (
        <div id="user-menu-wrap" style={{ position: 'relative' }}>
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            style={s.userMenuBtn}
          >
            <div style={s.userAvatar}>{displayName[0].toUpperCase()}</div>
            <span style={s.userName}>{displayName}</span>
            {isUnlimited && tierLabel && <span style={s.unlimitedPill}>✦ {tierLabel}</span>}
            <span style={{ color: '#D4A843', fontSize: '10px' }}>▼</span>
          </button>

          {userMenuOpen && (
            <div style={s.dropdown}>
              {/* User info */}
              <div style={s.dropdownHeader}>
                <div style={s.dropdownEmail}>{user.email}</div>
                <div style={s.dropdownTier}>
                  {isUnlimited
                    ? (lang === 'es' ? ('✦ ' + tierLabel + ' — Activo') : ('✦ ' + tierLabel + ' — Active'))
                    : (lang === 'es' ? 'Plan Gratuito' : 'Free Plan')
                  }
                </div>
              </div>

              <div style={s.dropdownDivider} />

              {/* Menu items */}
              <Link href="/ada" style={s.dropdownItem} onClick={() => setUserMenuOpen(false)}>
                💬 {lang === 'es' ? 'Hablar con Ada' : 'Talk to Ada'}
              </Link>

{isUnlimited && (
<Link href="/states" style={s.dropdownItem} onClick={() => setUserMenuOpen(false)}>
{lang === 'es' ? 'Recursos de tu estado' : 'Your state resources'}
</Link>
)}
{isUnlimited && (
<button onClick={openPortal} style={s.dropdownManage}>
{lang === 'es' ? 'Administrar suscripción' : 'Manage subscription'}
</button>
)}

              {isUnlimited && (
                <>
                  <div style={s.dropdownItem}>
                    <span style={{ color: '#D4A843' }}>✦ {lang === 'es' ? ('Tus beneficios ' + tierLabel + ':') : ('Your ' + tierLabel + ' benefits:')}</span>
                  </div>
                  <div style={s.unlimitedBenefits}>
                    {((profile?.tier === 'pro' || profile?.tier === 'advocate') ? [lang === 'es' ? 'Preguntas ilimitadas' : 'Unlimited questions', lang === 'es' ? 'Recursos por estado' : 'State-specific resources', lang === 'es' ? 'Voz EN + ES' : 'Voice EN + ES', lang === 'es' ? 'Acceso a comunidad' : 'Community access'] : [lang === 'es' ? 'Preguntas ilimitadas' : 'Unlimited questions', lang === 'es' ? 'Voz EN + ES' : 'Voice EN + ES']).map((b, i) => <div key={i} style={s.benefit}>✓ {b}</div>)}
                  </div>
                  <div style={s.dropdownDivider} />
                </>
              )}

              {!isUnlimited && (
                <>
                  <Link href="/signup" style={s.dropdownUpgrade} onClick={() => setUserMenuOpen(false)}>
                    ⚡ {lang === 'es' ? 'Actualizar a Ada Sin Límites' : 'Upgrade to Ada Unlimited'}
                  </Link>
                  <div style={s.dropdownDivider} />
                </>
              )}

              <button onClick={handleSignOut} style={s.dropdownSignOut}>
                {lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>
      );
    }

    // Not logged in
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Link href="/login" style={s.signInBtn}>
          {lang === 'es' ? 'Iniciar Sesión' : 'Sign In'}
        </Link>
        <Link href="/login?mode=signup" style={s.joinBtn}>
          {lang === 'es' ? 'Únete Gratis' : 'Join Free'}
        </Link>
        <Link href="/signup" style={s.unlimitedBtn}>
          {lang === 'es' ? 'Ada Sin Límites' : 'Ada Unlimited'}
        </Link>
      </div>
    );
  };

  // Mobile auth items in hamburger menu
  const renderAuthMobile = () => {
    if (loading) return null;

    if (user) {
      const displayName = profile?.full_name || user.email?.split('@')[0] || 'Account';
      return (
        <>
          <div style={s.mobileDivider} />
          <div style={s.mobileUserInfo}>
            <div style={s.mobileUserName}>{displayName}</div>
            <div style={s.mobileUserEmail}>{user.email}</div>
            {isUnlimited && (
              <div style={s.mobileUnlimitedBadge}>✦ {lang === 'es' ? 'Ada Sin Límites — Activo' : 'Ada Unlimited — Active'}</div>
            )}
          </div>
          {isUnlimited && (
            <div style={s.mobileBenefitsBox}>
              <div style={s.mobileBenefitsTitle}>{lang === 'es' ? 'Tus beneficios:' : 'Your benefits:'}</div>
              {[
                lang === 'es' ? 'Preguntas ilimitadas' : 'Unlimited questions',
                lang === 'es' ? 'Recursos por estado' : 'State-specific resources',
                lang === 'es' ? 'Voz EN + ES' : 'Voice EN + ES',
                lang === 'es' ? 'Acceso a comunidad' : 'Community access',
              ].map((b, i) => <div key={i} style={s.mobileBenefit}>✓ {b}</div>)}
            </div>
          )}
          {!isUnlimited && (
            <Link href="/signup" style={s.mobileUnlimited} onClick={() => setMenuOpen(false)}>
              ⚡ {lang === 'es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/month'}
            </Link>
          )}
          <button onClick={handleSignOut} style={s.mobileSignOut}>
            {lang === 'es' ? 'Cerrar Sesión' : 'Sign Out'}
          </button>
        </>
      );
    }

    return (
      <>
        <div style={s.mobileDivider} />
        <Link href="/login" style={s.mobileSignIn} onClick={() => setMenuOpen(false)}>
          {lang === 'es' ? 'Iniciar Sesión' : 'Sign In'}
        </Link>
        <Link href="/login?mode=signup" style={s.mobileJoin} onClick={() => setMenuOpen(false)}>
          {lang === 'es' ? 'Unirse Gratis — 10 preguntas/mes' : 'Join Free — 10 questions/month'}
        </Link>
        <Link href="/signup" style={s.mobileUnlimited} onClick={() => setMenuOpen(false)}>
          {lang === 'es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/month'}
        </Link>
      </>
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
            {renderAuthDesktop()}
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
            {!loading && !user && (
              <Link href="/login" style={s.joinBtnSm}>
                {lang === 'es' ? 'Entrar' : 'Sign In'}
              </Link>
            )}
            {!loading && user && (
              <div style={s.mobileUserDot}>
                {(profile?.full_name?.[0] || user.email?.[0] || 'U').toUpperCase()}
                {isUnlimited && <span style={s.mobileUnlimitedDot} />}
              </div>
            )}
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
          {renderAuthMobile()}
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
  desktopLinks: { display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'nowrap' },
  link: { color: '#e8e0f0', textDecoration: 'none', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: '400', whiteSpace: 'nowrap' },

  // Badges
  badgeNormal: { backgroundColor: 'rgba(212,168,67,0.12)', border: '1px solid rgba(212,168,67,0.4)', color: '#D4A843', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', whiteSpace: 'nowrap' },
  badgeWarning: { backgroundColor: 'rgba(245,158,11,0.15)', border: '1px solid #f59e0b', color: '#f59e0b', padding: '4px 10px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '700', whiteSpace: 'nowrap', textDecoration: 'none' },
  badgeUrgent: { backgroundColor: 'rgba(212,168,67,0.2)', border: '2px solid #D4A843', color: '#D4A843', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontFamily: 'Outfit, sans-serif', fontWeight: '800', whiteSpace: 'nowrap', textDecoration: 'none' },

  // Lang
  langToggle: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,168,67,0.5)', borderRadius: '20px', padding: '5px 12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: '700' },
  langToggleSm: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(212,168,67,0.5)', borderRadius: '20px', padding: '4px 8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '3px', fontSize: '11px', fontFamily: 'Outfit, sans-serif', fontWeight: '700' },
  langOn: { color: '#D4A843' },
  langOff: { color: 'rgba(255,255,255,0.3)' },
  langDiv: { color: 'rgba(255,255,255,0.2)' },

  // Auth buttons
  authLoading: { width: '80px', height: '32px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', animation: 'pulse 1.5s infinite' },
  signInBtn: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#e8e0f0', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  joinBtn: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  unlimitedBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '7px 14px', borderRadius: '6px', textDecoration: 'none', fontSize: '13px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },

  // User menu button
  userMenuBtn: { display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(212,168,67,0.4)', borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', fontFamily: 'Outfit, sans-serif' },
  userAvatar: { width: '28px', height: '28px', borderRadius: '50%', background: '#D4A843', color: '#2D1B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', flexShrink: 0 },
  userName: { color: '#e8e0f0', fontSize: '13px', fontWeight: '600', maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  unlimitedPill: { background: 'rgba(212,168,67,0.2)', color: '#D4A843', fontSize: '10px', fontWeight: '700', padding: '2px 8px', borderRadius: '20px', whiteSpace: 'nowrap' },

  // Dropdown
  dropdown: { position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: '#1a0f2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '12px', minWidth: '240px', boxShadow: '0 16px 48px rgba(0,0,0,0.4)', zIndex: 200, overflow: 'hidden' },
  dropdownHeader: { padding: '16px', background: 'rgba(212,168,67,0.05)' },
  dropdownEmail: { color: '#e8e0f0', fontSize: '13px', fontFamily: 'Outfit, sans-serif', fontWeight: '600', marginBottom: '4px' },
  dropdownTier: { color: '#D4A843', fontSize: '11px', fontFamily: 'Outfit, sans-serif', fontWeight: '700' },
  dropdownDivider: { height: '1px', background: 'rgba(255,255,255,0.06)' },
  dropdownItem: { display: 'block', padding: '12px 16px', color: '#e8e0f0', fontSize: '13px', fontFamily: 'Outfit, sans-serif', textDecoration: 'none', cursor: 'default' },
  dropdownUpgrade: { display: 'block', margin: '8px 12px', padding: '10px 16px', background: '#D4A843', color: '#2D1B4E', fontSize: '13px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', textDecoration: 'none', borderRadius: '8px', textAlign: 'center' },
  dropdownManage: { display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', color: '#e8e0f0', fontSize: '13px', fontFamily: 'Outfit, sans-serif', cursor: 'pointer', textAlign: 'left' },
dropdownSignOut: { display: 'block', width: '100%', padding: '12px 16px', background: 'none', border: 'none', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#b8a8d0', fontSize: '13px', fontFamily: 'Outfit, sans-serif', cursor: 'pointer', textAlign: 'left' },
  unlimitedBenefits: { padding: '4px 16px 12px' },
  benefit: { color: '#D4A843', fontSize: '12px', fontFamily: 'Outfit, sans-serif', padding: '2px 0' },

  // Mobile
  mobileRight: { display: 'flex', alignItems: 'center', gap: '8px' },
  joinBtnSm: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '5px 8px', borderRadius: '5px', textDecoration: 'none', fontSize: '11px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap' },
  mobileUserDot: { width: '32px', height: '32px', borderRadius: '50%', background: '#D4A843', color: '#2D1B4E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: '800', position: 'relative', cursor: 'pointer' },
  mobileUnlimitedDot: { position: 'absolute', bottom: '0', right: '0', width: '10px', height: '10px', borderRadius: '50%', background: '#22c55e', border: '2px solid #2D1B4E' },
  hamburger: { display: 'flex', flexDirection: 'column', gap: '5px', background: 'none', border: 'none', cursor: 'pointer', padding: '4px' },
  bar: { width: '22px', height: '2px', backgroundColor: '#D4A843', display: 'block' },
  mobileMenu: { backgroundColor: '#2D1B4E', borderTop: '1px solid rgba(212,168,67,0.2)', padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', gap: '4px' },
  mobileLink: { color: '#e8e0f0', textDecoration: 'none', fontSize: '16px', fontFamily: 'Outfit, sans-serif', fontWeight: '400', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
  mobileDivider: { height: '1px', backgroundColor: 'rgba(212,168,67,0.2)', margin: '12px 0' },
  mobileUserInfo: { padding: '4px 0 12px' },
  mobileUserName: { color: '#e8e0f0', fontSize: '16px', fontWeight: '700', fontFamily: 'Outfit, sans-serif' },
  mobileUserEmail: { color: '#b8a8d0', fontSize: '12px', fontFamily: 'Outfit, sans-serif', marginTop: '2px' },
  mobileUnlimitedBadge: { color: '#D4A843', fontSize: '12px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginTop: '6px' },
  mobileBenefitsBox: { background: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '8px', padding: '12px 16px', marginBottom: '8px' },
  mobileBenefitsTitle: { color: '#D4A843', fontSize: '12px', fontWeight: '700', fontFamily: 'Outfit, sans-serif', marginBottom: '6px' },
  mobileBenefit: { color: '#e8e0f0', fontSize: '13px', fontFamily: 'Outfit, sans-serif', padding: '2px 0' },
  mobileSignIn: { backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.3)', color: '#e8e0f0', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginBottom: '8px' },
  mobileJoin: { backgroundColor: 'transparent', border: '1px solid #D4A843', color: '#D4A843', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '600', fontFamily: 'Outfit, sans-serif', textAlign: 'center' },
  mobileUnlimited: { backgroundColor: '#D4A843', color: '#2D1B4E', padding: '12px 16px', borderRadius: '8px', textDecoration: 'none', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', textAlign: 'center', marginTop: '8px' },
  mobileSignOut: { background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: '#b8a8d0', fontSize: '14px', fontFamily: 'Outfit, sans-serif', padding: '10px 16px', cursor: 'pointer', marginTop: '8px', textAlign: 'center' },
};
