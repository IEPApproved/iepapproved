// pages/intake.js
// Free account creation — shown after hitting 5 question limit and entering email
// Collects: name, password, state, child's diagnosis

import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

const US_STATES = ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Carolina','North Dakota','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'];

const DIAGNOSES = ['Autism Spectrum Disorder (ASD)','Attention Deficit Hyperactivity Disorder (ADHD)','Down Syndrome','Cerebral Palsy','Dyslexia / Reading Disability','Intellectual Disability','Speech or Language Impairment','Emotional Disturbance','Traumatic Brain Injury (TBI)','Visual Impairment','Hearing Impairment / Deafness','Orthopedic Impairment','Other Health Impairment','Developmental Delay','Multiple Disabilities','Other / Prefer not to say'];

export default function IntakePage() {
  const router = useRouter();
  const { email: emailParam } = router.query;

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    state: '',
    childAge: '',
    diagnosis: '',
  });
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
      setError('Please fill in all required fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      // Save to localStorage for now (Supabase auth coming Phase 2)
      localStorage.setItem('iep_user_tier', 'free');
      localStorage.setItem('iep_question_count', '0');
      localStorage.setItem('iep_user_name', form.name);
      localStorage.setItem('iep_user_email', form.email);
      localStorage.setItem('iep_user_state', form.state);

      // Send welcome email
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          source: 'intake',
        }),
      });

      setSubmitted(true);
      setTimeout(() => router.push('/ada'), 2500);
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Your Free Account — IEP Approved</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <div style={styles.page}>
        {/* LOGO */}
        <Link href="/" style={styles.logoLink}>
          <img src="/images/logo.png" alt="IEP Approved" style={styles.logo}
            onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }} />
          <span style={{display:'none', color:'#D4A843', fontSize:'20px', fontWeight:'800', fontFamily:'Cormorant Garamond,serif'}}>IEP APPROVED</span>
        </Link>

        <div style={styles.card}>
          {!submitted ? (
            <>
              <div style={styles.header}>
                <h1 style={styles.title}>Create Your Free Account</h1>
                <p style={styles.subtitle}>
                  Get <strong style={{color:'#D4A843'}}>10 free questions per month</strong> — no credit card needed.
                </p>
              </div>

              {error && <div style={styles.errorBox}>{error}</div>}

              <form onSubmit={handleSubmit} style={styles.form}>
                {/* NAME */}
                <div style={styles.field}>
                  <label style={styles.label}>Your Name <span style={styles.req}>*</span></label>
                  <input name="name" type="text" value={form.name} onChange={handleChange}
                    placeholder="First name" style={styles.input} required />
                </div>

                {/* EMAIL */}
                <div style={styles.field}>
                  <label style={styles.label}>Email Address <span style={styles.req}>*</span></label>
                  <input name="email" type="email" value={form.email} onChange={handleChange}
                    placeholder="you@email.com" style={styles.input} required />
                </div>

                {/* PASSWORD */}
                <div style={styles.field}>
                  <label style={styles.label}>Create a Password <span style={styles.req}>*</span></label>
                  <input name="password" type="password" value={form.password} onChange={handleChange}
                    placeholder="At least 8 characters" style={styles.input} required />
                </div>

                {/* STATE */}
                <div style={styles.field}>
                  <label style={styles.label}>Your State <span style={styles.req}>*</span></label>
                  <select name="state" value={form.state} onChange={handleChange} style={styles.select} required>
                    <option value="">Select your state</option>
                    {US_STATES.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>

                {/* CHILD AGE */}
                <div style={styles.field}>
                  <label style={styles.label}>Child's Age <span style={styles.opt}>(optional)</span></label>
                  <input name="childAge" type="number" min="0" max="26" value={form.childAge} onChange={handleChange}
                    placeholder="Age" style={{...styles.input, maxWidth:'120px'}} />
                </div>

                {/* DIAGNOSIS */}
                <div style={styles.field}>
                  <label style={styles.label}>Primary Diagnosis <span style={styles.opt}>(optional)</span></label>
                  <select name="diagnosis" value={form.diagnosis} onChange={handleChange} style={styles.select}>
                    <option value="">Select if you'd like</option>
                    {DIAGNOSES.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <p style={styles.fieldNote}>This helps us personalize Ada's answers for your child's specific situation.</p>
                </div>

                <button type="submit" disabled={loading} style={styles.submitBtn}>
                  {loading ? 'Creating your account...' : 'Create My Free Account →'}
                </button>

                <p style={styles.fine}>
                  By creating an account you agree to our{' '}
                  <Link href="/terms" style={styles.fineLink}>Terms of Service</Link> and{' '}
                  <Link href="/privacy" style={styles.fineLink}>Privacy Policy</Link>.
                  No spam. Unsubscribe anytime.
                </p>
              </form>

              <div style={styles.divider} />

              <div style={styles.upgradeSection}>
                <p style={styles.upgradeText}>Want unlimited access to Ada?</p>
                <Link href="/signup" style={styles.upgradeBtn}>
                  ⭐ Get Ada Unlimited — $4.99/month
                </Link>
              </div>
            </>
          ) : (
            <div style={styles.successWrap}>
              <div style={styles.successIcon}>✅</div>
              <h2 style={styles.successTitle}>Welcome to IEP Approved!</h2>
              <p style={styles.successText}>
                Your free account is ready. You have <strong style={{color:'#D4A843'}}>10 questions this month</strong>.
                Taking you back to Ada now...
              </p>
            </div>
          )}
        </div>

        <p style={styles.footer}>
          © 2026 IEP Approved LLC · Ada is an AI assistant, not an attorney.
        </p>
      </div>
    </>
  );
}

