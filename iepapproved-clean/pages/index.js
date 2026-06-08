// pages/index.js — IEP Approved Complete Homepage
// Final copy locked June 2026

import Head from 'next/head';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import { useLanguage } from '../context/LanguageContext';

export default function HomePage() {
  const { lang } = useLanguage();
  const [email, setEmail] = useState('');
  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [flippedCard, setFlippedCard] = useState(null);
  const [mounted, setMounted] = useState(false);
  const es = lang === 'es';

  useEffect(() => { setMounted(true); }, []);

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage', lang }),
      });
      setEmailSubmitted(true);
    } catch (err) { console.error(err); }
  };

  if (!mounted) return null;

  const cards = [
    {
      id: 1,
      front: {
        number: '01',
        title: es ? 'Pregúntale a Ada Lo Que Sea' : 'Ask Ada Anything',
        desc: es ? 'Escribe o habla tu pregunta. Ada responde con citas de la ley federal real — en lenguaje sencillo que puedes usar.' : 'Type or speak your question. Ada answers with real federal law citations — in plain language you can actually use.',
      },
      back: { visual: 'chat', cta: es ? 'Hablar con Ada' : 'Ask Ada Now', link: '/ada' },
    },
    {
      id: 2,
      front: {
        number: '02',
        title: es ? 'Eliminamos la Confusión del Derecho Federal' : 'Taking the Confusion Out of Federal Law',
        desc: es ? 'Ada cita IDEA, la Sección 504 y la ADA directamente — luego te lo explica en palabras que tienen sentido para tu familia. Ley real. Sin jerga.' : 'Ada cites IDEA, Section 504, and ADA directly — then explains it in words that make sense for your family. Real law. No jargon.',
      },
      back: { visual: 'law', cta: es ? 'Ver en Acción' : 'See It in Action', link: '/ada' },
    },
    {
      id: 3,
      front: {
        number: '03',
        title: es ? 'Tu Voz. Su Futuro. Aprobado.' : 'Your Voice. Their Future. Approved.',
        desc: es ? 'Prepara cartas, entiende tus opciones y conoce la diferencia entre sí y no — antes de entrar a esa sala.' : 'Prepare letters, understand your options, and know the difference between yes and no — before you walk into that room.',
      },
      back: { visual: 'advocate', cta: es ? 'Comenzar a Prepararse' : 'Start Preparing', link: '/ada' },
    },
  ];

  const features = [
    { title: es ? 'Cita la Ley Exacta' : 'Cites the Exact Law', desc: es ? 'Cada respuesta hace referencia al estatuto federal específico — para que sepas exactamente dónde está la ley.' : 'Every answer references the specific federal statute — so you know exactly where the law stands.' },
    { title: es ? 'Solo Pregunta — Ada Entiende' : 'Just Ask — Ada Understands', desc: es ? 'Escribe tu pregunta como le preguntarías a un amigo de confianza. Ada encontrará las respuestas que necesitas.' : "Type your question the way you'd ask a trusted friend. Ada will find the answers and resources you need." },
    { title: es ? 'Honesta Sobre Sus Límites' : 'Honest About Her Limits', desc: es ? 'Cuando necesitas un abogado real, Ada te lo dirá. Sin falsa confianza.' : 'When you need a real attorney, Ada will tell you. No false confidence.' },
    { title: es ? '¿Hablas Español? Ada También.' : '¿Hablas Español? Ada también.', desc: es ? 'Puedes escribirle a Ada en español — ella te responderá en español con la información que necesitas.' : 'You can write to Ada in Spanish — she will respond in Spanish with the information you need.' },
    { title: es ? 'Ada No es Abogada' : 'Ada Is Not an Attorney', desc: es ? 'IEP Approved no proporciona servicios legales ni asesoramiento legal. Ada es una IA intuitiva que proporciona la ley real en lenguaje claro — y te dirá cuándo necesitas un abogado.' : 'IEP Approved does not provide legal services or legal advice. Ada is an intuitive AI that provides real law in clear plain language — and will tell you when you need an attorney.' },
  ];

  const unlimitedFeatures = es ? [
    'Preguntas ilimitadas a Ada',
    'English y Español',
    'Ley federal: IDEA, ADA, Sección 504',
    'Estatutos y recursos específicos por estado',
    'Alertas y recordatorios de cambios en la ley',
    'Ada lee las respuestas en voz alta',
    'Entrada de voz en inglés y español',
    'Acceso a la comunidad — grupos locales y por estado',
    'Búsqueda de eventos y recursos comunitarios',
  ] : [
    'Unlimited questions to Ada',
    'English and Español',
    'Federal law: IDEA, ADA, Section 504',
    'State-specific statutes and resources',
    'Law change alerts and reminders',
    'Ada reads answers aloud',
    'Voice input English and Español',
    'Community access — local and state-based groups',
    'Search local events and community resources',
  ];

  const resourceItems = es ? [
    'Listas de Verificación de Reuniones del IEP',
    'Plantillas de Cartas (rellena el espacio)',
    'Guía de Terminología del IEP',
    'Guía de Ley Federal en Lenguaje Sencillo',
    'Libros de Colorear y Cuentos de Robbie',
    'Paquetes de Guías en PDF',
  ] : [
    'IEP Meeting Preparation Checklists',
    'Letter Templates (fill in the blank)',
    'IEP Terminology Guide',
    'Federal Law Plain Language Guide',
    "Robbie's Coloring Books and Story Books",
    'PDF Guide Bundles',
  ];

  const robbiePhotos = [
    { src: '/Robbie Baseball.jpg', alt: 'Robbie at Baseball' },
    { src: '/Robbie Birthday.jpg', alt: "Robbie's Birthday" },
    { src: '/Robbie Boat.jpg', alt: 'Robbie on the Boat' },
    { src: '/Robbie Brevard Zoo....jpg', alt: 'Robbie at Brevard Zoo' },
    { src: '/Robbie Marthon Key....jpg', alt: 'Robbie at Marathon Key' },
    { src: '/Robbie St. Augustin....jpg', alt: 'Robbie in St. Augustine' },
  ];

  return (
    <>
      <Head>
        <title>IEP Approved — Know the Law. Advocate with Confidence.</title>
        <meta name="description" content="Ada is your AI-powered guide to the IEP process, IDEA, ADA, and Section 504. Free to start. Bilingual. Built for every family." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Nav />

      {/* ── HERO ── */}
      <section style={s.hero}>
        <div style={s.heroInner}>
          <div style={s.heroLeft}>
            <div style={s.heroBadge}>{es ? 'PARA FAMILIAS CON NECESIDADES ESPECIALES' : 'FOR SPECIAL NEEDS FAMILIES'}</div>
            <h1 style={s.heroHeadline}>
              {es
                ? <>El conocimiento es poder. La colaboración es progreso. Juntos — el IEP se <em style={s.heroGold}>APRUEBA.</em></>
                : <>Knowledge is power. Partnership is progress. Together — the IEP gets <em style={s.heroGold}>APPROVED.</em></>
              }
            </h1>
            <p style={s.heroSub}>
              {es
                ? 'Ada es tu guía impulsada por IA para el proceso del IEP, IDEA, la ADA y la Sección 504 — brindándote respuestas en lenguaje claro respaldadas por la ley federal real, para que puedas comunicarte con confianza y colaborar con el equipo de tu hijo.'
                : 'Ada is your AI-powered guide to the IEP process, IDEA, ADA, and Section 504 — giving you plain language answers backed by real federal law, so you can communicate with confidence and collaborate with your child\'s team.'
              }
            </p>
            <div style={s.heroBtns}>
              <Link href="/ada" style={s.heroPrimary}>{es ? 'Pregunta a Ada Gratis' : 'Ask Ada Free'}</Link>
              <Link href="#support" style={s.heroSecondary}>{es ? 'Ver Cómo Te Apoyamos' : 'See How We Support You'}</Link>
            </div>
          </div>
          <div style={s.heroRight}>
            <div style={s.adaQuoteCard}>
              <div style={s.adaAvatarWrap}>
                <div style={s.adaAvatarRing}>
                  <img src="/ada-avatar.png" alt="Ada" style={s.adaAvatarImg} onError={(e) => { e.target.style.display='none'; }} />
                  <span style={s.adaAvatarInitial}>A</span>
                </div>
              </div>
              <blockquote style={s.adaQuote}>
                {es
                  ? '"El conocimiento es poder. Y conocer la ley te da la confianza para entrar a cualquier sala y abogar por el futuro de tu hijo."'
                  : '"Knowledge is power. And knowing the law gives you the confidence to walk into any room and advocate for your child\'s future."'
                }
              </blockquote>
              <p style={s.adaQuoteAttr}>— Ada, {es ? 'Tu Guía de IEP Approved' : 'Your IEP Approved Guide'}</p>
              <Link href="/ada" style={s.adaQuoteBtn}>{es ? 'Habla con Ada hoy' : 'Talk to Ada today'} →</Link>
            </div>
          </div>
        </div>
        <div style={s.statsRow}>
          <div style={s.stat}><span style={s.statNum}>7.5M</span><span style={s.statLabel}>{es ? 'niños con IEPs en los EE.UU.' : 'children with IEPs in the US'}</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><span style={s.statNum}>{es ? 'Gratis' : 'Free'}</span><span style={s.statLabel}>{es ? 'para comenzar, siempre' : 'to start, always'}</span></div>
          <div style={s.statDivider} />
          <div style={s.stat}><span style={s.statNum}>IDEA</span><span style={s.statLabel}>{es ? 'ADA y Sección 504' : 'ADA & Section 504'}</span></div>
        </div>
      </section>

      {/* ── WHAT ADA DOES FOR YOU ── */}
      <section id="how-it-works" style={s.howSection}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>{es ? 'LO QUE ADA HACE POR TI' : 'WHAT ADA DOES FOR YOU'}</p>
          <h2 style={s.sectionTitleDark}>{es ? 'De perdido a informado en minutos.' : 'From lost to informed in minutes.'}</h2>
          <p style={s.sectionSub}>{es ? 'No necesitas un título en derecho. Necesitas a Ada — y la confianza para entrar a esa reunión sabiendo tus derechos.' : "You don't need a law degree. You need Ada — and the confidence to walk into that meeting knowing your rights."}</p>
          <div style={s.cardsRow}>
            {cards.map(card => (
              <div key={card.id} style={s.cardWrap} onClick={() => setFlippedCard(flippedCard === card.id ? null : card.id)}>
                <div style={{ ...s.cardInner, transform: flippedCard === card.id ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
                  <div style={s.cardFront}>
                    <span style={s.cardNumber}>{card.front.number}</span>
                    <h3 style={s.cardTitle}>{card.front.title}</h3>
                    <p style={s.cardDesc}>{card.front.desc}</p>
                    <span style={s.cardHint}>{es ? 'Toca para ver más' : 'Click to learn more'}</span>
                  </div>
                  <div style={s.cardBack}>
                    {card.back.visual === 'chat' && (
                      <div style={s.cardVisualChat}>
                        <div style={s.chatBubbleAda}><span style={s.chatLabel}>Ada</span><p style={s.chatText}>{es ? 'Bajo IDEA, tu hijo tiene derecho a una Educación Pública Apropiada y Gratuita...' : 'Under IDEA, your child has the right to a Free Appropriate Public Education...'}</p></div>
                        <div style={s.chatBubbleUser}>{es ? '¿Puede la escuela cambiar su aula?' : 'Can the school change his classroom?'}</div>
                      </div>
                    )}
                    {card.back.visual === 'law' && (
                      <div style={s.cardVisualLaw}>
                        <div style={s.lawCitation}><span style={s.lawIcon}>§</span><span style={s.lawText}>IDEA 20 U.S.C. § 1414(e)</span></div>
                        <p style={s.lawExplain}>{es ? 'En lenguaje sencillo: La escuela necesita tu acuerdo escrito antes de cambiar el aula de tu hijo.' : 'Plain language: The school needs your written agreement before changing your child\'s placement.'}</p>
                      </div>
                    )}
                    {card.back.visual === 'advocate' && (
                      <div style={s.cardVisualAdvocate}>
                        <div style={s.letterPreview}><div style={s.letterLine} /><div style={s.letterLine} /><div style={s.letterLineSm} /><div style={s.letterLineSm} /><div style={s.letterLine} /></div>
                        <p style={s.advocateText}>{es ? 'Prepara cartas. Conoce tus derechos. Entra preparada.' : 'Prepare letters. Know your rights. Walk in prepared.'}</p>
                      </div>
                    )}
                    <Link href={card.back.link} style={s.cardCta} onClick={e => e.stopPropagation()}>{card.back.cta} →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MEET ADA ── */}
      <section style={s.meetAda}>
        <div style={s.meetAdaInner}>
          <div style={s.meetAdaLeft}>
            <div style={s.meetAdaRing}>
              <img src="/ada-avatar.png" alt="Ada" style={s.meetAdaImg} onError={(e) => { e.target.style.display='none'; }} />
              <span style={s.meetAdaInitial}>ADA</span>
            </div>
            <h2 style={s.meetAdaName}>Ada</h2>
            <p style={s.meetAdaTitle}>{es ? 'Tu Guía de IA de IEP Approved' : 'Your IEP Approved AI Guide'}</p>
            <div style={s.onlineBadge}><span style={s.onlineDot} />{es ? 'En línea ahora' : 'Online now'}</div>
          </div>
          <div style={s.meetAdaRight}>
            <p style={s.meetAdaEyebrow}>{es ? 'CONOCE A ADA' : 'MEET ADA'}</p>
            <h2 style={s.meetAdaHeadline}>{es ? 'Tu guía de IA para el derecho del IEP.' : 'Your AI guide to IEP law.'}</h2>
            <p style={s.meetAdaDesc}>{es ? 'Ada conoce IDEA, la ADA y la Sección 504 — y está aquí para ayudarte a entender los derechos de tu hijo en cada paso del camino.' : "Ada knows IDEA, ADA, and Section 504 — and she's here to help you understand your child's rights, every step of the way."}</p>
            <div style={s.featuresList}>
              {features.map((feat, i) => (
                <div key={i} style={s.featureItem}>
                  <span style={s.featureCheck}>✓</span>
                  <div><p style={s.featureTitle}>{feat.title}</p><p style={s.featureDesc}>{feat.desc}</p></div>
                </div>
              ))}
            </div>
            <Link href="/ada" style={s.meetAdaBtn}>{es ? 'Pregúntale a Ada tu pregunta' : 'Ask Ada your question'} →</Link>
          </div>
        </div>
      </section>

      {/* ── MEMBERSHIP ── */}
      <section id="support" style={s.pricingSection}>
        <div style={s.sectionInner}>
          <p style={s.eyebrow}>{es ? 'MEMBRESÍA' : 'MEMBERSHIP'}</p>
          <h2 style={s.sectionTitle}>{es ? 'Únete a nuestra comunidad — elige la membresía que se adapta a tu familia.' : 'Join our community — choose the membership that fits your family.'}</h2>
          <div style={s.pricingRow}>
            {/* FREE */}
            <div style={s.pricingCard}>
              <p style={s.pricingTier}>{es ? 'GRATIS' : 'FREE'}</p>
              <p style={s.pricingPrice}>$0</p>
              <p style={s.pricingPriceSub}>{es ? 'siempre gratis para comenzar' : 'always free to start'}</p>
              <p style={s.pricingDesc}>{es ? 'Hazle 5 preguntas a Ada hoy, sin necesidad de registrarte. Únete a nuestra comunidad y haz hasta 10 preguntas al mes de forma gratuita.' : 'Ask Ada 5 questions today, no signup needed. Join our community and ask up to 10 questions per month — free.'}</p>
              <Link href="/ada" style={s.pricingBtnOutline}>{es ? 'Comenzar Gratis' : 'Start Free'}</Link>
            </div>
            {/* ADA UNLIMITED */}
            <div style={s.pricingCardGold}>
              <div style={s.mostPopularBadge}>{es ? 'MÁS POPULAR' : 'MOST POPULAR'}</div>
              <p style={s.pricingTierGold}>Ada Unlimited</p>
              <p style={s.pricingPriceGold}>$4.99</p>
              <p style={s.pricingPriceSubGold}>{es ? 'por mes · cancela cuando quieras' : 'per month · cancel anytime'}</p>
              <p style={s.pricingDescGold}>{es ? 'Acceso ilimitado a Ada por menos de una taza de café. Diseñado intencionalmente — porque cada familia merece acceso a la ley, no solo quienes pueden pagar un abogado.' : 'Unlimited access to Ada for less than a cup of coffee. Designed intentionally — because every family deserves access to the law, not just those who can afford an attorney.'}</p>
              <ul style={s.featureListGold}>
                {unlimitedFeatures.map((f, i) => (
                  <li key={i} style={s.featureListItem}><span style={s.featureListCheck}>✓</span> {f}</li>
                ))}
              </ul>
              <Link href="/signup" style={s.pricingBtnGold}>{es ? 'Obtener Ada Sin Límites' : 'Get Ada Unlimited'} →</Link>
            </div>
            {/* RESOURCE CENTER */}
            <div style={s.pricingCard}>
              <p style={s.pricingTierSm}>{es ? 'À LA CARTE' : 'À LA CARTE'}</p>
              <p style={s.pricingTier}>{es ? 'Centro de Recursos' : 'Resource Center'}</p>
              <p style={s.pricingPriceSub}>{es ? 'sin membresía requerida' : 'no membership required'}</p>
              <p style={s.pricingDesc}>{es ? 'El Centro de Recursos IEP Approved — materiales descargables, libros y guías seleccionados para familias como la tuya.' : 'The IEP Approved Resource Center — downloadable materials, books, and guides curated for families like yours.'}</p>
              <ul style={s.resourceList}>
                {resourceItems.map((item, i) => (
                  <li key={i} style={s.resourceListItem}><span style={s.resourceCheck}>✓</span> {item}</li>
                ))}
              </ul>
              <Link href="/storefront" style={s.pricingBtnOutline}>{es ? 'Ver Recursos' : 'Browse Resources'}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── OUR STORY ── */}
      <section id="our-story" style={s.storySection}>
        <div style={s.storyInner}>
          <p style={s.eyebrowDark}>{es ? 'NUESTRA HISTORIA' : 'OUR STORY'}</p>
          <h2 style={s.storySectionTitle}>{es ? 'Construido por una mamá. Para cada familia.' : 'Built by a mom. For every family.'}</h2>

          <div style={s.photoGallery}>
            {robbiePhotos.map((photo, i) => (
              <div key={i} style={s.photoWrap}>
                <img src={photo.src} alt={photo.alt} style={s.photo} onError={(e) => { e.target.parentElement.style.display='none'; }} />
              </div>
            ))}
          </div>

          <div style={s.storyLayout}>
            <div style={s.storyText}>
              <p style={s.storyPara}>{es ? 'La pregunta que más se le hace a los padres de niños con necesidades especiales es: ¿lo sabías?' : 'The question most special needs parents get asked is: did you know?'}</p>
              <p style={s.storyPara}>{es ? 'Para mí — la mamá de Robbie — la respuesta es no. No lo sabía.' : 'For me — Robbie\'s mom — the answer is no. I did not know.'}</p>
              <p style={s.storyPara}>{es ? 'El diagnóstico de Robbie llegó cuando tenía solo una semana de vida. Todavía estábamos en la nursería del hospital. El médico tenía prisa. Las enfermeras habían estado evitando mis ojos toda la mañana — el elefante en la habitación era demasiado pesado para que alguien lo dijera en voz alta. Cuando el médico finalmente vino a dar la noticia, yo estaba en el baño. Lo hizo rápidamente. A través de una puerta cerrada.' : "Robbie's diagnosis came when he was just a week old. We were still in the hospital nursery. The doctor was rushed. The nurses had been avoiding my eyes all morning — the elephant in the room was too heavy for anyone to carry out loud. When the doctor finally came to deliver the news, I was in the bathroom. He did it quickly. Through a closed door."}</p>
              <p style={s.storyPara}>{es ? 'Las miradas de felicitaciones y emoción que me habían saludado toda la semana habían desaparecido. En su lugar había lástima. Ojos desviados. Silencio incómodo.' : 'The looks of congratulations and excitement that had greeted me all week were gone. In their place was pity. Averted eyes. Uncomfortable silence.'}</p>
              <p style={s.storyPara}>{es ? 'Llamé a mi padre, llorando histéricamente, y solté: "Robbie tiene síndrome de Down."' : 'I called my father, crying hysterically, and blurted out: "Robbie has Down syndrome."'}</p>
              <p style={s.storyPara}>{es ? 'Hubo una pausa. Un suspiro profundo. Y luego dijo lo único que me devolvió a la realidad.' : 'There was a pause. A deep sigh. And then he said the one thing that pulled me right back into reality.'}</p>
              <blockquote style={s.storyQuote}>{es ? '"Oh — gracias a Dios. Kimberly, de todas las cosas que ese médico pudo haber entrado a decirte hoy, esta es la mejor noticia que has recibido. ¿Y qué? Él todavía va a hacer todas las cosas. Es prematuro, tres libras, luchando por respirar por sí solo. Si sales de ese hospital y lo único que tiene es síndrome de Down — estás ganando."' : '"Oh — thank God. Kimberly, of all the things that doctor could have walked into that room and told you today, this is the best news you\'ve ever gotten. So what — he\'s still going to do all the things. He\'s premature, three pounds, struggling to breathe on his own. If you leave that hospital and the only thing he has is Down syndrome — you\'re winning."'}</blockquote>
              <p style={s.storyPara}>{es ? 'Y tenía razón.' : 'And he was right.'}</p>
              <p style={s.storyPara}>{es ? 'Aproximadamente una semana después, fuimos trasladados a una institución académica más grande. La primera persona con quien nos reunimos fue el equipo de genética — y la diferencia, la bienvenida, la recepción de Robbie y su diagnóstico, fue impresionante. Lo primero que dijo el médico fue: "Felicitaciones. Deberían jugar la lotería — porque este niño no es algo que se ve todos los días." Miró a mi hijo no como una anomalía de cosas salidas mal, sino como algo hermoso. Algo inesperado. Algo raro que debe ser apreciado.' : 'About a week later, we were transferred to a larger academic institution. The first person we met with was the genetics team — and the difference, the welcome, the reception of Robbie and his diagnosis, was stunning. The first thing the physician said to us was: "Congratulations. You folks ought to play the lottery — because this kiddo isn\'t something you see every day." He looked at my child not as an anomaly of things gone wrong, but as something beautiful. Something unexpected. Something rare to be coveted.'}</p>
              <p style={s.storyPara}>{es ? 'El equipo de profesionales con el que nos reunimos eran positivos, preparados y armados con información. Nos hablaron del programa Head Start. Nos inscribieron en un seguro comunitario. Cuando salimos de ese hospital, mi hijo estaba asegurado. Estaba preparado para visitas de enfermería a domicilio, fisioterapia y terapia ocupacional — todo coordinado antes de salir por la puerta.' : 'The team of professionals we met with were positive, prepared, and armed with information. They told us about the Head Start program. They got us enrolled in community-based insurance. By the time we left that hospital, my son was insured. He was set up for home nursing visits, physical therapy, and occupational therapy — all of it coordinated before we walked out the door.'}</p>
              <p style={s.storyPara}>{es ? 'También recibimos una guía de recursos completa — qué esperar desde el nacimiento hasta la adultez, cosas que observar y cosas que celebrar. Salimos de ese hospital sintiéndonos informados, apoyados y preparados.' : 'We were also given a complete resource guide — what to expect from birth through adulthood, things to watch for, and things to celebrate. We left that hospital feeling informed, supported, and prepared.'}</p>
              <p style={s.storyPara}>{es ? 'El contraste entre las dos instituciones lo decía todo. Un equipo estaba armado con recursos, información y la capacidad de comunicarse con confianza y compasión. El otro estaba desprevenido, incómodo — y el silencio incómodo era ensordecedor. La diferencia era información. Preparación. Comunicación. Acceso.' : 'The contrast between the two institutions was stunning. One team was armed with resources, information, and the ability to communicate with confidence and compassion. The other was unprepared, uncomfortable — and the awkward silence was deafening. The difference was information. Preparation. Communication. Access.'}</p>
              <p style={s.storyPara}><strong>{es ? 'El conocimiento es poder. La colaboración es progreso. Y cuando los unes — todo es posible.' : 'Knowledge is power. Partnership is progress. And when you put them together — anything is possible.'}</strong></p>
            </div>
            <div style={s.closingQuoteWrap}>
              <div style={s.closingQuoteLine} />
              <p style={s.closingQuote}>{es ? 'Ese es el espíritu sobre el que se construyó IEP Approved LLC.' : 'That is the spirit IEP Approved LLC was built on.'}</p>
              <div style={s.closingAuthor}>
                <div style={s.closingAvatar}>K</div>
                <div>
                  <p style={s.closingName}>Kimberly Sandro</p>
                  <p style={s.closingTitle}>{es ? 'Mamá de Robbie y Fundadora de IEP Approved LLC' : "Robbie's Mom and Founder of IEP Approved LLC"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STAY INFORMED ── */}
      <section style={s.emailSection}>
        <div style={s.emailInner}>
          <p style={s.eyebrow}>{es ? 'MANTENTE INFORMADO' : 'STAY INFORMED'}</p>
          <h2 style={s.emailTitle}>{es ? 'Recibe alertas de cambios en la ley antes de que afecten a tu hijo.' : 'Get law change alerts before they affect your child.'}</h2>
          <p style={s.emailSub}>{es ? 'Monitoreamos la ley federal de educación especial y te enviamos alertas cuando algo cambia.' : 'We monitor federal special education law and send you alerts when something changes.'}</p>
          {!emailSubmitted ? (
            <form onSubmit={handleEmailSubmit} style={s.emailForm}>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder={es ? 'tu@correo.com' : 'your@email.com'} style={s.emailInput} required />
              <button type="submit" style={s.emailBtn}>{es ? 'Unirse a la Comunidad' : 'Join the Community'}</button>
            </form>
          ) : (
            <div style={s.emailSuccess}>
              <p style={s.emailSuccessText}>{es ? 'Bienvenido. Revisa tu bandeja de entrada.' : 'Welcome. Check your inbox.'}</p>
              <Link href="/intake" style={s.emailCreateAccount}>{es ? 'Crear tu cuenta gratuita →' : 'Create your free account →'}</Link>
            </div>
          )}
          <p style={s.emailFine}>{es ? 'Sin spam. Cancela cuando quieras. Tu privacidad está protegida.' : 'No spam. Unsubscribe anytime. Your privacy is protected.'}</p>
        </div>
      </section>

      <Footer />

      <style>{`
        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        * { box-sizing:border-box; }
        body { margin:0; overflow-x:hidden; }
        @media(max-width:768px){
          .hero-inner{flex-direction:column!important}
          .pricing-row{flex-direction:column!important}
          .meet-ada-inner{flex-direction:column!important}
          .story-layout{grid-template-columns:1fr!important}
          .photo-gallery{grid-template-columns:repeat(2,1fr)!important}
        }
      `}</style>
    </>
  );
}

const s = {
  hero:{backgroundColor:'#2D1B4E'},
  heroInner:{maxWidth:'1200px',margin:'0 auto',padding:'72px 24px 48px',display:'flex',gap:'48px',alignItems:'center',flexWrap:'wrap'},
  heroLeft:{flex:'1',minWidth:'300px'},
  heroBadge:{display:'inline-block',backgroundColor:'rgba(212,168,67,0.15)',border:'1px solid rgba(212,168,67,0.4)',color:'#D4A843',padding:'6px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'700',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',marginBottom:'20px'},
  heroHeadline:{color:'#ffffff',fontSize:'52px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',lineHeight:'1.15',margin:'0 0 20px'},
  heroGold:{color:'#D4A843',fontStyle:'normal'},
  heroSub:{color:'#b8a8d0',fontSize:'18px',lineHeight:'1.7',margin:'0 0 32px',fontFamily:'Outfit,sans-serif'},
  heroBtns:{display:'flex',gap:'16px',flexWrap:'wrap'},
  heroPrimary:{backgroundColor:'#D4A843',color:'#2D1B4E',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'800',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  heroSecondary:{backgroundColor:'transparent',border:'2px solid rgba(255,255,255,0.3)',color:'#ffffff',padding:'14px 28px',borderRadius:'8px',textDecoration:'none',fontSize:'16px',fontWeight:'600',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  heroRight:{flex:'1',minWidth:'300px',display:'flex',justifyContent:'center'},
  adaQuoteCard:{backgroundColor:'rgba(255,255,255,0.05)',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'20px',padding:'36px 32px',maxWidth:'420px',textAlign:'center'},
  adaAvatarWrap:{display:'flex',justifyContent:'center',marginBottom:'20px'},
  adaAvatarRing:{width:'100px',height:'100px',borderRadius:'50%',border:'3px solid #D4A843',position:'relative',overflow:'hidden',backgroundColor:'#2D1B4E',display:'flex',alignItems:'center',justifyContent:'center',animation:'float 3s ease-in-out infinite'},
  adaAvatarImg:{width:'100%',height:'100%',objectFit:'cover',position:'absolute',zIndex:2},
  adaAvatarInitial:{color:'#D4A843',fontSize:'28px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',zIndex:1},
  adaQuote:{color:'#e8e0f0',fontSize:'17px',lineHeight:'1.7',fontStyle:'italic',margin:'0 0 16px',fontFamily:'Cormorant Garamond,serif'},
  adaQuoteAttr:{color:'#D4A843',fontSize:'13px',fontWeight:'600',fontFamily:'Outfit,sans-serif',margin:'0 0 20px'},
  adaQuoteBtn:{display:'inline-block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'11px 22px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'800',fontFamily:'Outfit,sans-serif'},
  statsRow:{backgroundColor:'rgba(0,0,0,0.2)',display:'flex',justifyContent:'center',borderTop:'1px solid rgba(212,168,67,0.2)',flexWrap:'wrap'},
  stat:{padding:'20px 48px',textAlign:'center',display:'flex',flexDirection:'column',gap:'4px'},
  statNum:{color:'#D4A843',fontSize:'24px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif'},
  statLabel:{color:'#b8a8d0',fontSize:'12px',fontFamily:'Outfit,sans-serif'},
  statDivider:{width:'1px',backgroundColor:'rgba(255,255,255,0.1)',margin:'16px 0'},
  sectionInner:{maxWidth:'1200px',margin:'0 auto',padding:'0 24px'},
  eyebrow:{color:'#D4A843',fontSize:'11px',fontWeight:'700',letterSpacing:'3px',fontFamily:'Outfit,sans-serif',marginBottom:'12px'},
  eyebrowDark:{color:'#D4A843',fontSize:'11px',fontWeight:'700',letterSpacing:'3px',fontFamily:'Outfit,sans-serif',marginBottom:'12px'},
  sectionTitle:{color:'#ffffff',fontSize:'36px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 16px',lineHeight:'1.2'},
  sectionTitleDark:{color:'#2D1B4E',fontSize:'40px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 16px',lineHeight:'1.2'},
  sectionSub:{color:'#6b7280',fontSize:'17px',lineHeight:'1.7',margin:'0 0 48px',fontFamily:'Outfit,sans-serif',maxWidth:'640px'},
  howSection:{backgroundColor:'#f5f3ff',padding:'80px 0'},
  cardsRow:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'24px'},
  cardWrap:{height:'340px',perspective:'1000px',cursor:'pointer'},
  cardInner:{position:'relative',width:'100%',height:'100%',transformStyle:'preserve-3d',transition:'transform 0.6s cubic-bezier(0.4,0,0.2,1)'},
  cardFront:{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',backgroundColor:'#ffffff',border:'1px solid rgba(45,27,78,0.1)',borderRadius:'16px',padding:'32px',display:'flex',flexDirection:'column',justifyContent:'space-between',boxShadow:'0 4px 24px rgba(0,0,0,0.08)'},
  cardBack:{position:'absolute',width:'100%',height:'100%',backfaceVisibility:'hidden',backgroundColor:'#2D1B4E',borderRadius:'16px',padding:'28px',transform:'rotateY(180deg)',display:'flex',flexDirection:'column',justifyContent:'space-between',alignItems:'center',textAlign:'center'},
  cardNumber:{color:'#D4A843',fontSize:'36px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700'},
  cardTitle:{color:'#2D1B4E',fontSize:'20px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'8px 0'},
  cardDesc:{color:'#6b7280',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',flex:1},
  cardHint:{color:'#D4A843',fontSize:'12px',fontFamily:'Outfit,sans-serif',fontWeight:'600'},
  cardCta:{backgroundColor:'#D4A843',color:'#2D1B4E',padding:'10px 24px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'800',fontFamily:'Outfit,sans-serif'},
  cardVisualChat:{width:'100%',display:'flex',flexDirection:'column',gap:'8px'},
  chatBubbleAda:{backgroundColor:'rgba(255,255,255,0.1)',borderRadius:'10px',padding:'10px 12px',textAlign:'left'},
  chatLabel:{color:'#D4A843',fontSize:'10px',fontWeight:'700',letterSpacing:'1px',display:'block',marginBottom:'4px'},
  chatText:{color:'#e8e0f0',fontSize:'12px',lineHeight:'1.5',margin:0,fontFamily:'Outfit,sans-serif'},
  chatBubbleUser:{backgroundColor:'#D4A843',color:'#2D1B4E',borderRadius:'10px',padding:'8px 12px',fontSize:'12px',fontFamily:'Outfit,sans-serif',alignSelf:'flex-end',maxWidth:'80%'},
  cardVisualLaw:{width:'100%',display:'flex',flexDirection:'column',gap:'12px',alignItems:'center'},
  lawCitation:{backgroundColor:'rgba(212,168,67,0.2)',border:'1px solid rgba(212,168,67,0.4)',borderRadius:'8px',padding:'10px 16px',display:'flex',alignItems:'center',gap:'8px'},
  lawIcon:{color:'#D4A843',fontSize:'20px',fontFamily:'Cormorant Garamond,serif'},
  lawText:{color:'#D4A843',fontSize:'13px',fontWeight:'700',fontFamily:'Outfit,sans-serif'},
  lawExplain:{color:'#b8a8d0',fontSize:'13px',lineHeight:'1.5',fontFamily:'Outfit,sans-serif',margin:0},
  cardVisualAdvocate:{width:'100%',display:'flex',flexDirection:'column',gap:'12px',alignItems:'center'},
  letterPreview:{backgroundColor:'rgba(255,255,255,0.08)',borderRadius:'8px',padding:'16px',width:'100%',display:'flex',flexDirection:'column',gap:'8px'},
  letterLine:{height:'8px',backgroundColor:'rgba(255,255,255,0.2)',borderRadius:'4px'},
  letterLineSm:{height:'8px',backgroundColor:'rgba(255,255,255,0.1)',borderRadius:'4px',width:'60%'},
  advocateText:{color:'#b8a8d0',fontSize:'13px',lineHeight:'1.5',fontFamily:'Outfit,sans-serif',margin:0},
  meetAda:{backgroundColor:'#2D1B4E',padding:'80px 0'},
  meetAdaInner:{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',display:'flex',gap:'64px',alignItems:'flex-start',flexWrap:'wrap'},
  meetAdaLeft:{display:'flex',flexDirection:'column',alignItems:'center',minWidth:'200px'},
  meetAdaRing:{width:'160px',height:'160px',borderRadius:'50%',border:'4px solid #D4A843',position:'relative',overflow:'hidden',backgroundColor:'#1a0f2e',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:'16px',boxShadow:'0 0 40px rgba(212,168,67,0.3)'},
  meetAdaImg:{width:'100%',height:'100%',objectFit:'cover',position:'absolute',zIndex:2},
  meetAdaInitial:{color:'#D4A843',fontSize:'32px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',zIndex:1},
  meetAdaName:{color:'#D4A843',fontSize:'28px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 4px'},
  meetAdaTitle:{color:'#b8a8d0',fontSize:'13px',fontFamily:'Outfit,sans-serif',margin:'0 0 12px',textAlign:'center'},
  onlineBadge:{display:'flex',alignItems:'center',gap:'6px',backgroundColor:'rgba(34,197,94,0.1)',border:'1px solid rgba(34,197,94,0.3)',borderRadius:'20px',padding:'5px 12px',color:'#22c55e',fontSize:'12px',fontFamily:'Outfit,sans-serif'},
  onlineDot:{width:'7px',height:'7px',borderRadius:'50%',backgroundColor:'#22c55e'},
  meetAdaRight:{flex:1,minWidth:'300px'},
  meetAdaEyebrow:{color:'#D4A843',fontSize:'11px',fontWeight:'700',letterSpacing:'3px',fontFamily:'Outfit,sans-serif',marginBottom:'12px'},
  meetAdaHeadline:{color:'#ffffff',fontSize:'36px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 16px'},
  meetAdaDesc:{color:'#b8a8d0',fontSize:'16px',lineHeight:'1.7',margin:'0 0 28px',fontFamily:'Outfit,sans-serif'},
  featuresList:{display:'flex',flexDirection:'column',gap:'16px',marginBottom:'28px'},
  featureItem:{display:'flex',gap:'12px',alignItems:'flex-start'},
  featureCheck:{color:'#D4A843',fontSize:'16px',fontWeight:'700',flexShrink:0,marginTop:'1px'},
  featureTitle:{color:'#e8e0f0',fontSize:'15px',fontWeight:'700',fontFamily:'Outfit,sans-serif',margin:'0 0 4px'},
  featureDesc:{color:'#b8a8d0',fontSize:'13px',lineHeight:'1.5',fontFamily:'Outfit,sans-serif',margin:0},
  meetAdaBtn:{display:'inline-block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'13px 26px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'800',fontFamily:'Outfit,sans-serif'},
  pricingSection:{backgroundColor:'#0f0a1a',padding:'80px 0'},
  pricingRow:{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:'24px',alignItems:'start',marginTop:'48px'},
  pricingCard:{backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.2)',borderRadius:'16px',padding:'32px 28px',display:'flex',flexDirection:'column',gap:'12px'},
  pricingTier:{color:'#b8a8d0',fontSize:'13px',fontWeight:'700',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',margin:0},
  pricingTierSm:{color:'rgba(184,168,208,0.5)',fontSize:'11px',fontWeight:'700',letterSpacing:'2px',fontFamily:'Outfit,sans-serif',margin:0},
  pricingPrice:{color:'#ffffff',fontSize:'40px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:0},
  pricingPriceSub:{color:'#b8a8d0',fontSize:'13px',fontFamily:'Outfit,sans-serif',margin:0},
  pricingDesc:{color:'#b8a8d0',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',margin:0},
  pricingBtnOutline:{display:'block',backgroundColor:'transparent',border:'1px solid rgba(212,168,67,0.5)',color:'#D4A843',padding:'12px',borderRadius:'8px',textDecoration:'none',fontSize:'14px',fontWeight:'700',fontFamily:'Outfit,sans-serif',textAlign:'center',marginTop:'8px'},
  pricingCardGold:{backgroundColor:'#D4A843',borderRadius:'16px',padding:'36px 28px',display:'flex',flexDirection:'column',gap:'12px',position:'relative',boxShadow:'0 20px 60px rgba(212,168,67,0.3)'},
  mostPopularBadge:{backgroundColor:'#2D1B4E',color:'#D4A843',padding:'5px 14px',borderRadius:'20px',fontSize:'11px',fontWeight:'800',letterSpacing:'1px',fontFamily:'Outfit,sans-serif',alignSelf:'flex-start'},
  pricingTierGold:{color:'#2D1B4E',fontSize:'22px',fontFamily:'Cormorant Garamond,serif',fontWeight:'800',margin:0},
  pricingPriceGold:{color:'#2D1B4E',fontSize:'48px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:0},
  pricingPriceSubGold:{color:'rgba(45,27,78,0.7)',fontSize:'13px',fontFamily:'Outfit,sans-serif',margin:0},
  pricingDescGold:{color:'#2D1B4E',fontSize:'14px',lineHeight:'1.6',fontFamily:'Outfit,sans-serif',margin:0},
  featureListGold:{listStyle:'none',padding:0,margin:'8px 0',display:'flex',flexDirection:'column',gap:'8px'},
  featureListItem:{color:'#2D1B4E',fontSize:'14px',fontFamily:'Outfit,sans-serif',display:'flex',alignItems:'flex-start',gap:'8px'},
  featureListCheck:{fontWeight:'800',flexShrink:0},
  pricingBtnGold:{display:'block',backgroundColor:'#2D1B4E',color:'#D4A843',padding:'14px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'800',fontFamily:'Outfit,sans-serif',textAlign:'center',marginTop:'8px'},
  resourceList:{listStyle:'none',padding:0,margin:'4px 0',display:'flex',flexDirection:'column',gap:'8px'},
  resourceListItem:{color:'#b8a8d0',fontSize:'13px',fontFamily:'Outfit,sans-serif',display:'flex',alignItems:'flex-start',gap:'8px'},
  resourceCheck:{color:'#D4A843',fontWeight:'700',flexShrink:0},
  storySection:{backgroundColor:'#ffffff',padding:'80px 0'},
  storyInner:{maxWidth:'1100px',margin:'0 auto',padding:'0 24px'},
  storySectionTitle:{color:'#2D1B4E',fontSize:'40px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 40px'},
  photoGallery:{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'12px',marginBottom:'48px'},
  photoWrap:{borderRadius:'12px',overflow:'hidden',aspectRatio:'4/3',backgroundColor:'#f3f4f6'},
  photo:{width:'100%',height:'100%',objectFit:'cover',display:'block'},
  storyLayout:{display:'flex',flexDirection:'column',gap:'16px'},
  storyText:{display:'flex',flexDirection:'column',gap:'16px'},
  storyPara:{color:'#374151',fontSize:'16px',lineHeight:'1.8',fontFamily:'Outfit,sans-serif',margin:0},
  storyQuote:{borderLeft:'4px solid #D4A843',paddingLeft:'20px',margin:'8px 0',color:'#2D1B4E',fontSize:'16px',fontStyle:'italic',lineHeight:'1.8',fontFamily:'Cormorant Garamond,serif'},
closingQuoteWrap:{padding:'16px 0 0',borderTop:'3px solid #D4A843',marginTop:'8px'},
closingQuoteLine:{display:'none'},
closingQuote:{color:'#2D1B4E',fontSize:'18px',lineHeight:'1.8',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 20px'},
  closingAuthor:{display:'flex',alignItems:'center',gap:'12px'},
  closingAvatar:{width:'44px',height:'44px',borderRadius:'50%',backgroundColor:'#D4A843',color:'#2D1B4E',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'18px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',flexShrink:0},
  closingName:{color:'#D4A843',fontSize:'15px',fontWeight:'700',fontFamily:'Outfit,sans-serif',margin:'0 0 2px'},
  closingTitle:{color:'#b8a8d0',fontSize:'12px',fontFamily:'Outfit,sans-serif',margin:0},
  emailSection:{backgroundColor:'#2D1B4E',padding:'80px 0'},
  emailInner:{maxWidth:'640px',margin:'0 auto',padding:'0 24px',textAlign:'center'},
  emailTitle:{color:'#ffffff',fontSize:'36px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:'0 0 16px'},
  emailSub:{color:'#b8a8d0',fontSize:'16px',lineHeight:'1.7',margin:'0 0 32px',fontFamily:'Outfit,sans-serif'},
  emailForm:{display:'flex',gap:'12px',flexWrap:'wrap',justifyContent:'center'},
  emailInput:{flex:1,minWidth:'240px',backgroundColor:'rgba(255,255,255,0.08)',border:'1px solid rgba(255,255,255,0.2)',borderRadius:'8px',color:'#ffffff',fontSize:'15px',padding:'13px 16px',fontFamily:'Outfit,sans-serif',outline:'none'},
  emailBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',padding:'13px 24px',fontSize:'15px',fontWeight:'800',fontFamily:'Outfit,sans-serif',cursor:'pointer',whiteSpace:'nowrap'},
  emailFine:{color:'rgba(184,168,208,0.5)',fontSize:'12px',marginTop:'16px',fontFamily:'Outfit,sans-serif'},
  emailSuccess:{display:'flex',flexDirection:'column',gap:'16px',alignItems:'center'},
  emailSuccessText:{color:'#e8e0f0',fontSize:'18px',fontFamily:'Outfit,sans-serif',margin:0},
  emailCreateAccount:{display:'inline-block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'12px 24px',borderRadius:'8px',textDecoration:'none',fontSize:'15px',fontWeight:'800',fontFamily:'Outfit,sans-serif'},
};
