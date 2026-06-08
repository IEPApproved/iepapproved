// pages/login.js — Updated with clean success state
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { createClient } from '../lib/supabase'

const translations = {
  en: {
    signin: 'Sign In', signup: 'Create Account', email: 'Email Address',
    password: 'Password', fullName: 'Full Name', signinBtn: 'Sign In',
    signupBtn: 'Create Account', noAccount: "Don't have an account?",
    hasAccount: 'Already have an account?', switchSignup: 'Create one free',
    switchSignin: 'Sign in', forgotPassword: 'Forgot password?',
    tagline: 'Your IEP advocate, powered by AI',
    subtitle: "Get answers about your child's rights — in plain language.",
    errorGeneric: 'Something went wrong. Please try again.',
    resetSent: 'Reset email sent! Check your inbox.',
    resetTitle: 'Reset Password', resetBtn: 'Send Reset Link',
    backToSignin: 'Back to sign in', stateLabel: 'Your State (optional)',
    statePlaceholder: 'Select your state',
    // Success screen
    checkEmailTitle: 'Check your email! 📬',
    checkEmailDesc: "We sent a confirmation link to",
    checkEmailDesc2: "Click the link in that email to activate your account and start using Ada.",
    checkEmailNote: "Don't see it? Check your spam folder.",
    goToSignIn: 'Already confirmed? Sign In',
  },
  es: {
    signin: 'Iniciar Sesión', signup: 'Crear Cuenta', email: 'Correo Electrónico',
    password: 'Contraseña', fullName: 'Nombre Completo', signinBtn: 'Iniciar Sesión',
    signupBtn: 'Crear Cuenta', noAccount: '¿No tienes cuenta?',
    hasAccount: '¿Ya tienes cuenta?', switchSignup: 'Crear una gratis',
    switchSignin: 'Iniciar sesión', forgotPassword: '¿Olvidaste tu contraseña?',
    tagline: 'Tu defensora de IEP, impulsada por IA',
    subtitle: 'Obtén respuestas sobre los derechos de tu hijo — en lenguaje sencillo.',
    errorGeneric: 'Algo salió mal. Por favor intenta de nuevo.',
    resetSent: '¡Correo enviado! Revisa tu bandeja.',
    resetTitle: 'Recuperar Contraseña', resetBtn: 'Enviar Enlace',
    backToSignin: 'Volver a iniciar sesión', stateLabel: 'Tu Estado (opcional)',
    statePlaceholder: 'Selecciona tu estado',
    checkEmailTitle: '¡Revisa tu correo! 📬',
    checkEmailDesc: 'Enviamos un enlace de confirmación a',
    checkEmailDesc2: 'Haz clic en el enlace para activar tu cuenta y comenzar a usar Ada.',
    checkEmailNote: '¿No lo ves? Revisa tu carpeta de spam.',
    goToSignIn: '¿Ya confirmaste? Iniciar Sesión',
  }
}

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming']

