// pages/storefront.js — Coming Soon placeholder
import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';
import { useState } from 'react';

export default function StorefrontPage() {
  const { lang } = useLanguage();
  const es = lang === 'es';
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'storefront', lang }),
      });
      setSubmitted(true);
    } catch (err) { console.error(err); }
  };

  const comingItems = [
    { title: es ? 'Listas de Verificación de Reuniones del IEP' : 'IEP Meeting Preparation Checklists', desc: es ? 'Listas detalladas para cada tipo de reunión del IEP.' : 'Detailed checklists for every type of IEP meeting.' },
    { title: es ? 'Plantillas de Cartas' : 'Letter Templates', desc: es ? 'Plantillas de rellena el espacio en blanco para comunicarse con la escuela.' : 'Fill-in-the-blank templates to communicate with your school.' },
    { title: es ? 'Guía de Terminología del IEP' : 'IEP Terminology Guide', desc: es ? 'Cada término del IEP explicado en lenguaje sencillo.' : 'Every IEP term explained in plain language.' },
    { title: es ? 'Guía de Ley Federal' : 'Federal Law Plain Language Guide', desc: es ? 'IDEA, ADA y la Sección 504 — explicados para familias.' : 'IDEA, ADA, and Section 504 — explained for families.' },
    { title: es ? 'Libros de Colorear de Robbie' : "Robbie's Coloring Books", desc: es ? 'Libros de colorear interactivos para padres e hijos.' : 'Interactive coloring books for parents and children to share.' },
    { title: es ? 'Paquetes de Guías en PDF' : 'PDF Guide Bundles', desc: es ? 'Paquetes de recursos a precios especiales.' : 'Resource bundles at special bundle pricing.' },
  ];

  return (
    <>
      <Head>
        <title>{es ? 'Centro de Recursos IEP Approved' : 'IEP Approved Resource Center'}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />
      <div style={s.page}>

        <div style={s.hero}>
          <p style={s.eyebrow}>{es ? 'À LA CARTE' : 'À LA CARTE'}</p>
          <h1 style={s.title}>
            {es ? 'IEP Approved' : 'IEP Approved'}
            <br />
            <span style={s.titleGold}>{es ? 'Centro de Recursos' : 'Resource Center'}</span>
          </h1>
          <p style={s.subtitle}>
            {es
              ? 'Materiales descargables, libros y guías seleccionados para familias como la tuya. Sin membresía requerida.'
              : 'Downloadable materials, books, and guides curated for families like yours. No membership required.'}
          </p>
          <div style={s.comingSoonBadge}>
            {es ? 'Próximamente' : 'Coming Soon'}
          </div>
        </div>

        {/* PREVIEW GRID */}
        <div style={s.gridSection}>
          <h2 style={s.gridTitle}>{es ? 'Lo que viene' : "What's Coming"}</h2>
          <div style={s.grid}>
            {comingItems.map((item, i) => (
              <div key={i} style={s.card}>
                <div style={s.cardIcon}>📄</div>
                <h3 style={s.cardTitle}>{item.title}</h3>
                <p style={s.cardDesc}>{item.desc}</p>
                <div style={s.cardComingSoon}>{es ? 'Próximamente' : 'Coming Soon'}</div>
              </div>
            ))}
          </div>
        </div>

        {/* EMAIL NOTIFY */}
        <div style={s.notifySection}>
          <h2 style={s.notifyTitle}>
            {es ? 'Sé el primero en saber cuándo abrimos' : 'Be the first to know when we open'}
          </h2>
          {!submitted ? (
            <form onSubmit={handleSubmit} style={s.form}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={es ? 'Tu correo electrónico' : 'Your email address'}
                style={s.input} required />
              <button type="submit" style={s.submitBtn}>
                {es ? 'Notificarme' : 'Notify Me'}
              </button>
            </form>
          ) : (
            <p style={s.successText}>
              {es ? '¡Listo! Te avisaremos cuando abramos.' : "You're on the list. We'll let you know when we open."}
            </p>
          )}
        </div>

        {/* ADA CTA */}
        <div style={s.adaCta}>
          <p style={s.adaCtaText}>
            {es ? 'Mientras tanto — Ada está lista para responder tus preguntas ahora mismo.' : 'In the meantime — Ada is ready to answer your questions right now.'}
          </p>
          <Link href="/ada" style={s.adaCtaBtn}>
            {es ? 'Habla con Ada Gratis →' : 'Talk to Ada Free →'}
          </Link>
        </div>
      </div>
      <Footer />
    </>
  );
}

const s = {
  page:{backgroundColor:'#0f0a1a',minHeight:'100vh',fontFamily:'Outfit, sans-serif'},
  hero:{maxWidth:'640px',margin:'0 auto',padding:'72px 24px 48px',textAlign:'center'},
  eyebrow:{color:'#b8a8d0',fontSize:'11px',fontWeight:'700',letterSpacing:'3px',marginBottom:'12px'},
  title:{color:'#fff',fontSize:'48px',fontFamily:'Cormorant Garamond, serif',fontWeight:'700',margin:'0 0 8px',lineHeight:'1.15'},
  titleGold:{color:'#D4A843'},
  subtitle:{color:'#b8a8d0',fontSize:'17px',lineHeight:'1.7',margin:'0 0 24px'},
  comingSoonBadge:{display:'inline-block',backgroundColor:'rgba(212,168,67,0.15)',border:'2px solid #D4A843',color:'#D4A843',padding:'8px 20px',borderRadius:'20px',fontSize:'14px',fontWeight:'800',letterSpacing:'1px'},
  gridSection:{maxWidth:'1000px',margin:'0 auto',padding:'0 24px 56px'},
  gridTitle:{color:'#e8e0f0',fontSize:'28px',fontFamily:'Cormorant Garamond, serif',fontWeight:'700',textAlign:'center',margin:'0 0 32px'},
  grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:'20px'},
  card:{backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.15)',borderRadius:'12px',padding:'28px 24px',display:'flex',flexDirection:'column',gap:'10px'},
  cardIcon:{fontSize:'28px'},
  cardTitle:{color:'#e8e0f0',fontSize:'16px',fontWeight:'700',margin:0},
  cardDesc:{color:'#b8a8d0',fontSize:'14px',lineHeight:'1.5',margin:0,flex:1},
  cardComingSoon:{color:'rgba(184,168,208,0.4)',fontSize:'12px',fontWeight:'600',letterSpacing:'1px'},
  notifySection:{backgroundColor:'#1a0f2e',padding:'56px 24px',textAlign:'center'},
  notifyTitle:{color:'#e8e0f0',fontSize:'28px',fontFamily:'Cormorant Garamond, serif',fontWeight:'700',margin:'0 0 24px'},
  form:{display:'flex',gap:'12px',maxWidth:'480px',margin:'0 auto',flexWrap:'wrap',justifyContent:'center'},
  input:{flex:1,minWidth:'220px',backgroundColor:'#0f0a1a',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',padding:'12px 16px',fontFamily:'Outfit, sans-serif',outline:'none'},
  submitBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',padding:'12px 24px',fontSize:'15px',fontWeight:'800',cursor:'pointer'},
  successText:{color:'#D4A843',fontSize:'16px',fontWeight:'600'},
  adaCta:{maxWidth:'560px',margin:'0 auto',padding:'56px 24px',textAlign:'center'},
  adaCtaText:{color:'#b8a8d0',fontSize:'17px',marginBottom:'20px'},
  adaCtaBtn:{display:'inline-block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'14px 28px',borderRadius:'10px',textDecoration:'none',fontSize:'15px',fontWeight:'800'},
};
