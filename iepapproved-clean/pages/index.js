import Head from 'next/head'
import { useState } from 'react'
import styles from '../styles/Home.module.css'

export default function Home() {
  const [heroInput, setHeroInput] = useState('')

  return (
    <>
      <Head>
        <title>IEP Approved — Know Your Child&apos;s Rights</title>
        <meta name="description" content="Ada is your AI-powered guide to IEP law, IDEA, and ADA. Ask any question about your child's education rights and get a real answer — with the law to back it up." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        {/* Open Graph */}
        <meta property="og:title" content="IEP Approved — Know Your Child's Rights" />
        <meta property="og:description" content="Ada is your AI-powered guide to IEP law, IDEA, and ADA." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://iepapproved.com" />
      </Head>

      {/* NAV */}
      <nav className={styles.nav}>
        <a href="#" className={styles.navLogo}>IEP <span>Approved</span></a>
        <ul className={styles.navLinks}>
          <li><a href="#how-it-works">How It Works</a></li>
          <li><a href="#ada">Ask Ada</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><a href="#about">Our Story</a></li>
          <li><a href="/ada" className={styles.navCta}>Try Ada Free →</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <div className={styles.heroLeft}>
            <div className={styles.heroEyebrow}>✦ For special needs families</div>
            <h1 className={styles.heroHeadline}>
              Every parent deserves to know their child&apos;s <em>rights.</em>
            </h1>
            <p className={styles.heroSub}>
              Ada is your AI-powered guide to IEP law, IDEA, and ADA. Ask any question about your child&apos;s education rights and get a real answer — with the law to back it up.
            </p>
            <div className={styles.heroActions}>
              <a href="/ada" className={styles.btnPrimary}>Ask Ada Free →</a>
              <a href="#how-it-works" className={styles.btnGhost}>See How It Works</a>
            </div>
            <div className={styles.heroStatRow}>
              <div className={styles.heroStat}>
                <div className={styles.statNum}>7.5M</div>
                <div className={styles.statLabel}>children with IEPs in the US</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.statNum}>Free</div>
                <div className={styles.statLabel}>to start, always</div>
              </div>
              <div className={styles.heroStat}>
                <div className={styles.statNum}>IDEA</div>
                <div className={styles.statLabel}>ADA & Section 504 coverage</div>
              </div>
            </div>
          </div>

          {/* ADA PREVIEW CARD */}
          <div className={styles.adaCard}>
            <div className={styles.adaHeader}>
              <div className={styles.adaAvatar}>A</div>
              <div className={styles.adaTitle}>
                <strong>Ada</strong>
                <span>IEP Approved AI Guide</span>
              </div>
            </div>
            <div className={styles.adaMessage}>
              Hi — I&apos;m Ada. I know federal special education law inside and out. Ask me anything about your child&apos;s IEP, their rights under <strong>IDEA</strong>, or what the school is required to provide.
            </div>
            <div className={styles.adaInputRow}>
              <input
                className={styles.adaInput}
                type="text"
                placeholder="e.g. Can the school remove my child from a field trip?"
                value={heroInput}
                onChange={e => setHeroInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && heroInput.trim()) window.location.href = `/ada?q=${encodeURIComponent(heroInput)}` }}
              />
              <button
                className={styles.adaSend}
                onClick={() => { if (heroInput.trim()) window.location.href = `/ada?q=${encodeURIComponent(heroInput)}` }}
                aria-label="Ask Ada"
              >
                <svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
              </button>
            </div>
            <div className={styles.adaDisclaimer}>Not legal advice. Always consult an attorney for your specific situation.</div>
<div style={{marginTop:'10px', padding:'8px 12px', background:'rgba(212,168,67,0.15)', border:'1px solid rgba(212,168,67,0.3)', borderRadius:'8px', fontSize:'11px', color:'#D4A843', textAlign:'center'}}>
  🇪🇸 ¿Hablas español? Ada también — solo pregúntale en español.