export default function LoginPage() {
  const router = useRouter()
  const { redirect = '/ada', error: urlError, mode: urlMode } = router.query
  const [lang, setLang] = useState('en')
  const [mode, setMode] = useState('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [state, setState] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)

  const t = translations[lang]
  const supabase = createClient()

  useEffect(() => {
    const saved = localStorage.getItem('iep-lang')
    if (saved === 'en' || saved === 'es') setLang(saved)
    else if (navigator.language.startsWith('es')) setLang('es')
    if (urlMode === 'signup') setMode('signup')
  }, [urlMode])

  const handleSignIn = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push(redirect || '/ada')
  }

  const handleSignUp = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({
      email, password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: { full_name: fullName, language_preference: lang, state: state || null }
      }
    })
    if (error) { setError(error.message); setLoading(false) }
    else { setSignupSuccess(true); setLoading(false) }
  }

  const handleReset = async () => {
    setLoading(true); setError('')
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    })
    if (error) { setError(error.message) }
    else setResetSuccess(true)
    setLoading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (mode === 'signin') handleSignIn()
    else if (mode === 'signup') handleSignUp()
    else handleReset()
  }

  const switchMode = (newMode) => { setMode(newMode); setError(''); setSignupSuccess(false); setResetSuccess(false) }

  // ── SIGNUP SUCCESS SCREEN ──
  if (signupSuccess) {
    return (
      <div style={pageStyle}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={brandStyle}>IEP<span style={{ color: '#27ae60' }}>approved</span></div>
            </Link>
          </div>
          <div style={cardStyle}>
            <div style={{ textAlign: 'center', padding: '16px 0 8px' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📬</div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 12px' }}>
                {t.checkEmailTitle}
              </h1>
              <p style={{ color: '#6b7280', fontSize: '15px', margin: '0 0 8px' }}>
                {t.checkEmailDesc}
              </p>
              <p style={{ color: '#1a5276', fontWeight: '700', fontSize: '16px', margin: '0 0 16px' }}>
                {email}
              </p>
              <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: '1.6', margin: '0 0 24px' }}>
                {t.checkEmailDesc2}
              </p>
              <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '12px', marginBottom: '24px' }}>
                <p style={{ color: '#16a34a', fontSize: '13px', margin: 0 }}>✅ {t.checkEmailNote}</p>
              </div>
              <button
                onClick={() => switchMode('signin')}
                style={{ background: '#1a5276', color: 'white', border: 'none', borderRadius: '50px', padding: '12px 28px', fontSize: '15px', fontWeight: '600', cursor: 'pointer', fontFamily: 'inherit', width: '100%' }}
              >
                {t.goToSignIn}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── RESET SUCCESS SCREEN ──
  if (resetSuccess) {
    return (
      <div style={pageStyle}>
        <div style={{ width: '100%', maxWidth: '440px' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Link href="/" style={{ textDecoration: 'none' }}>
              <div style={brandStyle}>IEP<span style={{ color: '#27ae60' }}>approved</span></div>
            </Link>
          </div>
          <div style={cardStyle}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>📩</div>
              <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 12px' }}>{t.resetSent}</h1>
              <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 24px' }}>Check {email} for a link to reset your password.</p>
              <button onClick={() => switchMode('signin')} style={{ background: 'none', border: 'none', color: '#1a5276', textDecoration: 'underline', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' }}>
                {t.backToSignin}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={pageStyle}>
      <div style={{ width: '100%', maxWidth: '440px' }}>

        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div style={brandStyle}>IEP<span style={{ color: '#27ae60' }}>approved</span></div>
          </Link>
          <p style={{ marginTop: '8px', fontSize: '14px', color: '#888' }}>{t.tagline}</p>
        </div>

        {/* Lang toggle */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
          <div style={{ background: '#f3f4f6', borderRadius: '50px', padding: '4px', display: 'flex', gap: '4px' }}>
            {['en', 'es'].map(l => (
              <button key={l} onClick={() => { setLang(l); localStorage.setItem('iep-lang', l) }}
                style={{ padding: '6px 16px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '500', background: lang === l ? 'white' : 'transparent', color: lang === l ? '#1a5276' : '#888', boxShadow: lang === l ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', fontFamily: 'inherit' }}>
                {l === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}
              </button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={cardStyle}>
          <h1 style={{ fontSize: '22px', fontWeight: 'bold', color: '#1a1a1a', margin: '0 0 4px' }}>
            {mode === 'reset' ? t.resetTitle : mode === 'signin' ? t.signin : t.signup}
          </h1>
          <p style={{ fontSize: '13px', color: '#888', margin: '0 0 24px' }}>{t.subtitle}</p>

          {(error || urlError) && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '12px', marginBottom: '16px', fontSize: '13px', color: '#dc2626' }}>
              {error || t.errorGeneric}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {mode === 'signup' && (
                <div>
                  <label style={labelStyle}>{t.fullName}</label>
                  <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} required placeholder="Jane Smith" style={inputStyle} />
                </div>
              )}

              <div>
                <label style={labelStyle}>{t.email}</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jane@example.com" style={inputStyle} />
              </div>

              {mode !== 'reset' && (
                <div>
                  <label style={labelStyle}>{t.password}</label>
                  <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} placeholder="••••••••" style={inputStyle} />
                </div>
              )}

              {mode === 'signup' && (
                <div>
                  <label style={labelStyle}>{t.stateLabel}</label>
                  <select value={state} onChange={e => setState(e.target.value)} style={{ ...inputStyle, background: 'white' }}>
                    <option value="">{t.statePlaceholder}</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              )}

              <button type="submit" disabled={loading}
                style={{ background: loading ? '#93afc4' : '#1a5276', color: 'white', border: 'none', borderRadius: '50px', padding: '14px', fontSize: '15px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', marginTop: '4px', width: '100%', fontFamily: 'inherit' }}>
                {loading ? '...' : mode === 'reset' ? t.resetBtn : mode === 'signin' ? t.signinBtn : t.signupBtn}
              </button>
            </div>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '13px', color: '#888' }}>
            {mode === 'signin' && (
              <>
                <p style={{ margin: '0 0 8px' }}>{t.noAccount}{' '}<button onClick={() => switchMode('signup')} style={linkBtnStyle}>{t.switchSignup}</button></p>
                <button onClick={() => switchMode('reset')} style={{ ...linkBtnStyle, color: '#1a5276' }}>{t.forgotPassword}</button>
              </>
            )}
            {mode === 'signup' && (
              <p style={{ margin: 0 }}>{t.hasAccount}{' '}<button onClick={() => switchMode('signin')} style={linkBtnStyle}>{t.switchSignin}</button></p>
            )}
            {mode === 'reset' && (
              <button onClick={() => switchMode('signin')} style={linkBtnStyle}>{t.backToSignin}</button>
            )}
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: '11px', color: '#bbb', marginTop: '24px' }}>
          © {new Date().getFullYear()} IEP Approved, LLC · Ada is AI, not legal advice.
        </p>
      </div>
    </div>
  )
}

const pageStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #f0f7ff 0%, #ffffff 50%, #e8f5e9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px 16px', fontFamily: 'Georgia, serif' }
const brandStyle = { fontSize: '28px', fontWeight: 'bold', color: '#1a5276', letterSpacing: '-0.5px' }
const cardStyle = { background: 'white', borderRadius: '20px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)', border: '1px solid #f0f0f0', padding: '40px' }
const labelStyle = { display: 'block', fontSize: '13px', fontWeight: '500', color: '#374151', marginBottom: '6px' }
const inputStyle = { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e5e7eb', fontSize: '14px', color: '#1a1a1a', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }
const linkBtnStyle = { background: 'none', border: 'none', color: '#27ae60', fontWeight: '600', cursor: 'pointer', fontSize: '13px', textDecoration: 'underline', padding: 0, fontFamily: 'inherit' }
