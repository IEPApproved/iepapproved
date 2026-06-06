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

  // Audio states
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [autoSpeak, setAutoSpeak] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const [ttsSupported, setTtsSupported] = useState(false)

  const bottomRef = useRef(null)
  const recognitionRef = useRef(null)
  const synthRef = useRef(null)

  useEffect(() => {
    const u = getStorageCount()
    setUsage(u)
    // Check speech support
    if (typeof window !== 'undefined') {
      setSpeechSupported('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
      setTtsSupported('speechSynthesis' in window)
      synthRef.current = window.speechSynthesis
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
      fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
        .then(res => res.json())
        .then(data => {
          const reply = data.content
          setMessages(prev => [...prev, { role: 'assistant', content: reply }])
          setLoading(false)
          if (autoSpeak) speakText(reply)
        })
        .catch(() => { setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }]); setLoading(false) })
    }
  }, [router.isReady, router.query.q])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading, showEmailWall, showMonthlyLimit])

  // ── SPEECH TO TEXT ──
  const startListening = () => {
    if (!speechSupported) return
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onstart = () => setIsListening(true)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(prev => prev ? prev + ' ' + transcript : transcript)
    }
    recognition.onend = () => setIsListening(false)
    recognition.onerror = () => setIsListening(false)
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop()
    setIsListening(false)
  }

  // ── TEXT TO SPEECH ──
  const speakText = (text) => {
    if (!ttsSupported || !synthRef.current) return
    synthRef.current.cancel()
    // Clean text for speech — remove markdown-style formatting
    const cleanText = text
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/📖/g, '')
      .replace(/•/g, '')
      .trim()
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.92
    utterance.pitch = 1.05
    utterance.volume = 1
    // Try to use a natural female voice
    const voices = synthRef.current.getVoices()
    const preferred = voices.find(v =>
      v.name.includes('Samantha') ||
      v.name.includes('Karen') ||
      v.name.includes('Moira') ||
      v.name.includes('Google US English') ||
      (v.lang === 'en-US' && v.name.toLowerCase().includes('female'))
    ) || voices.find(v => v.lang === 'en-US') || voices[0]
    if (preferred) utterance.voice = preferred
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    synthRef.current.speak(utterance)
  }

  const stopSpeaking = () => {
    if (synthRef.current) synthRef.current.cancel()
    setIsSpeaking(false)
  }

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
      const res = await fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      const reply = data.content
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
      if (autoSpeak) speakText(reply)
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }])
    }
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
    setWallDone(true)
    setWallSubmitting(false)
    setTimeout(() => { setShowEmailWall(false); setWallDone(false) }, 1500)
  }

  const questionsLeft = usage.isGuest
    ? Math.max(0, GUEST_LIMIT - usage.count)
    : Math.max(0, FREE_MONTHLY_LIMIT - usage.count)

  const lastAdaMessage = [...messages].reverse().find(m => m.role === 'assistant')

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP and special education law questions." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>

      <div style={s.page}>
        {/* HEADER */}
        <div style={s.header}>
          <a href="/" style={s.backLink}>← IEP Approved</a>
          <div style={s.headerCenter}>
            <div style={s.headerAvatar}>
              <img src="/ada-avatar.png" alt="Ada" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
            </div>
            <div>
              <div style={s.headerName}>Ada</div>
              <div style={s.headerSub}>Federal IEP Law Guide</div>
            </div>
          </div>
          {/* Audio toggle */}
          <div style={s.audioControls}>
            {ttsSupported && (
              <button
                style={{...s.audioBtn, background: autoSpeak ? '#D4A843' : 'rgba(255,255,255,0.1)', color: autoSpeak ? '#1E1035' : 'rgba(255,255,255,0.6)'}}
                onClick={() => { setAutoSpeak(!autoSpeak); if (isSpeaking) stopSpeaking() }}
                title={autoSpeak ? 'Turn off auto-read' : 'Turn on auto-read'}
              >
                🔊
              </button>
            )}
            {isSpeaking && (
              <button style={{...s.audioBtn, background:'rgba(212,168,67,0.2)', color:'#D4A843'}} onClick={stopSpeaking} title="Stop speaking">
                ⏹
              </button>
            )}
            {!isSpeaking && lastAdaMessage && ttsSupported && (
              <button style={{...s.audioBtn, background:'rgba(255,255,255,0.08)', color:'rgba(255,255,255,0.5)'}} onClick={() => speakText(lastAdaMessage.content)} title="Read last response">
                ▶
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div style={s.messages}>
          <div style={s.disclaimer}>
            ⚖️ Ada provides legal <strong>information</strong>, not legal advice. For advice specific to your situation, consult a qualified special education attorney.
          </div>

          {/* Accessibility bar */}
          {(speechSupported || ttsSupported) && (
            <div style={s.accessBar}>
              <span style={s.accessLabel}>♿ Accessibility:</span>
              {speechSupported && <span style={s.accessTip}>🎤 Tap mic to speak your question</span>}
              {ttsSupported && <span style={s.accessTip}>🔊 Tap ▶ to hear Ada&apos;s answer read aloud</span>}
              {ttsSupported && <span style={s.accessTip}>Auto-read: <button style={{...s.accessToggle, background: autoSpeak ? '#D4A843' : 'transparent', color: autoSpeak ? '#1E1035' : '#D4A843'}} onClick={() => setAutoSpeak(!autoSpeak)}>{autoSpeak ? 'ON' : 'OFF'}</button></span>}
            </div>
          )}

          {/* Question counter */}
          {!showEmailWall && !showMonthlyLimit && (
            <div style={s.counter}>
              {usage.isGuest
                ? `${questionsLeft} free question${questionsLeft !== 1 ? 's' : ''} remaining — sign up free for 10/month`
                : questionsLeft > 3
                  ? `${questionsLeft} questions remaining this month`
                  : questionsLeft > 0
                    ? `⚠️ Only ${questionsLeft} question${questionsLeft !== 1 ? 's' : ''} left this month`
                    : `Monthly limit reached — upgrade to continue`
              }
              {!usage.email && <a href="#" onClick={e => { e.preventDefault(); setShowEmailWall(true) }} style={s.counterLink}> Sign up free →</a>}
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? s.msgRowUser : s.msgRowAda}>
              {msg.role === 'assistant' && (
                <div style={s.adaAvatar}>
                  <img src="/ada-avatar.png" alt="Ada" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                </div>
              )}
              <div style={{position:'relative', maxWidth: msg.role === 'user' ? '75%' : '80%'}}>
                <div style={msg.role === 'user' ? s.bubbleUser : s.bubbleAda}>
                  {msg.content.split('\n').map((line, j) => (
                    <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                  ))}
                </div>
                {/* Read aloud button on each Ada message */}
                {msg.role === 'assistant' && ttsSupported && i > 0 && (
                  <button
                    style={s.readBtn}
                    onClick={() => speakText(msg.content)}
                    title="Read this answer aloud"
                  >
                    🔊 Read aloud
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div style={s.msgRowAda}>
              <div style={s.adaAvatar}>
                <img src="/ada-avatar.png" alt="Ada" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
              </div>
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
              <div style={s.wallInner}>
                <div style={s.wallAvatar}>
                  <img src="/ada-avatar.png" alt="Ada" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                </div>
                <h3 style={s.wallTitle}>You&apos;ve used your 5 free questions</h3>
                <p style={s.wallSub}>Sign up free to get <strong>10 questions every month</strong> — no credit card required. Or upgrade to Ada Unlimited for just $4.99/month.</p>
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
                    <a href="/signup?plan=pro" style={s.wallUpgradePro}>IEP Pro — $9.99/month (Ada + all resources) →</a>
                    <p style={s.wallNote}>No spam. Unsubscribe anytime.</p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* MONTHLY LIMIT WALL */}
          {showMonthlyLimit && (
            <div style={s.wall}>
              <div style={s.wallInner}>
                <div style={s.wallAvatar}>
                  <img src="/ada-avatar.png" alt="Ada" style={{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%'}} />
                </div>
                <h3 style={s.wallTitle}>You&apos;ve used your 10 free questions this month</h3>
                <p style={s.wallSub}>Upgrade to keep asking Ada — unlimited questions, deeper law knowledge, and access to all our resources.</p>
                <a href="/signup?plan=unlimited" style={s.wallUpgrade}>Ada Unlimited — $4.99/month →</a>
                <a href="/signup?plan=pro" style={s.wallUpgradePro}>IEP Pro — $9.99/month (Ada + all downloads + community) →</a>
                <p style={s.wallNote}>Your free questions reset on the 1st of next month.</p>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={s.inputArea}>
          <div style={s.inputRow}>
            {/* Mic button */}
            {speechSupported && (
              <button
                style={{...s.micBtn, background: isListening ? '#ef4444' : 'rgba(255,255,255,0.1)', border: isListening ? '2px solid #ef4444' : '2px solid rgba(255,255,255,0.15)'}}
                onClick={isListening ? stopListening : startListening}
                disabled={showEmailWall || showMonthlyLimit}
                title={isListening ? 'Stop listening' : 'Speak your question'}
              >
                {isListening ? '⏹' : '🎤'}
              </button>
            )}
            <textarea
              style={s.textarea}
              placeholder={isListening ? '🎤 Listening… speak your question' : "Ask Ada about your child's IEP rights…"}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              rows={1}
              disabled={showEmailWall || showMonthlyLimit}
            />
            <button
              style={{...s.sendBtn, opacity: loading || !input.trim() || showEmailWall || showMonthlyLimit ? 0.5 : 1}}
              onClick={sendMessage}
              disabled={loading || !input.trim() || showEmailWall || showMonthlyLimit}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
          <div style={s.inputNote}>
            {isListening ? '🎤 Listening — speak clearly, then tap stop' : 'Press Enter to send · Shift+Enter for new line · 🎤 Tap mic to speak'}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes slideUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }
        * { box-sizing: border-box; margin:0; padding:0; }
        body { font-family:'Outfit',sans-serif; background:#1E1035; }
        textarea { resize:none; font-family:'Outfit',sans-serif; }
        textarea:focus { outline:none; border-color:#D4A843 !important; }
      `}</style>
    </>
  )
}

const s = {
  page: { display:'flex', flexDirection:'column', height:'100vh', background:'#1E1035', fontFamily:"'Outfit',sans-serif" },
  header: { background:'rgba(29,16,53,0.98)', borderBottom:'1px solid rgba(212,168,67,0.2)', padding:'0 16px 0 24px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, gap:'12px' },
  backLink: { color:'rgba(255,255,255,0.45)', textDecoration:'none', fontSize:'13px', whiteSpace:'nowrap' },
  headerCenter: { display:'flex', alignItems:'center', gap:'10px', flex:1, justifyContent:'center' },
  headerAvatar: { width:'36px', height:'36px', borderRadius:'50%', overflow:'hidden', flexShrink:0 },
  headerName: { color:'#fff', fontSize:'15px', fontWeight:600 },
  headerSub: { color:'#D4A843', fontSize:'11px' },
  audioControls: { display:'flex', alignItems:'center', gap:'6px' },
  audioBtn: { width:'32px', height:'32px', borderRadius:'8px', border:'none', cursor:'pointer', fontSize:'14px', display:'flex', alignItems:'center', justifyContent:'center', transition:'all 0.2s' },
  messages: { flex:1, overflowY:'auto', padding:'16px 24px', display:'flex', flexDirection:'column', gap:'14px', maxWidth:'760px', width:'100%', margin:'0 auto' },
  disclaimer: { background:'rgba(212,168,67,0.1)', border:'1px solid rgba(212,168,67,0.2)', borderRadius:'10px', padding:'10px 14px', fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 },
  accessBar: { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:'10px', padding:'8px 14px', display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center' },
  accessLabel: { fontSize:'11px', color:'rgba(255,255,255,0.4)', fontWeight:600 },
  accessTip: { fontSize:'11px', color:'rgba(255,255,255,0.5)', display:'flex', alignItems:'center', gap:'4px' },
  accessToggle: { border:'1px solid #D4A843', borderRadius:'4px', padding:'1px 8px', fontSize:'11px', fontWeight:700, cursor:'pointer', transition:'all 0.2s' },
  counter: { background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:'8px', padding:'8px 14px', fontSize:'12px', color:'rgba(255,255,255,0.5)', textAlign:'center' },
  counterLink: { color:'#D4A843', textDecoration:'none', fontWeight:600 },
  msgRowUser: { display:'flex', justifyContent:'flex-end' },
  msgRowAda: { display:'flex', alignItems:'flex-start', gap:'10px' },
  adaAvatar: { width:'32px', height:'32px', borderRadius:'50%', overflow:'hidden', flexShrink:0, marginTop:'2px' },
  bubbleUser: { background:'#D4A843', color:'#1E1035', fontWeight:500, borderRadius:'16px 16px 4px 16px', padding:'12px 16px', fontSize:'14px', lineHeight:1.6 },
  bubbleAda: { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', borderRadius:'16px 16px 16px 4px', border:'1px solid rgba(212,168,67,0.15)', padding:'12px 16px', fontSize:'14px', lineHeight:1.65, display:'flex', gap:'4px', alignItems:'center', flexWrap:'wrap' },
  readBtn: { display:'inline-block', marginTop:'6px', background:'transparent', border:'none', color:'rgba(212,168,67,0.6)', fontSize:'11px', cursor:'pointer', padding:'2px 0' },
  typingDot: { display:'inline-block', width:'7px', height:'7px', background:'rgba(255,255,255,0.4)', borderRadius:'50%', animation:'pulse 1.2s infinite' },
  wall: { animation:'slideUp 0.3s ease', background:'rgba(45,27,78,0.95)', border:'2px solid #D4A843', borderRadius:'20px', padding:'32px', textAlign:'center' },
  wallInner: { maxWidth:'420px', margin:'0 auto' },
  wallAvatar: { width:'64px', height:'64px', borderRadius:'50%', overflow:'hidden', margin:'0 auto 16px', border:'3px solid #D4A843' },
  wallTitle: { fontFamily:"'Cormorant Garamond',serif", fontSize:'22px', fontWeight:700, color:'#fff', marginBottom:'12px', lineHeight:1.3 },
  wallSub: { fontSize:'14px', color:'rgba(255,255,255,0.7)', lineHeight:1.6, marginBottom:'24px' },
  wallForm: { display:'flex', gap:'8px', marginBottom:'16px', flexWrap:'wrap' },
  wallInput: { flex:1, minWidth:'200px', background:'rgba(255,255,255,0.1)', border:'1px solid rgba(255,255,255,0.2)', borderRadius:'8px', padding:'11px 14px', fontFamily:'Outfit,sans-serif', fontSize:'13px', color:'#fff', outline:'none' },
  wallBtn: { background:'#D4A843', color:'#1E1035', border:'none', borderRadius:'8px', padding:'11px 18px', fontFamily:'Outfit,sans-serif', fontSize:'13px', fontWeight:700, cursor:'pointer', whiteSpace:'nowrap' },
  wallOr: { fontSize:'12px', color:'rgba(255,255,255,0.3)', margin:'12px 0' },
  wallUpgrade: { display:'block', background:'rgba(212,168,67,0.15)', border:'1px solid rgba(212,168,67,0.4)', color:'#D4A843', borderRadius:'8px', padding:'11px 18px', fontSize:'13px', fontWeight:600, textDecoration:'none', marginBottom:'8px' },
  wallUpgradePro: { display:'block', background:'rgba(255,255,255,0.05)', border:'1px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.7)', borderRadius:'8px', padding:'11px 18px', fontSize:'13px', fontWeight:600, textDecoration:'none', marginBottom:'12px' },
  wallSuccess: { color:'#4ade80', fontWeight:600, fontSize:'15px', padding:'16px' },
  wallNote: { fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'8px' },
  inputArea: { background:'rgba(0,0,0,0.3)', borderTop:'1px solid rgba(212,168,67,0.15)', padding:'14px 24px 18px', flexShrink:0 },
  inputRow: { display:'flex', gap:'8px', maxWidth:'760px', margin:'0 auto', alignItems:'flex-end' },
  micBtn: { width:'46px', height:'46px', borderRadius:'12px', cursor:'pointer', fontSize:'18px', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'all 0.2s' },
  textarea: { flex:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'#fff', lineHeight:1.5 },
  sendBtn: { width:'46px', height:'46px', background:'#D4A843', border:'none', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#1E1035', flexShrink:0 },
  inputNote: { textAlign:'center', fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'8px', maxWidth:'760px', margin:'8px auto 0' }
}