const styles = {
  page:{minHeight:'100vh',backgroundColor:'#0f0a1a',display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 16px 40px',fontFamily:'Outfit,sans-serif'},
  logoLink:{textDecoration:'none',marginBottom:'24px'},
  logo:{height:'48px',width:'auto',objectFit:'contain'},
  card:{backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'16px',padding:'36px 32px',width:'100%',maxWidth:'520px'},
  header:{marginBottom:'24px',textAlign:'center'},
  title:{color:'#e8e0f0',fontSize:'26px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 8px'},
  subtitle:{color:'#b8a8d0',fontSize:'15px',lineHeight:'1.5',margin:0},
  errorBox:{backgroundColor:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.3)',color:'#ef4444',padding:'12px 14px',borderRadius:'8px',fontSize:'14px',marginBottom:'16px'},
  form:{display:'flex',flexDirection:'column',gap:'18px'},
  field:{display:'flex',flexDirection:'column',gap:'6px'},
  label:{color:'#e8e0f0',fontSize:'14px',fontWeight:'600'},
  req:{color:'#D4A843'},
  opt:{color:'#b8a8d0',fontWeight:'400',fontSize:'12px'},
  input:{backgroundColor:'#0f0a1a',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',padding:'11px 14px',fontFamily:'Outfit,sans-serif',outline:'none',width:'100%'},
  select:{backgroundColor:'#0f0a1a',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',padding:'11px 14px',fontFamily:'Outfit,sans-serif',outline:'none',width:'100%'},
  fieldNote:{color:'#b8a8d0',fontSize:'12px',margin:'4px 0 0',lineHeight:'1.4'},
  submitBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'10px',padding:'15px 24px',fontSize:'16px',fontWeight:'800',fontFamily:'Outfit,sans-serif',cursor:'pointer',marginTop:'4px'},
  fine:{color:'rgba(184,168,208,0.5)',fontSize:'12px',textAlign:'center',lineHeight:'1.5',margin:0},
  fineLink:{color:'rgba(212,168,67,0.7)',textDecoration:'none'},
  divider:{height:'1px',backgroundColor:'rgba(255,255,255,0.08)',margin:'24px 0'},
  upgradeSection:{textAlign:'center'},
  upgradeText:{color:'#b8a8d0',fontSize:'14px',margin:'0 0 12px'},
  upgradeBtn:{display:'inline-block',backgroundColor:'transparent',border:'2px solid #D4A843',color:'#D4A843',padding:'12px 20px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'700'},
  successWrap:{textAlign:'center',padding:'20px 0'},
  successIcon:{fontSize:'56px',marginBottom:'16px'},
  successTitle:{color:'#D4A843',fontSize:'26px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 12px'},
  successText:{color:'#b8a8d0',fontSize:'15px',lineHeight:'1.6',margin:0},
  footer:{color:'rgba(184,168,208,0.3)',fontSize:'11px',marginTop:'24px',textAlign:'center'},
};
