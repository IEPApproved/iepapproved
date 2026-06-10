// pages/organizations.js
// IEP Approved for Organizations: schools, districts, and healthcare organizations

import Head from 'next/head';
import { useState } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

export default function OrganizationsPage() {
const [form, setForm] = useState({ name: '', email: '', organization: '', role: '', size: '', message: '' });
const [submitted, setSubmitted] = useState(false);
const [sending, setSending] = useState(false);
const [error, setError] = useState(null);

const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

const handleSubmit = async () => {
if (!form.name || !form.email || !form.organization) {
setError('Please fill in your name, work email, and organization.');
return;
}
setSending(true);
setError(null);
try {
const res = await fetch('/api/org-inquiry', {
method: 'POST',
headers: { 'Content-Type': 'application/json' },
body: JSON.stringify(form),
});
if (res.ok) { setSubmitted(true); } else { setError('Something went wrong. Please try again or email info@iepapproved.com.'); }
} catch (err) {
setError('Something went wrong. Please try again or email info@iepapproved.com.');
}
setSending(false);
};

const included = [
['Ada for your staff', 'Plain-language answers on IDEA, Section 504, and the ADA — for every member of your team.'],
['All 50 states', 'State-specific procedures, agencies, and resources your team can reference with families.'],
['Professional development', 'Training resources on disability law, family partnership, and person-first practice.'],
['Family communication tools', 'Letters, meeting preparation materials, and guides your team can share.'],
['Plain-language law library', 'The federal framework explained the way families and new staff actually understand it.'],
['Multi-seat access', 'One license, your whole team — with administration tools rolling out.'],
];

return (
<>
<Head>
<title>For Organizations — IEP Approved</title>
<meta name='description' content='Disability law resources, professional development, and Ada for schools, districts, and healthcare organizations.' />
</Head>
<Nav />

<section style={s.hero}>
<div style={s.heroInner}>
<div style={s.heroBadge}>FOR SCHOOLS, DISTRICTS, AND HEALTHCARE ORGANIZATIONS</div>
<h1 style={s.headline}>Equip your team to turn rights into reality.</h1>
<p style={s.sub}>The professionals who serve children with disabilities deserve the same clarity families do. IEP Approved for Organizations brings plain-language disability law, professional development resources, and Ada to your whole team.</p>
<a href='#inquire' style={s.heroBtn}>Request pricing for your organization</a>
</div>
</section>

<section style={s.includedSection}>
<div style={s.inner}>
<p style={s.eyebrow}>WHAT IS INCLUDED</p>
<h2 style={s.sectionTitle}>Built for the people doing the work.</h2>
<div style={s.grid}>
{included.map(([title, desc], i) => (
<div key={i} style={s.card}>
<p style={s.cardTitle}>{title}</p>
<p style={s.cardDesc}>{desc}</p>
</div>
))}
</div>
<p style={s.ceNote}>Professional development resources are available now. Formal continuing education credit partnerships are in development.</p>
</div>
</section>

<section style={s.pricingSection}>
<div style={s.inner}>
<p style={s.eyebrow}>LICENSING</p>
<h2 style={s.sectionTitleLight}>Simple annual licensing.</h2>
<div style={s.priceRow}>
<div style={s.priceCard}>
<p style={s.priceTier}>EDUCATOR</p>
<p style={s.priceAmt}>$199<span style={s.priceUnit}>/yr</span></p>
<p style={s.priceDesc}>One professional. Full access to Ada, the law library, all 50 states, and professional development resources.</p>
</div>
<div style={s.priceCardGold}>
<div style={s.popBadge}>MOST POPULAR</div>
<p style={s.priceTierGold}>DISTRICT AND ORGANIZATION</p>
<p style={s.priceAmtGold}>$999<span style={s.priceUnitGold}>/yr</span></p>
<p style={s.priceDescGold}>Up to 25 team members. Everything in Educator for your whole staff, plus priority support.</p>
</div>
<div style={s.priceCard}>
<p style={s.priceTier}>ENTERPRISE</p>
<p style={s.priceAmt}>Custom</p>
<p style={s.priceDesc}>More than 25 seats, training partnerships, or multi-site organizations. We will build the right fit.</p>
</div>
</div>
</div>
</section>

<section id='inquire' style={s.formSection}>
<div style={s.formInner}>
<h2 style={s.sectionTitle}>Request pricing</h2>
<p style={s.formSub}>Tell us about your organization and we will reply within one business day.</p>
{!submitted ? (
<div style={s.form}>
<input style={s.input} type='text' placeholder='Your name' value={form.name} onChange={update('name')} />
<input style={s.input} type='email' placeholder='Work email' value={form.email} onChange={update('email')} />
<input style={s.input} type='text' placeholder='Organization name' value={form.organization} onChange={update('organization')} />
<input style={s.input} type='text' placeholder='Your role' value={form.role} onChange={update('role')} />
<select style={s.input} value={form.size} onChange={update('size')}>
<option value=''>Organization size</option>
<option value='1-10'>1-10 people</option>
<option value='11-25'>11-25 people</option>
<option value='26-100'>26-100 people</option>
<option value='100+'>More than 100 people</option>
</select>
<textarea style={{...s.input, minHeight: '100px', resize: 'vertical'}} placeholder='What would help your team most?' value={form.message} onChange={update('message')} />
{error && <p style={s.error}>{error}</p>}
<button style={{...s.submitBtn, opacity: sending ? 0.7 : 1}} onClick={handleSubmit} disabled={sending}>
{sending ? 'Sending...' : 'Send inquiry'}
</button>
</div>
) : (
<div style={s.success}>
<p style={s.successTitle}>Thank you — we received your inquiry.</p>
<p style={s.successSub}>Kimberly or a member of the team will reply within one business day.</p>
</div>
)}
</div>
</section>

<Footer />
<style>{'* { box-sizing: border-box; } body { margin: 0; }'}</style>
</>
);
}

