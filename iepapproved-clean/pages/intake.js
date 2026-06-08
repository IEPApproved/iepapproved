// pages/intake.js
// Free account creation — language preference, password eye toggle, Other diagnosis text field

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const DIAGNOSES_EN = ['Autism Spectrum Disorder (ASD)','Attention Deficit Hyperactivity Disorder (ADHD)','Down Syndrome','Cerebral Palsy','Dyslexia / Reading Disability','Intellectual Disability','Speech or Language Impairment','Emotional Disturbance','Traumatic Brain Injury (TBI)','Visual Impairment','Hearing Impairment / Deafness','Orthopedic Impairment','Other Health Impairment','Developmental Delay','Multiple Disabilities','Other'];
const DIAGNOSES_ES = ['Trastorno del Espectro Autista (TEA)','Trastorno por Déficit de Atención e Hiperactividad (TDAH)','Síndrome de Down','Parálisis Cerebral','Dislexia / Discapacidad Lectora','Discapacidad Intelectual','Deterioro del Habla o del Lenguaje','Perturbación Emocional','Lesión Cerebral Traumática (LCT)','Discapacidad Visual','Discapacidad Auditiva / Sordera','Deterioro Ortopédico','Otro Deterioro de Salud','Retraso del Desarrollo','Discapacidades Múltiples','Otro'];

