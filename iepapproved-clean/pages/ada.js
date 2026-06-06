import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

const GUEST_LIMIT = 5
const FREE_MONTHLY_LIMIT = 10

function getStorageCount() {
  try {
    const data = JSON.parse(localStorage.getItem('ada_usage') || '{}')
    const now = new Date()
    const month = `${now.getFullYear()}-${now.getMonth()}`
    if (data.month !== month) return { count: 0, month, email: data.email || null, isGuest: !data.email }
    return { count: data.count || 0, month, email: data.email || null, isGuest: !data.email }
  } catch { return { count: 0, month: '', email: null, isGuest: true } }
}

function saveStorageCount(count, email, month) {
  try { localStorage.setItem('ada_usage', JSON.stringify({ count, month, email })) } catch {}
}

export default function AdaPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hi, I'm Ada — your IEP Approved AI guide to federal special education law. I can help you understand your child's rights under IDEA, ADA, and Section 504.\n\nWhat would you like to know?" }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [showEmailWall, setShowEmailWall] = useState(false)
  const [showMonthlyLimit, setShowMonthlyLimit] = useState(false)
  const [usage, setUsage] = useState({ count: 0, month: '', email: null, isGuest: true })
  const [wallEmail, setWallEmail] = useState('')
  const [wallSubmitting, setWallSubmitting] = useState(false)
  const [wallDone, setWallDone] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [lastAdaText, setLastAdaText] = useState('')
  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const audioRef = useRef(null)

  useEffect(() => {
    const u = getStorageCount()
    setUsage(u)
    if (typeof window !== 'undefined') {
      setSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    }
  }, [])

  useEffect(() => {
    if (!router.isReady) return
    if (router.query.q) {
      const question = router.query.q
      const u = getStorageCount()
      if (u.isGuest && u.count >= GUEST_LIMIT) { setShowEmailWall(true); return }
      if (!u.isGuest && u.count >= FREE_MONTHLY_LIMIT) { setShowMonthlyLimit(true); return }
      setInput('')
      const newMessages = [
        { role: 'assistant', content: "Hi, I'm Ada — your IEP Approved AI guide to federal special education law. I can help you understand your child's rights under IDEA, ADA, and Section 504.\n\nWhat would you like to know?" },
        { role: 'user', content: question }
      ]
      setMessages(newMessages)
      setLoading(true)
      const newCount = u.count + 1
      saveStorageCount(newCount, u.email, u.month)
      setUsage({ ...u, count: newCount })
      fetch('/api/ada', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
        .then(res => res.json())
        .then(data => {
          setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
          setLastAdaText(data.content)
          setLoading(false)
          if (autoSpeak) speakWithElevenLabs(data.content)
        })
        .catch(() => { setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }]); setLoading(false) })
    }
  }, [router.isReady, router.query.q])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages, loading])

  // ── ELEVENLABS TTS ──
  const speakWithElevenLabs = async (text) => {
    try {
      setIsSpeaking(true)
      if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })

      if (!res.ok) throw new Error('TTS failed')

      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const audio = new Audio(url)
      audioRef.current = audio
      audio.onended = () => { setIsSpeaking(false); URL.revokeObjectURL(url) }
      audio.onerror = () => setIsSpeaking(false)
      audio.play()
    } catch (err) {
      console.error('ElevenLabs TTS error:', err)
      setIsSpeaking(false)
    }
  }

  const stopSpeaking = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null }
    setIsSpeaking(false)
  }

  // ── SPEECH TO TEXT ──
  const startListening = () => {
    if (!speechSupported) return
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    const r = new SR()
    r.lang = 'en-US'; r.continuous = false; r.interimResults = false
    r.onstart = () => setIsListening(true)
    r.onresult = (e) => setInput(prev => prev ? prev + ' ' + e.results[0][0].transcript : e.results[0][0].transcript)
    r.onend = () => setIsListening(false)
    r.onerror = () => setIsListening(false)
    recognitionRef.current = r
    r.start()
  }

  const stopListening = () => { if (recognitionRef.current) recognitionRef.current.stop(); setIsListening(false) }

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    const u = getStorageCount()
    if (u.isGuest && u.count >= GUEST_LIMIT) { setShowEmailWall(true); return }
    if (!u.isGuest && u.count >= FREE_MONTHLY_LIMIT) { setShowMonthlyLimit(true); return }
    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    const newCount = u.count + 1
    saveStorageCount(newCount, u.email, u.month)
    setUsage({ ...u, count: newCount })
    try {
      const res = await fetch('/api/ada', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: newMessages }) })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
      setLastAdaText(data.content)
      if (autoSpeak) speakWithElevenLabs(data.content)
    } catch { setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }]) }
    setLoading(false)
  }

  const handleEmailSubmit = async () => {
    if (!wallEmail || !wallEmail.includes('@')) return
    setWallSubmitting(true)
    await new Promise(r => setTimeout(r, 800))
    const u = getStorageCount()
    const now = new Date()
    const month = `${now.getFullYear()}-${now.getMonth()}`
    saveStorageCount(0, wallEmail, month)
    setUsage({ count: 0, month, email: wallEmail, isGuest: false })
    setWallDone(true); setWallSubmitting(false)
    setTimeout(() => { setShowEmailWall(false); setWallDone(false) }, 1500)
  }

  const questionsLeft = usage.isGuest ? Math.max(0, GUEST_LIMIT - usage.count) : Math.max(0, FREE_MONTHLY_LIMIT - usage.count)

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP and special education law questions." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>
        {/* NAV */}
        <div style={s.nav}>
          <a href="/" style={s.backLink}>← IEP Approved</a>
          <div style={s.navRight}>
            <span style={s.counterPill}>{questionsLeft} {usage.isGuest ? 'free questions' : 'remaining this month'}</span>
          </div>
        </div>

        <div style={s.main}>
          {/* ADA AVATAR PANEL */}
          <div style={s.adaPanel}>
            <div style={{...s.adaAvatarWrap, boxShadow: isSpeaking ? '0 0 0 6px rgba(212,168,67,0.5), 0 0 40px rgba(212,168,67,0.3)' : loading ? '0 0 0 4px rgba(255,255,255,0.15)' : '0 0 0 3px rgba(212,168,67,0.3)'}}>
              <img src="/ada-avatar.png" alt="Ada" style={s.adaAvatarImg} />
              {isSpeaking && <div style={s.speakingRing}></div>}
            </div>
            <div style={s.adaName}>Ada</div>
            <div style={s.adaTitle}>IEP Law Guide</div>
            <div style={{...s.adaStatusRow, color: isSpeaking ? '#D4A843' : loading ? '#a78bfa' : '#4ade80'}}>
              <span style={{...s.statusDot, background: isSpeaking ? '#D4A843' : loading ? '#a78bfa' : '#4ade80'}}></span>
              {isSpeaking ? 'Speaking...' : loading ? 'Thinking...' : 'Online'}
            </div>

            {/* Audio controls */}
            <div style={s.audioSection}>
              <div style={s.audioLabel}>🔊 Voice Controls</div>
              <button
                style={{...s.audioBtn, background: autoSpeak ? '#D4A843' : 'rgba(255,255,255,0.08)', color: autoSpeak ? '#1E1035' : 'rgba(255,255,255,0.7)'}}
                onClick={() => { setAutoSpeak(!autoSpeak); if (isSpeaking) stopSpeaking() }}
              >
                {autoSpeak ? '🔊 Auto-Read ON' : '🔇 Auto-Read OFF'}
              </button>

              {isSpeaking ? (
                <button style={{...s.audioBtn, background:'rgba(239,68,68,0.2)', color:'#ef4444'}} onClick={stopSpeaking}>
                  ⏹ Stop Speaking
                </button>
              ) : (
                <button
                  style={{...s.audioBtn, background:'rgba(255,255,255,0.06)', color: lastAdaText ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.2)', cursor: lastAdaText ? 'pointer' : 'default'}}
                  onClick={() => lastAdaText && speakWithElevenLabs(lastAdaText)}
                  disabled={!lastAdaText}
                >
                  ▶ Read Last Answer
                </button>
              )}
            </div>

            <div style={s.adaLegal}>⚖️ Legal information only — not legal advice</div>
          </div>

          {/* CHAT PANEL */}
          <div style={s.chatPanel}>
            <div style={s.messages}>
              {messages.map((msg, i) => (
                <div key={i} style={msg.role === 'user' ? s.msgRowUser : s.msgRowAda}>
                  <div style={msg.role === 'user' ? s.bubbleUser : s.bubbleAda}>
                    {msg.content.split('\n').map((line, j) => (
                      <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                    ))}
                    {msg.role === 'assistant' && i > 0 && (
                      <button style={s.readBtn} onClick={() => speakWithElevenLabs(msg.content)}>
                        🔊 Hear Ada read this
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div style={s.msgRowAda}>
                  <div style={s.bubbleAda}>
                    <span style={s.typingDot}></span>
                    <span style={{...s.typingDot, animationDelay:'0.2s'}}></span>
                    <span style={{...s.typingDot, animationDelay:'0.4s'}}></span>
                  </div>
                </div>
              )}

              {/* EMAIL WALL */}
              {showEmailWall && (
                <div style={s.wall}>
                  <h3 style={s.wallTitle}>You&apos;ve used your 5 free questions</h3>
                  <p style={s.wallSub}>Sign up free for <strong>10 questions every month</strong> — no credit card needed.</p>
                  {wallDone ? (
                    <div style={s.wallSuccess}>✓ You&apos;re in! 10 questions/month, free forever.</div>
                  ) : (
                    <>
                      <div style={s.wallForm}>
                        <input style={s.wallInput} type="email" placeholder="your@email.com" value={wallEmail} onChange={e => setWallEmail(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleEmailSubmit()} />
                        <button style={s.wallBtn} onClick={handleEmailSubmit} disabled={wallSubmitting}>{wallSubmitting ? '...' : 'Get 10 Free/Month →'}</button>
                      </div>
                      <div style={s.wallOr}>or upgrade for unlimited access</div>
                      <a href="/signup?plan=unlimited" style={s.wallUpgrade}>Ada Unlimited — $4.99/month →</a>
                      <a href="/signup?plan=pro" style={s.wallUpgradePro}>IEP Pro — $9.99/month →</a>
                      <p style={s.wallNote}>No spam. Unsubscribe anytime.</p>
                    </>
                  )}
                </div>
              )}

              {showMonthlyLimit && (
                <div style={s.wall}>
                  <h3 style={s.wallTitle}>You&apos;ve used your 10 free questions this month</h3>
                  <p style={s.wallSub}>Upgrade to keep asking Ada — unlimited questions and full resource access.</p>
                  <a href="/signup?plan=unlimited" style={s.wallUpgrade}>Ada Unlimited — $4.99/month →</a>
                  <a href="/signup?plan=pro" style={s.wallUpgradePro}>IEP Pro — $9.99/month →</a>
                  <p style={s.wallNote}>Free questions reset on the 1st of each month.</p>
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={s.inputArea}>
              <div style={s.inputRow}>
                {speechSupported && (
                  <button
                    style={{...s.micBtn, background: isListening ? '#ef4444' : 'rgba(212,168,67,0.15)', border: isListening ? '2px solid #ef4444' : '2px solid rgba(212,168,67,0.4)'}}
                    onClick={isListening ? stopListening : startListening}
                    disabled={showEmailWall || showMonthlyLimit}
                  >
                    <span style={{fontSize:'22px'}}>{isListening ? '⏹' : '🎤'}</span>
                    <span style={s.micLabel}>{isListening ? 'Stop' : 'Speak'}</span>
                  </button>
                )}
                <textarea
                  style={s.textarea}
                  placeholder={isListening ? '🎤 Listening — speak clearly…' : "Type or speak your question…"}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
                  rows={2}
                  disabled={showEmailWall || showMonthlyLimit}
                />
                <button
                  style={{...s.sendBtn, opacity: loading || !input.trim() || showEmailWall || showMonthlyLimit ? 0.4 : 1}}
                  onClick={sendMessage}
                  disabled={loading || !input.trim() || showEmailWall || showMonthlyLimit}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
                  <span style={{fontSize:'10px', marginTop:'2px', fontWeight:700}}>Send</span>
                </button>
              </div>
              <div style={s.inputNote}>Enter to send · Shift+Enter for new line · 🎤 Tap Speak to use your voice</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes ripple { 0%{transform:scale(1);opacity:0.7} 100%{transform:scale(1.5);opacity:0} }
        @keyframes slideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        * { box-sizing:border-box; margin:0; padding:0; }
        body { font-family:'Outfit',sans-serif; background:#1E1035; }
        textarea { resize:none; font-family:'Outfit',sans-serif; }
        textarea:focus { outline:none; border-color:#D4A843 !important; }
        @media(max-width:680px) {
          #ada-panel { display:none !important; }
        }
      `}</style>
    </>
  )
}

const s = {
  page: { display:'flex', flexDirection:'column', height:'100vh', background:'#1E1035', fontFamily:"'Outfit',sans-serif" },
  nav: { background:'rgba(29,16,53,0.98)', borderBottom:'1px solid rgba(212,168,67,0.2)', padding:'0 24px', height:'52px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  backLink: { color:'rgba(255,255,255,0.5)', textDecoration:'none', fontSize:'13px' },
  navRight: { display:'flex', alignItems:'center', gap:'12px' },
  counterPill: { background:'rgba(212,168,67,0.15)', border:'1px solid rgba(212,168,67,0.3)', color:'#D4A843', fontSize:'11px', fontWeight:600, padding:'4px 12px', borderRadius:'100px' },
  main: { display:'flex', flex:1, overflow:'hidden' },
  adaPanel: { width:'200px', flexShrink:0, background:'rgba(0,0,0,0.3)', borderRight:'1px solid rgba(212,168,67,0.12)', display:'flex', flexDirection:'column', alignItems:'center', padding:'28px 14px 20px', gap:'6px' },
  adaAvatarWrap: { width:'130px', height:'130px', borderRadius:'50%', overflow:'hidden', position:'relative', transition:'box-shadow 0.4s ease', flexShrink:0 },
  adaAvatarImg: { width:'100%', height:'100%', objectFit:'cover' },
  speakingRing: { position:'absolute', inset:'-10px', borderRadius:'50%', border:'3px solid rgba(212,168,67,0.7)', animation:'ripple 1.2s ease-out infinite' },
  adaName: { fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:700, color:'#fff', marginTop:'10px' },
  adaTitle: { fontSize:'10px', color:'#D4A843', letterSpacing:'1px', textTransform:'uppercase', textAlign:'center' },
  adaStatusRow: { display:'flex', alignItems:'center', gap:'5px', fontSize:'11px', marginTop:'2px', transition:'color 0.3s' },
  statusDot: { width:'6px', height:'6px', borderRadius:'50%', display:'inline-block', animation:'pulse 2s infinite', transition:'background 0.3s' },
  audioSection: { width:'100%', display:'flex', flexDirection:'column', gap:'6px', marginTop:'16px', borderTop:'1px solid rgba(255,255,255,0.08)', paddingTop:'14px' },
  audioLabel: { fontSize:'10px', color:'rgba(255,255,255,0.3)', fontWeight:600, letterSpacing:'0.5px', textTransform:'uppercase', textAlign:'center', marginBottom:'2px' },
  audioBtn: { width:'100%', padding:'8px 10px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'11px', fontWeight:600, fontFamily:'Outfit,sans-serif', transition:'all 0.2s', textAlign:'center', lineHeight:1.4 },
  adaLegal: { fontSize:'9px', color:'rgba(255,255,255,0.18)', textAlign:'center', marginTop:'auto', lineHeight:1.5, paddingTop:'12px' },
  chatPanel: { flex:1, display:'flex', flexDirection:'column', overflow:'hidden' },
  messages: { flex:1, overflowY:'auto', padding:'20px 24px', display:'flex', flexDirection:'column', gap:'14px' },
  msgRowUser: { display:'flex', justifyContent:'flex-end' },
  msgRowAda: { display:'flex', justifyContent:'flex-start' },
  bubbleUser: { background:'#D4A843', color:'#1E1035', fontWeight:500, borderRadius:'18px 18px 4px 18px', padding:'13px 18px', fontSize:'14px', lineHeight:1.65, maxWidth:'75%' },
  bubbleAda: { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.92)', borderRadius:'18px 18px 18px 4px', border:'1px solid rgba(212,168,67,0.15)', padding:'13px 18px', fontSize:'14px', lineHeight:1.7, maxWidth:'82%', display:'flex', flexDirection:'column', gap:'6px' },
  readBtn: { background:'transparent', border:'none', color:'rgba(212,168,67,0.6)', fontSize:'11px', cursor:'pointer', padding:'4px 0 0', textAlign:'left', fontFamily:'Outfit,sans-serif', transition:'color 0.2s' },
  typingDot: { display:'inline-block', width:'7px', height:'7px', background:'rgba(255,255,255,0.4)', borderRadius:'50%', animation:'pulse 1.2s infinite', margin:'0 2px' },
  wall: { animation:'slideUp 0.3s ease', background:'rgba(45,27,78,0.97)', border:'2px solid #D4A843', borderRadius:'20px', padding:'28px', textAlign:'center', maxWidth:'480px', margin:'0 auto', width:'100%' },
  wallTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'20px', fontWeight:700, color:'#fff', marginBottom:'10px' },
  wallSub: { fontSize:'13px', color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:'20px' },
  wallForm: { display:'flex', gap:'8px', marginBottom:'14px', flexWrap:'wrap' },
  wallInput: { flex:1, minWidth:'180px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px', padding:'10px 13px', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#fff', outline:'none' },
  wallBtn: { background:'#D4A843', color:'#1E1035', border:'none', borderRadius:'8px', padding:'10px 16px', fontFamily:'Outfit,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
  wallOr: { fontSize:'11px', color:'rgba(255,255,255,0.3)', margin:'10px 0' },
  wallUpgrade: { display:'block', background:'rgba(212,168,67,0.15)', border:'1px solid rgba(212,168,67,0.4)', color:'#D4A843', borderRadius:'8px', padding:'10px 16px', fontSize:'13px', fontWeight:600, textDecoration:'none', marginBottom:'8px' },
  wallUpgradePro: { display:'block', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.12)', color:'rgba(255,255,255,0.6)', borderRadius:'8px', padding:'10px 16px', fontSize:'13px', fontWeight:600, textDecoration:'none', marginBottom:'10px' },
  wallSuccess: { color:'#4ade80', fontWeight:600, fontSize:'15px', padding:'14px' },
  wallNote: { fontSize:'11px', color:'rgba(255,255,255,0.25)' },
  inputArea: { background:'rgba(0,0,0,0.4)', borderTop:'1px solid rgba(212,168,67,0.15)', padding:'14px 20px 16px', flexShrink:0 },
  inputRow: { display:'flex', gap:'10px', alignItems:'flex-end', maxWidth:'900px', margin:'0 auto' },
  micBtn: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'58px', height:'58px', borderRadius:'14px', cursor:'pointer', flexShrink:0, transition:'all 0.2s', gap:'2px' },
  micLabel: { fontSize:'9px', color:'rgba(255,255,255,0.8)', fontWeight:700, letterSpacing:'0.5px' },
  textarea: { flex:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'14px', padding:'13px 16px', fontSize:'14px', color:'#fff', lineHeight:1.5, minHeight:'58px' },
  sendBtn: { display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', width:'58px', height:'58px', background:'#D4A843', border:'none', borderRadius:'14px', cursor:'pointer', color:'#1E1035', flexShrink:0, fontFamily:'Outfit,sans-serif', gap:'2px', transition:'opacity 0.2s' },
  inputNote: { textAlign:'center', fontSize:'10px', color:'rgba(255,255,255,0.2)', marginTop:'8px', maxWidth:'900px', margin:'8px auto 0' }
}
