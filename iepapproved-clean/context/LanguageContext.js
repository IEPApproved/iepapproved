// context/LanguageContext.js
// Global EN | ES language toggle for IEP Approved
// Import this in _app.js to wrap the entire site

import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // NAV
    nav_home: 'Home',
    nav_howItWorks: 'How It Works',
    nav_storefront: 'Storefront',
    nav_community: 'Community',
    nav_contact: 'Contact',
    nav_askAda: 'Ask Ada Free',

    // HERO
    hero_tagline: 'Knowledge is power. Partnership is progress. Together — the IEP gets APPROVED.',
    hero_sub: 'AI-assisted IEP legal information for every family — free to start.',
    hero_cta: 'Ask Ada Free',

    // HOW IT WORKS
    how_title: 'How It Works',
    how_card1_title: 'Ask Ada Anything',
    how_card1_desc: 'Type or speak your question. Ada answers with federal law citations — plain language, not legal jargon.',
    how_card1_cta: 'Click to Try',
    how_card2_title: 'Get the Law, Not Just an Opinion',
    how_card2_desc: 'Ada cites IDEA, Section 504, and ADA directly. Real law. Real rights. Not just someone\'s interpretation.',
    how_card2_cta: 'Click to Try',
    how_card3_title: 'Advocate with Confidence',
    how_card3_desc: 'Prepare letters, understand your options, and know the difference between yes and no — before you walk into that room.',
    how_card3_cta: 'Click to Try',

    // MEET ADA
    ada_title: 'Meet Ada',
    ada_subtitle: 'Your IEP Approved AI Guide',
    ada_desc: 'Ada is your AI-powered IEP law guide — available 24/7, bilingual, and built to help every family understand their rights.',
    ada_disclaimer: 'Ada is not an attorney. IEP Approved does not provide legal services. Ada is intuitive and will tell you when you need one.',
    ada_espanol: 'Español',
    ada_feature1: 'Federal Law Citations',
    ada_feature2: 'English & Español',
    ada_feature3: 'Voice Input & Playback',
    ada_feature4: 'Available 24/7',

    // PRICING
    pricing_title: 'Find Your Level of Support',
    pricing_free_name: 'Free',
    pricing_free_desc: 'Always free to start. Ask Ada 5 questions today, no signup needed. Join our community and ask up to 10 questions per month — free forever.',
    pricing_free_cta: 'Start Free',
    pricing_unlimited_name: 'Ada Unlimited',
    pricing_unlimited_badge: 'Most Popular',
    pricing_unlimited_price: '$4.99/month',
    pricing_unlimited_desc: 'Unlimited access to Ada for less than a cup of coffee. $4.99/month was designed intentionally — because every family deserves access to the law, not just those who can afford an attorney.',
    pricing_unlimited_cta: 'Get Ada Unlimited',
    pricing_pro_name: 'IEP Pro',
    pricing_pro_price: '$9.99/month',
    pricing_pro_cta: 'Coming Soon',
    pricing_advocate_name: 'Advocate+',
    pricing_advocate_price: '$24.99/month',
    pricing_advocate_cta: 'Coming Soon',

    // OUR STORY
    story_title: 'Our Story',
    story_closing: 'IEP Approved was developed with the mindset that communication and collaboration are at the core of everything we do when advocating for our children. Knowledge is power — and knowing the law gives you the confidence to walk into any room and advocate for your child\'s future. That is why IEP Approved exists. Not to teach parents to fight. But to give every family the knowledge to partner, advocate, and win.',

    // STAY INFORMED
    email_title: 'Stay Informed',
    email_desc: 'Get IEP law updates, advocacy tips, and Ada news delivered to your inbox.',
    email_placeholder: 'Your email address',
    email_cta: 'Join the Community',
    email_fine: 'No spam. Unsubscribe anytime. Your privacy is protected.',

    // FOOTER
    footer_tagline: 'Knowledge is power. Partnership is progress. Together — the IEP gets APPROVED.',
    footer_company: 'Company',
    footer_legal: 'Legal',
    footer_contact: 'Contact',
    footer_terms: 'Terms of Service',
    footer_privacy: 'Privacy Policy',
    footer_disclaimer: 'Disclaimer',
    footer_ai_disclosure: 'Ada is an AI assistant, not a human attorney. IEP Approved provides legal information for educational purposes only and does not constitute an attorney-client relationship. Ada is powered by artificial intelligence.',
    footer_copyright: '© 2026 IEP Approved LLC. All rights reserved.',

    // ADA PAGE
    ada_page_greeting: 'Hello! I\'m Ada, your IEP law guide. Ask me anything about your child\'s rights under IDEA, Section 504, or ADA — in English or Spanish.',
    ada_mic_english: 'Speak to Ask Ada',
    ada_mic_spanish: 'Habla con Ada',
    ada_repeat: '▶ Repeat',
    ada_thinking: 'Thinking...',
    ada_speaking: 'Speaking...',
    ada_online: 'Online',
    ada_input_placeholder: 'Ask Ada a question...',
    ada_send: 'Send',
    ada_limit_title: 'You\'ve reached your free limit',
    ada_limit_primary: 'Get Ada Unlimited — $4.99/month',
    ada_limit_secondary: 'Sign up free for 10 questions/month',
  },

  es: {
    // NAV
    nav_home: 'Inicio',
    nav_howItWorks: 'Cómo Funciona',
    nav_storefront: 'Tienda',
    nav_community: 'Comunidad',
    nav_contact: 'Contacto',
    nav_askAda: 'Pregunta a Ada Gratis',

    // HERO
    hero_tagline: 'El conocimiento es poder. La colaboración es progreso. Juntos — el IEP se APRUEBA.',
    hero_sub: 'Información legal sobre el IEP con inteligencia artificial para cada familia — gratis para comenzar.',
    hero_cta: 'Pregunta a Ada Gratis',

    // HOW IT WORKS
    how_title: 'Cómo Funciona',
    how_card1_title: 'Pregúntale a Ada Lo Que Sea',
    how_card1_desc: 'Escribe o habla tu pregunta. Ada responde con citas de la ley federal — en lenguaje sencillo, no jerga legal.',
    how_card1_cta: 'Haz Clic para Intentar',
    how_card2_title: 'Obtén la Ley, No Solo una Opinión',
    how_card2_desc: 'Ada cita IDEA, la Sección 504 y la ADA directamente. Ley real. Derechos reales. No solo la interpretación de alguien.',
    how_card2_cta: 'Haz Clic para Intentar',
    how_card3_title: 'Aboga con Confianza',
    how_card3_desc: 'Prepara cartas, entiende tus opciones y conoce la diferencia entre sí y no — antes de entrar a esa sala.',
    how_card3_cta: 'Haz Clic para Intentar',

    // MEET ADA
    ada_title: 'Conoce a Ada',
    ada_subtitle: 'Tu Guía de IA de IEP Approved',
    ada_desc: 'Ada es tu guía de leyes del IEP impulsada por IA — disponible las 24 horas, bilingüe, y diseñada para ayudar a cada familia a entender sus derechos.',
    ada_disclaimer: 'Ada no es abogada. IEP Approved no proporciona servicios legales. Ada es intuitiva y te dirá cuándo necesitas uno.',
    ada_espanol: 'Español',
    ada_feature1: 'Citas de Ley Federal',
    ada_feature2: 'English y Español',
    ada_feature3: 'Entrada de Voz y Reproducción',
    ada_feature4: 'Disponible las 24 horas',

    // PRICING
    pricing_title: 'Encuentra Tu Nivel de Apoyo',
    pricing_free_name: 'Gratis',
    pricing_free_desc: 'Siempre gratis para comenzar. Hazle 5 preguntas a Ada hoy, sin necesidad de registrarte. Únete a nuestra comunidad y haz hasta 10 preguntas al mes — gratis para siempre.',
    pricing_free_cta: 'Comenzar Gratis',
    pricing_unlimited_name: 'Ada Sin Límites',
    pricing_unlimited_badge: 'Más Popular',
    pricing_unlimited_price: '$4.99/mes',
    pricing_unlimited_desc: 'Acceso ilimitado a Ada por menos de una taza de café. $4.99 al mes fue diseñado intencionalmente — porque cada familia merece acceso a la ley, no solo quienes pueden pagar un abogado.',
    pricing_unlimited_cta: 'Obtener Ada Sin Límites',
    pricing_pro_name: 'IEP Pro',
    pricing_pro_price: '$9.99/mes',
    pricing_pro_cta: 'Próximamente',
    pricing_advocate_name: 'Advocate+',
    pricing_advocate_price: '$24.99/mes',
    pricing_advocate_cta: 'Próximamente',

    // OUR STORY
    story_title: 'Nuestra Historia',
    story_closing: 'IEP Approved fue desarrollado con la mentalidad de que la comunicación y la colaboración son el núcleo de todo lo que hacemos al abogar por nuestros hijos. El conocimiento es poder — y conocer la ley te da la confianza para entrar a cualquier sala y abogar por el futuro de tu hijo. Por eso existe IEP Approved. No para enseñar a los padres a pelear. Sino para darle a cada familia el conocimiento para asociarse, abogar y ganar.',

    // STAY INFORMED
    email_title: 'Mantente Informado',
    email_desc: 'Recibe actualizaciones de la ley del IEP, consejos de defensa y noticias de Ada en tu bandeja de entrada.',
    email_placeholder: 'Tu correo electrónico',
    email_cta: 'Únete a la Comunidad',
    email_fine: 'Sin spam. Cancela la suscripción en cualquier momento. Tu privacidad está protegida.',

    // FOOTER
    footer_tagline: 'El conocimiento es poder. La colaboración es progreso. Juntos — el IEP se APRUEBA.',
    footer_company: 'Empresa',
    footer_legal: 'Legal',
    footer_contact: 'Contacto',
    footer_terms: 'Términos de Servicio',
    footer_privacy: 'Política de Privacidad',
    footer_disclaimer: 'Descargo de Responsabilidad',
    footer_ai_disclosure: 'Ada es una asistente de IA, no una abogada humana. IEP Approved proporciona información legal solo con fines educativos y no constituye una relación abogado-cliente. Ada funciona con inteligencia artificial.',
    footer_copyright: '© 2026 IEP Approved LLC. Todos los derechos reservados.',

    // ADA PAGE
    ada_page_greeting: '¡Hola! Soy Ada, tu guía de leyes del IEP. Pregúntame cualquier cosa sobre los derechos de tu hijo bajo IDEA, la Sección 504 o la ADA — en inglés o español.',
    ada_mic_english: 'Speak to Ask Ada',
    ada_mic_spanish: 'Habla con Ada',
    ada_repeat: '▶ Repetir',
    ada_thinking: 'Pensando...',
    ada_speaking: 'Hablando...',
    ada_online: 'En línea',
    ada_input_placeholder: 'Hazle una pregunta a Ada...',
    ada_send: 'Enviar',
    ada_limit_title: 'Has alcanzado tu límite gratuito',
    ada_limit_primary: 'Obtener Ada Sin Límites — $4.99/mes',
    ada_limit_secondary: 'Regístrate gratis por 10 preguntas/mes',
  }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en');

  // Persist language preference
  useEffect(() => {
    const saved = localStorage.getItem('iep_lang');
    if (saved === 'en' || saved === 'es') setLang(saved);
  }, []);

  const toggleLang = () => {
    const next = lang === 'en' ? 'es' : 'en';
    setLang(next);
    localStorage.setItem('iep_lang', next);
  };

  const t = (key) => translations[lang][key] || translations['en'][key] || key;

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