export default function IntakePage() {
  const router = useRouter();
  const { lang } = useLanguage();
  const { email: emailParam } = router.query;
  const es = lang === 'es';

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    state: '',
    childAge: '',
    diagnosis: '',
    diagnosisOther: '',
    langPref: 'en',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (emailParam) setForm(prev => ({ ...prev, email: emailParam }));
  }, [emailParam]);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.email || !form.password || !form.state) {
      setError(es ? 'Por favor completa todos los campos requeridos.' : 'Please fill in all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError(es ? 'La contraseña debe tener al menos 8 caracteres.' : 'Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      localStorage.setItem('iep_user_tier', 'free');
      localStorage.setItem('iep_question_count', '0');
      localStorage.setItem('iep_user_name', form.name);
      localStorage.setItem('iep_user_email', form.email);
      localStorage.setItem('iep_user_state', form.state);
      localStorage.setItem('iep_lang_pref', form.langPref);

      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          source: 'intake',
          lang: form.langPref,
        }),
      });

      setSubmitted(true);
      setTimeout(() => router.push('/ada'), 2500);
    } catch (err) {
      console.error(err);
      setError(es ? 'Algo salió mal. Por favor intenta de nuevo.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const diagnoses = es ? DIAGNOSES_ES : DIAGNOSES_EN;

  return (
    <>
      <Head>
        <title>{es ? 'Crear tu Cuenta Gratuita — IEP Approved' : 'Create Your Free Account — IEP Approved'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Nav />

      <div style={s.page}>
        <div style={s.card}>
          {!submitted ? (
            <>
              <div style={s.header}>
                <h1 style={s.title}>{es ? 'Crear tu Cuenta Gratuita' : 'Create Your Free Account'}</h1>
                <p style={s.subtitle}>
                  {es
                    ? <>Obtén <strong style={{color:'#D4A843'}}>10 preguntas gratuitas por mes</strong> — sin tarjeta de crédito.</>
                    : <>Get <strong style={{color:'#D4A843'}}>10 free questions per month</strong> — no credit card needed.</>
                  }
                </p>
              </div>

              {error && <div style={s.errorBox}>{error}</div>}

              <form onSubmit={handleSubmit} style={s.form}>

                {/* NAME */}
                <div style={s.field}>
                  <label style={s.label}>{es ? 'Tu Nombre' : 'Your Name'} <span style={s.req}>*</span></label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder={es ? 'Primer nombre' : 'First name'} style={s.input} required />
                </div>

                {/* EMAIL */}
                <div style={s.field}>
                  <label style={s.label}>{es ? 'Correo Electrónico' : 'Email Address'} <span style={s.req}>*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com" style={s.input} required />
                </div>

                {/* PASSWORD */}
                <div style={s.field}>
                  <label style={s.label}>{es ? 'Crear Contraseña' : 'Create a Password'} <span style={s.req}>*</span></label>
                  <div style={s.passwordWrap}>
                    <input name="password" type={showPassword ? 'text' : 'password'}
                      value={form.password} onChange={handleChange}
                      placeholder={es ? 'Mínimo 8 caracteres' : 'At least 8 characters'}
                      style={{...s.input, paddingRight:'48px'}} required />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} style={s.eyeBtn}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}>
                      {showPassword ? '🙈' : '👁️'}
                    </button>
                  </div>
                </div>

                {/* STATE */}
                <div style={s.field}>
                  <label style={s.label}>{es ? 'Tu Estado' : 'Your State'} <span style={s.req}>*</span></label>
                  <select name="state" value={form.state} onChange={handleChange} style={s.select} required>
                    <option value="">{es ? 'Selecciona tu estado' : 'Select your state'}</option>
                    {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                {/* LANGUAGE PREFERENCE */}
                <div style={s.field}>
                  <label style={s.label}>{es ? 'Preferencia de Idioma' : 'Language Preference'}</label>
                  <div style={s.langPrefRow}>
                    <label style={s.radioLabel}>
                      <input type="radio" name="langPref" value="en"
                        checked={form.langPref === 'en'}
                        onChange={handleChange} style={s.radio} />
                      English
                    </label>
                    <label style={s.radioLabel}>
                      <input type="radio" name="langPref" value="es"
                        checked={form.langPref === 'es'}
                        onChange={handleChange} style={s.radio} />
                      Español
                    </label>
                  </div>
                  <p style={s.fieldNote}>
                    {es
                      ? 'Los correos electrónicos automáticos se enviarán en tu idioma preferido.'
                      : 'Automated emails will be sent in your preferred language.'}
                  </p>
                </div>

                {/* CHILD AGE */}
                <div style={s.field}>
                  <label style={s.label}>
                    {es ? 'Edad de tu Hijo' : "Child's Age"} <span style={s.opt}>({es ? 'opcional' : 'optional'})</span>
                  </label>
                  <input name="childAge" type="number" min="0" max="26" value={form.childAge}
                    onChange={handleChange} placeholder={es ? 'Edad' : 'Age'}
                    style={{...s.input, maxWidth:'120px'}} />
                </div>

                {/* DIAGNOSIS */}
                <div style={s.field}>
                  <label style={s.label}>
                    {es ? 'Diagnóstico Principal' : 'Primary Diagnosis'} <span style={s.opt}>({es ? 'opcional' : 'optional'})</span>
                  </label>
                  <select name="diagnosis" value={form.diagnosis} onChange={handleChange} style={s.select}>
                    <option value="">{es ? 'Selecciona si deseas' : "Select if you'd like"}</option>
                    {diagnoses.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  {/* OTHER TEXT FIELD */}
                  {(form.diagnosis === 'Other' || form.diagnosis === 'Otro') && (
                    <input name="diagnosisOther" type="text" value={form.diagnosisOther}
                      onChange={handleChange}
                      placeholder={es ? 'Por favor especifica...' : 'Please specify...'}
                      style={{...s.input, marginTop:'8px'}} />
                  )}
                  <p style={s.fieldNote}>
                    {es
                      ? 'Esto nos ayuda a personalizar las respuestas de Ada para la situación específica de tu hijo.'
                      : "This helps us personalize Ada's answers for your child's specific situation."}
                  </p>
                </div>

                <button type="submit" disabled={loading} style={s.submitBtn}>
                  {loading
                    ? (es ? 'Creando tu cuenta...' : 'Creating your account...')
                    : (es ? 'Crear Mi Cuenta Gratuita →' : 'Create My Free Account →')}
                </button>

                <p style={s.fine}>
                  {es ? 'Al crear una cuenta aceptas nuestros ' : 'By creating an account you agree to our '}
                  <Link href="/terms" style={s.fineLink}>{es ? 'Términos de Servicio' : 'Terms of Service'}</Link>
                  {es ? ' y ' : ' and '}
                  <Link href="/privacy" style={s.fineLink}>{es ? 'Política de Privacidad' : 'Privacy Policy'}</Link>.
                  {es ? ' Sin spam. Cancela cuando quieras.' : ' No spam. Unsubscribe anytime.'}
                </p>
              </form>

              <div style={s.divider} />

              <div style={s.upgradeSection}>
                <p style={s.upgradeText}>
                  {es ? '¿Quieres acceso ilimitado a Ada?' : 'Want unlimited access to Ada?'}
                </p>
                <Link href="/signup" style={s.upgradeBtn}>
                  {es ? 'Obtener Ada Sin Límites — $4.99/mes' : 'Get Ada Unlimited — $4.99/month'}
                </Link>
              </div>
            </>
          ) : (
            <div style={s.successWrap}>
              <div style={s.successIcon}>✅</div>
              <h2 style={s.successTitle}>
                {es ? '¡Bienvenido a IEP Approved!' : 'Welcome to IEP Approved!'}
              </h2>
              <p style={s.successText}>
                {es
                  ? 'Tu cuenta gratuita está lista. Tienes 10 preguntas este mes. Revisa tu correo electrónico para un mensaje de bienvenida de Kimberly.'
                  : 'Your free account is ready. You have 10 questions this month. Check your inbox for a welcome message from Kimberly.'}
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}

const s = {
  page: { minHeight: '100vh', backgroundColor: '#0f0a1a', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '40px 16px', fontFamily: 'Outfit, sans-serif' },
  card: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '16px', padding: '36px 32px', width: '100%', maxWidth: '520px' },
  header: { marginBottom: '24px', textAlign: 'center' },
  title: { color: '#e8e0f0', fontSize: '26px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 8px' },
  subtitle: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.5', margin: 0 },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#e8e0f0', fontSize: '14px', fontWeight: '600' },
  req: { color: '#D4A843' },
  opt: { color: '#b8a8d0', fontWeight: '400', fontSize: '12px' },
  input: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '11px 14px', fontFamily: 'Outfit, sans-serif', outline: 'none', width: '100%' },
  passwordWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  eyeBtn: { position: 'absolute', right: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', padding: '4px', lineHeight: 1 },
  select: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '11px 14px', fontFamily: 'Outfit, sans-serif', outline: 'none', width: '100%' },
  langPrefRow: { display: 'flex', gap: '24px' },
  radioLabel: { display: 'flex', alignItems: 'center', gap: '8px', color: '#e8e0f0', fontSize: '15px', cursor: 'pointer' },
  radio: { accentColor: '#D4A843', width: '16px', height: '16px' },
  fieldNote: { color: '#b8a8d0', fontSize: '12px', margin: '4px 0 0', lineHeight: '1.4' },
  submitBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '10px', padding: '15px 24px', fontSize: '16px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', cursor: 'pointer', marginTop: '4px' },
  fine: { color: 'rgba(184,168,208,0.5)', fontSize: '12px', textAlign: 'center', lineHeight: '1.5', margin: 0 },
  fineLink: { color: 'rgba(212,168,67,0.7)', textDecoration: 'none' },
  divider: { height: '1px', backgroundColor: 'rgba(255,255,255,0.08)', margin: '24px 0' },
  upgradeSection: { textAlign: 'center' },
  upgradeText: { color: '#b8a8d0', fontSize: '14px', margin: '0 0 12px' },
  upgradeBtn: { display: 'inline-block', backgroundColor: 'transparent', border: '2px solid #D4A843', color: '#D4A843', padding: '12px 20px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '700' },
  successWrap: { textAlign: 'center', padding: '20px 0' },
  successIcon: { fontSize: '56px', marginBottom: '16px' },
  successTitle: { color: '#D4A843', fontSize: '26px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 12px' },
  successText: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.6', margin: 0 },
};
