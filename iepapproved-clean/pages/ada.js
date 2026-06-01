import Head from 'next/head'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'

export default function AdaPage() {
  const router = useRouter()
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi, I'm Ada — your IEP Approved AI guide to federal special education law. I can help you understand your child's rights under IDEA, ADA, and Section 504.\n\nWhat would you like to know?"
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
  if (!router.isReady) return
  if (router.query.q) {
    const question = router.query.q
    setInput('')
    const newMessages = [
      { role: 'assistant', content: "Hi, I'm Ada — your IEP Approved AI guide to federal special education law. I can help you understand your child's rights under IDEA, ADA, and Section 504.\n\nWhat would you like to know?" },
      { role: 'user', content: question }
    ]
    setMessages(newMessages)
    setLoading(true)
    fetch('/api/ada', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: newMessages })
    })
      .then(res => res.json())
      .then(data => {
        setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
        setLoading(false)
      })
      .catch(() => {
        setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }])
        setLoading(false)
      })
  }
}, [router.isReady, router.query.q])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return
    setInput('')
    const newMessages = [...messages, { role: 'user', content: text }]
    setMessages(newMessages)
    setLoading(true)
    try {
      const res = await fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages })
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.content }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'I encountered an error. Please try again.' }])
    }
    setLoading(false)
  }

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP and special education law questions. Ada knows IDEA, ADA, and Section 504." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,700;1,400&family=Outfit:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <div style={s.page}>
        {/* HEADER */}
        <div style={s.header}>
          <a href="/" style={s.backLink}>← IEP Approved</a>
          <div style={s.headerCenter}>
            <div style={s.headerAvatar}>A</div>
            <div>
              <div style={s.headerName}>Ada</div>
              <div style={s.headerSub}>Federal IEP Law Guide</div>
            </div>
          </div>
          <div style={s.onlineStatus}><span style={s.onlineDot}></span>Online</div>
        </div>

        {/* MESSAGES */}
        <div style={s.messages}>
          <div style={s.disclaimer}>
            ⚖️ Ada provides legal <strong>information</strong>, not legal advice. For advice specific to your situation, consult a qualified special education attorney.
          </div>
          {messages.map((msg, i) => (
            <div key={i} style={msg.role === 'user' ? s.msgRowUser : s.msgRowAda}>
              {msg.role === 'assistant' && <div style={s.adaAvatar}>A</div>}
              <div style={msg.role === 'user' ? s.bubbleUser : s.bubbleAda}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>{line}{j < msg.content.split('\n').length - 1 && <br />}</span>
                ))}
              </div>
            </div>
          ))}
          {loading && (
            <div style={s.msgRowAda}>
              <div style={s.adaAvatar}>A</div>
              <div style={s.bubbleAda}>
                <span style={s.typingDot}></span>
                <span style={{...s.typingDot, animationDelay:'0.2s'}}></span>
                <span style={{...s.typingDot, animationDelay:'0.4s'}}></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div style={s.inputArea}>
          <div style={s.inputRow}>
            <textarea
              style={s.textarea}
              placeholder="Ask Ada about your child's IEP rights…"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
              rows={1}
            />
            <button style={{...s.sendBtn, opacity: loading || !input.trim() ? 0.5 : 1}} onClick={sendMessage} disabled={loading || !input.trim()}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/></svg>
            </button>
          </div>
          <div style={s.inputNote}>Press Enter to send · Shift+Enter for new line</div>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
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
  header: { background:'rgba(29,16,53,0.98)', borderBottom:'1px solid rgba(212,168,67,0.2)', padding:'0 24px', height:'64px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 },
  backLink: { color:'rgba(255,255,255,0.45)', textDecoration:'none', fontSize:'13px', transition:'color 0.2s' },
  headerCenter: { display:'flex', alignItems:'center', gap:'10px' },
  headerAvatar: { width:'36px', height:'36px', background:'#D4A843', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond',serif", fontSize:'18px', fontWeight:700, color:'#1E1035' },
  headerName: { color:'#fff', fontSize:'15px', fontWeight:600 },
  headerSub: { color:'#D4A843', fontSize:'11px' },
  onlineStatus: { display:'flex', alignItems:'center', gap:'6px', fontSize:'12px', color:'#4ade80' },
  onlineDot: { display:'inline-block', width:'7px', height:'7px', background:'#4ade80', borderRadius:'50%', animation:'pulse 2s infinite' },
  messages: { flex:1, overflowY:'auto', padding:'24px', display:'flex', flexDirection:'column', gap:'16px', maxWidth:'760px', width:'100%', margin:'0 auto' },
  disclaimer: { background:'rgba(212,168,67,0.1)', border:'1px solid rgba(212,168,67,0.2)', borderRadius:'10px', padding:'12px 16px', fontSize:'12px', color:'rgba(255,255,255,0.6)', lineHeight:1.6 },
  msgRowUser: { display:'flex', justifyContent:'flex-end' },
  msgRowAda: { display:'flex', alignItems:'flex-start', gap:'10px' },
  adaAvatar: { width:'32px', height:'32px', background:'#D4A843', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'Cormorant Garamond',serif", fontSize:'16px', fontWeight:700, color:'#1E1035', flexShrink:0, marginTop:'2px' },
  bubbleUser: { background:'#D4A843', color:'#1E1035', fontWeight:500, borderRadius:'16px 16px 4px 16px', padding:'12px 16px', fontSize:'14px', lineHeight:1.6, maxWidth:'75%' },
  bubbleAda: { background:'rgba(255,255,255,0.07)', color:'rgba(255,255,255,0.9)', borderRadius:'16px 16px 16px 4px', border:'1px solid rgba(212,168,67,0.15)', padding:'12px 16px', fontSize:'14px', lineHeight:1.65, maxWidth:'80%', display:'flex', gap:'4px', alignItems:'center', flexWrap:'wrap' },
  typingDot: { display:'inline-block', width:'7px', height:'7px', background:'rgba(255,255,255,0.4)', borderRadius:'50%', animation:'pulse 1.2s infinite' },
  inputArea: { background:'rgba(0,0,0,0.3)', borderTop:'1px solid rgba(212,168,67,0.15)', padding:'16px 24px 20px', flexShrink:0 },
  inputRow: { display:'flex', gap:'10px', maxWidth:'760px', margin:'0 auto' },
  textarea: { flex:1, background:'rgba(255,255,255,0.08)', border:'1px solid rgba(255,255,255,0.15)', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'#fff', lineHeight:1.5 },
  sendBtn: { width:'46px', height:'46px', background:'#D4A843', border:'none', borderRadius:'12px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#1E1035', flexShrink:0, transition:'opacity 0.2s' },
  inputNote: { textAlign:'center', fontSize:'11px', color:'rgba(255,255,255,0.25)', marginTop:'8px', maxWidth:'760px', margin:'8px auto 0' }
}