const s = {
hero:{backgroundColor:'#2D1B4E',padding:'88px 24px',textAlign:'center'},
heroInner:{maxWidth:'760px',margin:'0 auto'},
heroBadge:{display:'inline-block',backgroundColor:'rgba(212,168,67,0.15)',border:'1px solid rgba(212,168,67,0.4)',color:'#D4A843',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',marginBottom:'20px'},
headline:{color:'#ffffff',fontSize:'44px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',lineHeight:'1.2',margin:'0 0 18px'},
sub:{color:'#b8a8d0',fontSize:'17px',lineHeight:'1.7',margin:'0 0 28px',fontFamily:'Outfit,sans-serif'},
heroBtn:{display:'inline-block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'800',fontFamily:'Outfit,sans-serif'},
inner:{maxWidth:'1100px',margin:'0 auto',padding:'0 24px'},
eyebrow:{color:'#D4A843',fontSize:'11px',fontWeight:'700',letterSpacing:'3px',fontFamily:'Outfit,sans-serif',marginBottom:'12px'},
includedSection:{backgroundColor:'#f5f3ff',padding:'72px 0'},
sectionTitle:{color:'#2D1B4E',fontSize:'34px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 32px'},
sectionTitleLight:{color:'#ffffff',fontSize:'34px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 32px'},
grid:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'18px'},
card:{backgroundColor:'#ffffff',border:'1px solid rgba(45,27,78,0.1)',borderRadius:'12px',padding:'22px',boxShadow:'0 2px 12px rgba(0,0,0,0.05)'},
cardTitle:{color:'#2D1B4E',fontSize:'17px',fontWeight:'700',fontFamily:'Cormorant Garamond,serif',margin:'0 0 8px'},
cardDesc:{color:'#6b7280',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',margin:0},
ceNote:{color:'#7A6E8E',fontSize:'13px',fontFamily:'Outfit,sans-serif',marginTop:'24px',fontStyle:'italic'},
pricingSection:{backgroundColor:'#1a0f2e',padding:'72px 0'},
priceRow:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(260px,1fr))',gap:'20px',alignItems:'start'},
priceCard:{backgroundColor:'rgba(255,255,255,0.04)',border:'1px solid rgba(212,168,67,0.25)',borderRadius:'14px',padding:'28px'},
priceCardGold:{backgroundColor:'#D4A843',borderRadius:'14px',padding:'30px 28px',boxShadow:'0 16px 48px rgba(212,168,67,0.25)'},
popBadge:{display:'inline-block',backgroundColor:'#2D1B4E',color:'#D4A843',padding:'4px 12px',borderRadius:'20px',fontSize:'10px',fontWeight:'800',letterSpacing:'1px',fontFamily:'Outfit,sans-serif',marginBottom:'10px'},
priceTier:{color:'#b8a8d0',fontSize:'12px',fontWeight:'700',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',margin:'0 0 8px'},
priceTierGold:{color:'#2D1B4E',fontSize:'12px',fontWeight:'800',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',margin:'0 0 8px'},
priceAmt:{color:'#ffffff',fontSize:'40px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 10px'},
priceAmtGold:{color:'#2D1B4E',fontSize:'40px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 10px'},
priceUnit:{color:'#b8a8d0',fontSize:'15px',fontFamily:'Outfit,sans-serif'},
priceUnitGold:{color:'rgba(45,27,78,0.7)',fontSize:'15px',fontFamily:'Outfit,sans-serif'},
priceDesc:{color:'#b8a8d0',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',margin:0},
priceDescGold:{color:'#2D1B4E',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',margin:0},
formSection:{backgroundColor:'#ffffff',padding:'72px 0'},
formInner:{maxWidth:'560px',margin:'0 auto',padding:'0 24px'},
formSub:{color:'#6b7280',fontSize:'15px',fontFamily:'Outfit,sans-serif',margin:'-16px 0 28px'},
form:{display:'flex',flexDirection:'column',gap:'12px'},
input:{width:'100%',padding:'13px 14px',border:'1.5px solid #E8E2F5',borderRadius:'10px',fontSize:'14px',fontFamily:'Outfit,sans-serif',color:'#1A1026',backgroundColor:'#F9F8FC',outline:'none'},
error:{background:'#FEF2F2',border:'1px solid #FECACA',borderRadius:'8px',padding:'10px 14px',fontSize:'13px',color:'#DC2626',margin:0},
submitBtn:{width:'100%',backgroundColor:'#2D1B4E',color:'#ffffff',border:'none',borderRadius:'10px',padding:'15px',fontSize:'15px',fontWeight:'700',cursor:'pointer',fontFamily:'Outfit,sans-serif'},
success:{backgroundColor:'#f5f3ff',border:'1px solid rgba(45,27,78,0.15)',borderRadius:'14px',padding:'32px',textAlign:'center'},
successTitle:{color:'#2D1B4E',fontSize:'19px',fontWeight:'700',fontFamily:'Cormorant Garamond,serif',margin:'0 0 8px'},
successSub:{color:'#6b7280',fontSize:'14px',fontFamily:'Outfit,sans-serif',margin:0},
};