</div>
          </div>
        </div>
      </section>

      {/* ORIGIN STRIP */}
      <div className={styles.originStrip}>
        <p>&ldquo;A doctor once told me my son had Down syndrome — through a closed shower door. Every parent deserves better than that.&rdquo;</p>
      </div>

      {/* HOW IT WORKS */}
      <section className={styles.section} id="how-it-works">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>How It Works</span>
          <h2 className={styles.sectionTitle}>From lost to informed<br />in minutes.</h2>
          <p className={styles.sectionSub}>You don&apos;t need a law degree. You need Ada — and the confidence to walk into that meeting knowing your rights.</p>

          <div className={styles.stepsGrid}>
            {[
              { num: '01', icon: '💬', title: 'Ask Ada anything', desc: 'Type your question in plain English. "Can they change my child\'s placement without telling me?" "What is FAPE?" "Am I allowed to record IEP meetings?" Ada understands.' },
              { num: '02', icon: '⚖️', title: 'Get the law, not just an opinion', desc: 'Ada cites the specific statute — IDEA, ADA, Section 504 — so you can walk into any meeting and quote chapter and verse. No more guessing.' },
              { num: '03', icon: '🛡️', title: 'Advocate with confidence', desc: 'Use Ada\'s answers to write letters, prepare for meetings, and push back when the school says no. Knowledge is the difference between a "no" and a "yes."' },
            ].map(step => (
              <div key={step.num} className={styles.stepCard}>
                <div className={styles.stepNum}>{step.num}</div>
                <div className={styles.stepIcon}>{step.icon}</div>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDesc}>{step.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ADA SECTION */}
      <section className={styles.adaSection} id="ada">
        <div className={styles.sectionInner}>
          <div className={styles.adaTwoCol}>
            <div>
              <span className={styles.sectionLabel}>Meet Ada</span>
              <h2 className={`${styles.sectionTitle} ${styles.onPlum}`}>Your AI guide to IEP law.</h2>
              <p className={`${styles.sectionSub} ${styles.onPlumSub}`}>Ada knows IDEA, ADA, and Section 504 — and she explains it like a friend who happens to be a lawyer.</p>
              <div className={styles.adaFeatureList}>
                {[
                  { title: 'Cites the exact law', desc: 'Every answer references the specific federal statute — not just general advice.' },
                  { title: 'Plain English, always', desc: 'No legal jargon. Ada explains what it means for your specific situation.' },
                  { title: 'Honest about limits', desc: "When you need a real attorney, Ada will tell you. No false confidence." },
                ].map(f => (
                  <div key={f.title} className={styles.adaFeatureItem}>
                    <span className={styles.checkmark}>✓</span>
                    <div>
                      <div className={styles.adaFeatureTitle}>{f.title}</div>
                      <div className={styles.adaFeatureDesc}>{f.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className={styles.adaDemoBox}>
              <div className={styles.adaDemoTopbar}>
                <span className={styles.dot} style={{background:'#FF5F57'}}></span>
                <span className={styles.dot} style={{background:'#FFBD2E'}}></span>
                <span className={styles.dot} style={{background:'#28CA41'}}></span>
                <span className={styles.topbarLabel}>Ada — IEP Approved</span>
                <span className={styles.topbarStatus}><span className={styles.statusDot}></span> Online</span>
              </div>
              <div className={styles.adaDemoMessages}>
                <div className={styles.msgUser}>My son&apos;s school says they want to change his placement to a self-contained classroom. Can they do that without my consent?</div>
                <div className={styles.msgAda}>
                  No — they cannot make a placement change without your consent. Under <strong>IDEA (20 U.S.C. § 1414(e))</strong>, you are a required member of your child&apos;s IEP team, and any change to educational placement requires your written agreement.
                  <span className={styles.cite}>📖 IDEA § 1414(e) — Parental Consent</span>
                </div>
              </div>
              <div className={styles.adaDemoInputRow}>
                <a href="/ada" className={styles.adaDemoBtn}>Ask Ada your question →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className={styles.pricingSection} id="pricing">
        <div className={styles.sectionInner}>
          <span className={styles.sectionLabel}>Pricing</span>
          <h2 className={`${styles.sectionTitle} ${styles.onPlum}`}>Knowledge shouldn&apos;t have a<br />price barrier.</h2>
          <p className={`${styles.sectionSub} ${styles.onPlumSub}`}>Start free. Upgrade when you need more.</p>
          <div className={styles.pricingGrid}>
            <div className={styles.pricingCard}>
              <div className={styles.priceLabel}>Free</div>
              <div className={styles.priceAmount}>$0</div>
              <div className={styles.pricePeriod}>always free</div>
              <div className={styles.priceDesc}>Everything you need to understand your child&apos;s federal rights and ask Ada your first questions.</div>
              <ul className={styles.priceFeatures}>
                {['Unlimited Ada Q&A (federal law)','Federal law library','IEP terminology glossary','Law change email alerts'].map(f => <li key={f} className={styles.priceFeature}>{f}</li>)}
              </ul>
              <a href="/ada" className={styles.btnPricingGhost}>Get Started Free</a>
            </div>
            <div className={`${styles.pricingCard} ${styles.featured}`}>
              <div className={styles.pricingBadge}>Most Popular</div>
              <div className={styles.priceLabel}>IEP Pro</div>
              <div className={styles.priceAmount}>$9.99</div>
              <div className={styles.pricePeriod}>per month · cancel anytime</div>
              <div className={styles.priceDesc}>For the parent who is ready to walk into every IEP meeting as the most prepared person in the room.</div>
              <ul className={styles.priceFeatures}>
                {['Everything in Free','Meeting prep checklists by disability','Document & letter templates','Ada with state law knowledge','Priority response'].map(f => <li key={f} className={styles.priceFeature}>{f}</li>)}
              </ul>
              <a href="/signup?plan=pro" className={styles.btnPricingPlum}>Start IEP Pro →</a>
            </div>
            <div className={styles.pricingCard}>
              <div className={styles.priceLabel}>Advocate+</div>
              <div className={styles.priceAmount}>$24.99</div>
              <div className={styles.pricePeriod}>per month · cancel anytime</div>
              <div className={styles.priceDesc}>For families navigating complex disputes, transition planning, or district-level battles.</div>
              <ul className={styles.priceFeatures}>
                {['Everything in Pro','Transition planning tools (age 14+)','Attorney & advocate directory','Due process guidance'].map(f => <li key={f} className={styles.priceFeature}>{f}</li>)}
              </ul>
              <button className={styles.btnPricingGhost} disabled style={{opacity:0.5,cursor:'not-allowed'}}>Coming Soon</button>
            </div>
          </div>
        </div>
      </section>

      {/* ORIGIN STORY */}
      <section className={styles.originSection} id="about">
        <div className={styles.originInner}>
          <div>
            <blockquote className={styles.originQuote}>
  The right words — at the right time — can completely change your future.
</blockquote>
            <div className={styles.originSig}>
              <div className={styles.originSigAvatar}>K</div>
              <div>
                <div className={styles.originSigName}>Kimberly</div>
<div className={styles.originSigTitle}>Robbie&apos;s Mom and Founder of IEP Approved</div>
              </div>
            </div>
          </div>
          <div className={styles.originText}>
  <span className={styles.sectionLabel}>Our Story</span>
  <p>The first question I get asked — more than any other — is: <em>did you know?</em></p>
  <p>No. I didn&apos;t know.</p>
  <p>Robbie&apos;s diagnosis came when he was a week old. The doctor was in a rush. I was in the bathroom. He delivered the news quickly, through a closed door — I could hear the awkward sadness in his voice. He took the easy way out. It was a hit and run.</p>
  <p>When I walked out of that bathroom and made my way down the hall to the nursery, something had shifted. The looks of congratulations and excitement that had greeted me all week were gone. In their place was pity. Averted eyes. Uncomfortable silence. They had all known. They had been avoiding me all morning, waiting for the doctor to deliver his news.</p>
  <p>When I asked why no one had prepared me — so I could be truly present for that moment — I was told: <em>&ldquo;That&apos;s not my job. The doctor has to give you results.&rdquo;</em></p>
  <p>They were right. It wasn&apos;t their job to give me the results. But it was absolutely their job to make sure I had support. That I wasn&apos;t alone. That resources were available to me the moment I needed them.</p>
  <p>One nurse, with the best of intentions, said: <em>&ldquo;Why do bad things happen to good people?&rdquo;</em></p>
  <p>I want to be clear about something: Robbie is not a bad thing. He never was.</p>
  <p>I was sitting in the nursery holding him for the first time since the diagnosis — and I needed to say it out loud. The doctor and staff had left it for me to tell Robbie&apos;s dad. I needed to hear myself say the words. I called my father. I was crying hysterically.</p>
  <p><em>&ldquo;Kimberly — what&apos;s wrong?&rdquo;</em></p>
  <p><em>&ldquo;Robbie has Down syndrome.&rdquo;</em></p>
  <p>There was a pause. Then a deep sigh. And then he said something I did not expect — something that snapped me out of my tailspin and brought me back to earth.</p>
  <p><em>&ldquo;Oh — thank God. Kimberly, of all the things that doctor could have walked into that room and told you today, this is the best news you&apos;ve ever gotten. So what — he&apos;s still going to do all the things. He&apos;s premature, three pounds, struggling to breathe on his own. If you leave that hospital and the only thing he has is Down syndrome — you&apos;re winning.&rdquo;</em></p>
  <p>And he was right.</p>
  <p>That moment taught me everything I needed to know about the power of words. The right ones — at the right time — from someone who loves you — can completely change your future. They can pull you back from the edge of fear and plant you firmly in possibility.</p>
  <p>That&apos;s the energy IEP Approved was built on.</p>
  <p>Just because an outcome isn&apos;t what you expected does not mean it has to be hard, impossible, or negative. How we communicate with each other — the words we choose, the support we offer, the resources we make available — has the greatest impact on how we move forward. Community, knowledge, and access to the right resources can completely change your outlook. They can change your future.</p>
  <p>My first IEP meeting was no different.</p>
  <p>We lived in a rural area. Daycare options that could meet Robbie&apos;s needs were limited. When busing became a barrier — too far, the administrator said — she wanted to know if I was going to drive him myself.</p>
  <p>I said no.</p>
  <p>Access to a free and appropriate public education is Robbie&apos;s right under IDEA. His right to transportation is part of that. The school system needed to meet its obligation.</p>
  <p>The administrator was frustrated. She told me — this mom, sitting across from her — that Robbie was going to have a lot of needs like this, and suggested I consider quitting my job to be more present. To transport him myself.</p>
  <p>I asked her if she asked every parent that question.</p>
  <p>Then I told her: No. I would continue to be a parent who works — who provides food, housing, and stability for her child. And the school system would need to meet its legal obligation.</p>
  <p>I stayed calm. Not because it wasn&apos;t hard. But because I had knowledge. I knew the law. And knowing the law made me feel something I hadn&apos;t felt since that bathroom door swung open.</p>
  <p><strong>Empowered.</strong></p>
  <p>That&apos;s why IEP Approved exists.</p>
  <p>Not to teach parents to fight — but to teach everyone at the table to partner. We built this for parents who want to walk in informed. For educators who want families to feel supported, not adversarial. For healthcare professionals who want their patients to have access to the resources and community they need to thrive.</p>
  <p>When everyone speaks the same language — when the law is clear, the resources are accessible, and the support system is real — the outcome for the child is always better.</p>
  <p>Because the moment you know your rights, everything changes. The conversation changes. The dynamic changes. You are no longer an outsider in your own child&apos;s education.</p>
  <p>You belong at that table. You always did.</p>
  <p><strong>We built IEP Approved so no parent ever has to navigate this alone.</strong></p>
  <p><em>— Kimberly, Robbie&apos;s Mom and Founder of IEP Approved</em></p>
</div>
        </div>
      </section>

      {/* EMAIL CAPTURE */}
      <section className={styles.emailSection}>
        <span className={styles.sectionLabel} style={{display:'block',marginBottom:'12px'}}>Stay Informed</span>
        <h2 className={`${styles.sectionTitle} ${styles.onPlum}`}>Get law change alerts<br />before they affect your child.</h2>
        <p className={`${styles.sectionSub} ${styles.onPlumSub}`} style={{textAlign:'center',margin:'0 auto 36px'}}>We monitor federal special education law and send you plain-English alerts when something changes. Free, always.</p>
        <EmailForm />
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <div className={styles.footerLogo}>IEP <span>Approved</span></div>
            <div className={styles.footerTagline}>Knowledge is the difference between a &ldquo;no&rdquo; and a &ldquo;yes.&rdquo; Every family deserves both.</div>
          </div>
          <div>
            <div className={styles.footerColTitle}>Platform</div>
            <ul className={styles.footerLinks}><li><a href="/ada">Ask Ada</a></li><li><a href="#pricing">Pricing</a></li></ul>
          </div>
          <div>
            <div className={styles.footerColTitle}>Company</div>
            <ul className={styles.footerLinks}><li><a href="#about">Our Story</a></li><li><a href="mailto:hello@iepapproved.com">Contact</a></li></ul>
          </div>
          <div>
            <div className={styles.footerColTitle}>Legal</div>
            <ul className={styles.footerLinks}><li><a href="/terms">Terms</a></li><li><a href="/privacy">Privacy</a></li><li><a href="/disclaimer">Disclaimer</a></li></ul>
          </div>
        </div>
        <div className={styles.footerBottom}>
          <p>© 2026 IEP Approved. All rights reserved.</p>
          <p className={styles.footerDisclaimer}>IEP Approved and Ada provide legal information, not legal advice. Content is for educational purposes only and does not constitute an attorney-client relationship.</p>
        </div>
      </footer>
    </>
  )
}

function EmailForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('idle')
  const styles2 = {
    form: { display:'flex', gap:'12px', maxWidth:'480px', margin:'0 auto', flexWrap:'wrap' },
    input: { flex:1, minWidth:'200px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px', padding:'13px 16px', fontFamily:'Outfit,sans-serif', fontSize:'14px', color:'#fff', outline:'none' },
    btn: { background:'#D4A843', color:'#1E1035', border:'none', borderRadius:'8px', padding:'13px 24px', fontFamily:'Outfit,sans-serif', fontSize:'14px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
    note: { fontSize:'11px', color:'rgba(255,255,255,0.3)', marginTop:'12px', textAlign:'center' },
    success: { color:'#D4A843', fontWeight:600, textAlign:'center', fontSize:'15px' }
  }

  const handleSubmit = async () => {
    if (!email || !email.includes('@')) return
    setStatus('loading')
    await new Promise(r => setTimeout(r, 800))
    setStatus('done')
  }

  if (status === 'done') return <p style={styles2.success}>✓ You&apos;re on the list. We&apos;ll alert you when the law changes.</p>

  return (
    <div style={{position:'relative',zIndex:2}}>
      <div style={styles2.form}>
        <input style={styles2.input} type="email" placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        <button style={styles2.btn} onClick={handleSubmit} disabled={status === 'loading'}>{status === 'loading' ? '...' : 'Get Alerts Free'}</button>
      </div>
      <p style={styles2.note}>No spam. Just law changes that matter to your family. Unsubscribe anytime.</p>
    </div>
  )
}
