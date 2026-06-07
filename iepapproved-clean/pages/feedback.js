// pages/feedback.js
import Head from 'next/head';
import Nav from '../components/Nav';
import { useLanguage } from '../context/LanguageContext';
import { useState, useEffect } from 'react';

// Static approved testimonials — add real ones here as they come in
const APPROVED_TESTIMONIALS = [
  {
    name: 'Maria T.',
    state: 'Florida',
    stars: 5,
    text: 'Ada helped me understand my son\'s rights in minutes. I walked into his IEP meeting feeling confident for the first time.',
  },
  {
    name: 'James R.',
    state: 'Texas',
    stars: 5,
    text: 'I had no idea the school was violating IDEA. Ada cited the exact statute. We got the services fixed within two weeks.',
  },
  {
    name: 'Sandra L.',
    state: 'California',
    stars: 4,
    text: 'The Spanish support is incredible. My whole family can now understand our daughter\'s rights. Thank you IEP Approved.',
  },
];

export default function FeedbackPage() {
  const { lang } = useLanguage();
  const [form, setForm] = useState({ name: '', email: '', stars: 0, message: '' });
  const [hoverStar, setHoverStar] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.stars) { setError(lang === 'es' ? 'Por favor selecciona una calificación.' : 'Please select a star rating.'); return; }
    if (!form.message.trim()) { setError(lang === 'es' ? 'Por favor escribe tu comentario.' : 'Please write your feedback.'); return; }
    setError('');
    setLoading(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, lang }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError(lang === 'es' ? 'Algo salió mal. Por favor intenta de nuevo.' : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Share Your Feedback — IEP Approved</title>
        <meta name="description" content="Share your experience with IEP Approved and Ada. Your feedback helps other families." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Nav />

      <div style={s.page}>

        {/* HERO */}
        <div style={s.hero}>
          <p style={s.eyebrow}>{lang === 'es' ? 'TU VOZ IMPORTA' : 'YOUR VOICE MATTERS'}</p>
          <h1 style={s.title}>
            {lang === 'es' ? 'Comparte Tu Experiencia' : 'Share Your Experience'}
          </h1>
          <p style={s.subtitle}>
            {lang === 'es'
              ? 'Tu historia ayuda a otras familias a encontrar el apoyo que necesitan. Comparte cómo IEP Approved o Ada te ha ayudado.'
              : 'Your story helps other families find the support they need. Tell us how IEP Approved or Ada has helped you.'}
          </p>
        </div>

        <div style={s.layout}>

          {/* FORM */}
          <div style={s.formCard}>
            {!submitted ? (
              <>
                <h2 style={s.formTitle}>
                  {lang === 'es' ? 'Tu Comentario' : 'Your Feedback'}
                </h2>

                {error && <div style={s.errorBox}>{error}</div>}

                <form onSubmit={handleSubmit} style={s.form}>
                  <div style={s.field}>
                    <label style={s.label}>{lang === 'es' ? 'Tu Nombre' : 'Your Name'}</label>
                    <input name="name" type="text" value={form.name} onChange={handleChange}
                      placeholder={lang === 'es' ? 'Nombre (o anónimo)' : 'Name (or Anonymous)'}
                      style={s.input} />
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>{lang === 'es' ? 'Correo Electrónico' : 'Email'} <span style={s.opt}>({lang === 'es' ? 'opcional' : 'optional'})</span></label>
                    <input name="email" type="email" value={form.email} onChange={handleChange}
                      placeholder="you@email.com" style={s.input} />
                  </div>

                  {/* STAR RATING */}
                  <div style={s.field}>
                    <label style={s.label}>{lang === 'es' ? 'Tu Calificación' : 'Your Rating'}</label>
                    <div style={s.starsRow}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <button key={star} type="button"
                          onMouseEnter={() => setHoverStar(star)}
                          onMouseLeave={() => setHoverStar(0)}
                          onClick={() => setForm(prev => ({ ...prev, stars: star }))}
                          style={s.starBtn}>
                          <span style={{
                            fontSize: '32px',
                            color: star <= (hoverStar || form.stars) ? '#D4A843' : 'rgba(255,255,255,0.15)',
                            transition: 'color 0.15s',
                          }}>★</span>
                        </button>
                      ))}
                      {form.stars > 0 && (
                        <span style={s.starLabel}>
                          {['', lang==='es'?'Pobre':'Poor', lang==='es'?'Regular':'Fair', lang==='es'?'Bueno':'Good', lang==='es'?'Muy Bueno':'Great', lang==='es'?'Excelente':'Excellent'][form.stars]}
                        </span>
                      )}
                    </div>
                  </div>

                  <div style={s.field}>
                    <label style={s.label}>{lang === 'es' ? 'Tu Comentario' : 'Your Comments'}</label>
                    <textarea name="message" value={form.message} onChange={handleChange}
                      placeholder={lang === 'es'
                        ? 'Cuéntanos cómo IEP Approved o Ada te ha ayudado...'
                        : 'Tell us how IEP Approved or Ada has helped you...'}
                      style={s.textarea} rows={5} required />
                  </div>

                  {form.stars >= 4 && (
                    <div style={s.publicNote}>
                      {lang === 'es'
                        ? 'Las calificaciones de 4-5 estrellas pueden aparecer públicamente en nuestro sitio para ayudar a otras familias.'
                        : '4-5 star reviews may appear publicly on our site to help other families.'}
                    </div>
                  )}

                  <button type="submit" disabled={loading} style={s.submitBtn}>
                    {loading
                      ? (lang === 'es' ? 'Enviando...' : 'Sending...')
                      : (lang === 'es' ? 'Enviar Mi Comentario' : 'Submit My Feedback')}
                  </button>
                </form>
              </>
            ) : (
              <div style={s.successWrap}>
                <div style={s.successIcon}>★</div>
                <h2 style={s.successTitle}>
                  {lang === 'es' ? '¡Gracias por tu comentario!' : 'Thank you for your feedback!'}
                </h2>
                <p style={s.successText}>
                  {lang === 'es'
                    ? 'Tu opinión nos ayuda a mejorar y a llegar a más familias.'
                    : 'Your feedback helps us improve and reach more families.'}
                </p>
                <a href="/ada" style={s.backBtn}>
                  {lang === 'es' ? 'Volver a Ada' : 'Back to Ada'}
                </a>
              </div>
            )}
          </div>

          {/* PUBLIC TESTIMONIALS */}
          <div style={s.testimonials}>
            <h2 style={s.testimonialsTitle}>
              {lang === 'es' ? 'Lo que dicen las familias' : 'What Families Are Saying'}
            </h2>
            {APPROVED_TESTIMONIALS.map((t, i) => (
              <div key={i} style={s.testimonialCard}>
                <div style={s.testimonialStars}>
                  {'★'.repeat(t.stars)}<span style={s.emptyStars}>{'★'.repeat(5 - t.stars)}</span>
                </div>
                <p style={s.testimonialText}>"{t.text}"</p>
                <p style={s.testimonialAuthor}>{t.name} · {t.state}</p>
              </div>
            ))}
          </div>
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
  hero: { maxWidth: '640px', margin: '0 auto', padding: '64px 24px 40px', textAlign: 'center' },
  eyebrow: { color: '#D4A843', fontSize: '12px', fontWeight: '700', letterSpacing: '3px', marginBottom: '12px' },
  title: { color: '#fff', fontSize: '40px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 16px' },
  subtitle: { color: '#b8a8d0', fontSize: '17px', lineHeight: '1.7', margin: 0 },
  layout: { maxWidth: '1100px', margin: '0 auto', padding: '0 24px 64px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' },
  formCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '16px', padding: '36px 28px' },
  formTitle: { color: '#e8e0f0', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 24px' },
  errorBox: { backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', padding: '12px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
  form: { display: 'flex', flexDirection: 'column', gap: '18px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#e8e0f0', fontSize: '14px', fontWeight: '600' },
  opt: { color: '#b8a8d0', fontWeight: '400', fontSize: '12px' },
  input: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '11px 14px', fontFamily: 'Outfit, sans-serif', outline: 'none' },
  starsRow: { display: 'flex', alignItems: 'center', gap: '4px' },
  starBtn: { background: 'none', border: 'none', cursor: 'pointer', padding: '2px' },
  starLabel: { color: '#D4A843', fontSize: '14px', fontWeight: '600', marginLeft: '8px' },
  textarea: { backgroundColor: '#0f0a1a', border: '1px solid rgba(212,168,67,0.3)', borderRadius: '8px', color: '#e8e0f0', fontSize: '15px', padding: '11px 14px', fontFamily: 'Outfit, sans-serif', outline: 'none', resize: 'vertical', lineHeight: '1.5' },
  publicNote: { backgroundColor: 'rgba(212,168,67,0.08)', border: '1px solid rgba(212,168,67,0.2)', borderRadius: '8px', padding: '12px', color: '#b8a8d0', fontSize: '13px', lineHeight: '1.5' },
  submitBtn: { backgroundColor: '#D4A843', color: '#2D1B4E', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '15px', fontWeight: '800', fontFamily: 'Outfit, sans-serif', cursor: 'pointer' },
  successWrap: { textAlign: 'center', padding: '24px 0' },
  successIcon: { fontSize: '52px', color: '#D4A843', marginBottom: '16px' },
  successTitle: { color: '#D4A843', fontSize: '24px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 12px' },
  successText: { color: '#b8a8d0', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' },
  backBtn: { display: 'inline-block', backgroundColor: '#D4A843', color: '#2D1B4E', padding: '12px 24px', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '800', fontFamily: 'Outfit, sans-serif' },
  testimonials: { display: 'flex', flexDirection: 'column', gap: '16px' },
  testimonialsTitle: { color: '#e8e0f0', fontSize: '22px', fontFamily: 'Cormorant Garamond, serif', fontWeight: '700', margin: '0 0 8px' },
  testimonialCard: { backgroundColor: '#1a0f2e', border: '1px solid rgba(212,168,67,0.15)', borderRadius: '12px', padding: '24px' },
  testimonialStars: { color: '#D4A843', fontSize: '18px', marginBottom: '10px' },
  emptyStars: { color: 'rgba(255,255,255,0.1)' },
  testimonialText: { color: '#e8e0f0', fontSize: '15px', lineHeight: '1.6', margin: '0 0 12px', fontStyle: 'italic' },
  testimonialAuthor: { color: '#b8a8d0', fontSize: '13px', fontWeight: '600', margin: 0 },
  footer: { backgroundColor: '#080512', padding: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.06)' },
  footerText: { color: 'rgba(184,168,208,0.3)', fontSize: '12px', margin: 0 },
};
