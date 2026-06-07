// pages/ada.js
// IEP Approved — Ada AI Chat Page
// Fixes: volume control, pause/resume, scrub, thinking bubbles, stop audio on new question

import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const QUESTION_LIMIT_GUEST = 5;
const QUESTION_LIMIT_FREE = 10;

function cleanForElevenLabs(text, lang = 'en') {
  let cleaned = text;
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  cleaned = cleaned.replace(/#{1,6}\s/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
  cleaned = cleaned.replace(/📖/g, '');
  cleaned = cleaned.replace(/§\s*/g, lang === 'es' ? 'sección ' : 'Section ');
  cleaned = cleaned.replace(/—/g, ', ');
  cleaned = cleaned.replace(/–/g, ', ');
  cleaned = cleaned.replace(/\.\.\./g, '. ');
  cleaned = cleaned.replace(/--/g, ', ');
  cleaned = cleaned.replace(/\(20 U\.S\.C\.[^)]*\)/gi, '');
  cleaned = cleaned.replace(/\(34 CFR[^)]*\)/gi, '');
  if (lang === 'es') {
    cleaned = cleaned.replace(/Section\s+504/gi, 'la Sección quinientos cuatro');
    cleaned = cleaned.replace(/\bIDEA\b/g, 'I-D-E-A');
    cleaned = cleaned.replace(/\bIEP\b/g, 'I-E-P');
    cleaned = cleaned.replace(/\b504\b/g, 'quinientos cuatro');
  }
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');
  cleaned = cleaned.replace(/  +/g, ' ');
  return cleaned.trim().substring(0, 2500);
}

export default function AdaPage() {
  const { lang, toggleLang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isListeningEN, setIsListeningEN] = useState(false);
  const [isListeningES, setIsListeningES] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const [volume, setVolume] = useState(0.7);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [questionCount, setQuestionCount] = useState(0);
  const [userTier, setUserTier] = useState('guest');
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitEmail, setLimitEmail] = useState('');
  const [limitEmailSent, setLimitEmailSent] = useState(false);

  const audioRef = useRef(null);
  const audioBlobUrlRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const chatBottomRef = useRef(null);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('iep_question_count');
    const savedTier = localStorage.getItem('iep_user_tier');
    if (saved) setQuestionCount(parseInt(saved));
    if (savedTier) setUserTier(savedTier);
  }, []);

  useEffect(() => {
    if (mounted) {
      const greeting = lang === 'es'
        ? '¡Hola! Soy Ada, tu guía de leyes del IEP. Pregúntame cualquier cosa sobre los derechos de tu hijo bajo IDEA, la Sección 504 o la ADA.'
        : "Hello! I'm Ada, your IEP law guide. Ask me anything about your child's rights under IDEA, Section 504, or ADA — in English or Spanish.";
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [lang, mounted]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (audioBlobUrlRef.current) {
      URL.revokeObjectURL(audioBlobUrlRef.current);
      audioBlobUrlRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    setAudioProgress(0);
    setAudioDuration(0);
  }, []);

  const togglePause = () => {
    if (!audioRef.current) return;
    if (isPaused) {
      audioRef.current.play();
      setIsPaused(false);
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(isNaN(pct) ? 0 : pct);
        }
      }, 200);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
      clearInterval(progressIntervalRef.current);
    }
  };

  const handleScrub = (e) => {
    if (!audioRef.current || !audioDuration) return;
    const pct = parseFloat(e.target.value);
    audioRef.current.currentTime = (pct / 100) * audioDuration;
    setAudioProgress(pct);
  };

  const speakText = useCallback(async (text, speakLang) => {
    stopAudio();
    lastSpokenTextRef.current = text;
    const cleaned = cleanForElevenLabs(text, speakLang || lang);
    try {
      setIsSpeaking(true);
      setIsPaused(false);
      setAudioProgress(0);
      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: cleaned, lang: speakLang || lang }),
      });
      if (!response.ok) throw new Error('TTS failed');
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      audioBlobUrlRef.current = url;
      const audio = new Audio(url);
      audio.volume = volume;
      audioRef.current = audio;
      audio.addEventListener('loadedmetadata', () => setAudioDuration(audio.duration));
      audio.addEventListener('ended', () => {
        setIsSpeaking(false);
        setIsPaused(false);
        setAudioProgress(0);
        clearInterval(progressIntervalRef.current);
        URL.revokeObjectURL(url);
        audioBlobUrlRef.current = null;
        audioRef.current = null;
      });
      audio.play();
      progressIntervalRef.current = setInterval(() => {
        if (audioRef.current && !audioRef.current.paused) {
          const pct = (audioRef.current.currentTime / audioRef.current.duration) * 100;
          setAudioProgress(isNaN(pct) ? 0 : pct);
        }
      }, 200);
    } catch (err) {
      console.error('TTS error:', err);
      setIsSpeaking(false);
    }
  }, [lang, volume, stopAudio]);

  const startListening = (micLang) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Please use Chrome for voice input.');
      return;
    }
    if (recognitionRef.current) recognitionRef.current.abort();
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = micLang;
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 3;
    if (micLang === 'en-US') { setIsListeningEN(true); setIsListeningES(false); }
    else { setIsListeningES(true); setIsListeningEN(false); }
    let finalTranscript = '';
    recognition.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      setInput(finalTranscript || interim);
    };
    recognition.onend = () => {
      setIsListeningEN(false);
      setIsListeningES(false);
      if (finalTranscript.trim()) {
        sendMessage(finalTranscript.trim());
        setInput('');
        finalTranscript = '';
      }
    };
    recognition.onerror = (e) => {
      console.error('Speech error:', e.error);
      setIsListeningEN(false);
      setIsListeningES(false);
    };
    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) recognitionRef.current.stop();
    setIsListeningEN(false);
    setIsListeningES(false);
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || isThinking) return;
    stopAudio();
    const limit = userTier === 'guest' ? QUESTION_LIMIT_GUEST : userTier === 'free' ? QUESTION_LIMIT_FREE : Infinity;
    if (questionCount >= limit) { setShowLimitModal(true); return; }
    setInput('');
    const newCount = questionCount + 1;
    setQuestionCount(newCount);
    localStorage.setItem('iep_question_count', newCount);
    const userMessage = { role: 'user', content: trimmed };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsThinking(true);
    try {
      const response = await fetch('/api/ada', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages, lang }),
      });
      const data = await response.json();
      const reply = data.content || "I'm sorry, I had trouble with that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsThinking(false);
      if (autoRead) await speakText(reply, lang);
    } catch (err) {
      console.error('Ada error:', err);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'es' ? 'Lo siento, tuve un problema. Por favor intenta de nuevo.' : "I'm sorry, I had trouble with that. Please try again."
      }]);
    }
  };

  const repeatLastResponse = () => {
    if (lastSpokenTextRef.current) speakText(lastSpokenTextRef.current, lang);
  };

  const handleLimitSignup = async (e) => {
    e.preventDefault();
    if (!limitEmail) return;
    try {
      await fetch('/api/email-signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: limitEmail, source: 'ada_limit' }),
      });
      setLimitEmailSent(true);
      setTimeout(() => {
        window.location.href = '/intake?email=' + encodeURIComponent(limitEmail);
      }, 1500);
    } catch (err) { console.error(err); }
  };

  if (!mounted) return null;

  const limit = userTier === 'guest' ? QUESTION_LIMIT_GUEST : userTier === 'free' ? QUESTION_LIMIT_FREE : 999;
  const questionsLeft = Math.max(0, limit - questionCount);

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP law questions — free, bilingual, powered by AI." />
      </Head>

      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link href="/" style={styles.logoLink}>
            <img src="/images/logo.png" alt="IEP Approved" style={styles.logo}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div style={{...styles.logoFallback, display:'none'}}>
              <span style={styles.logoIEP}>IEP</span>
              <span style={styles.logoApproved}>APPROVED</span>
            </div>
          </Link>
          <div style={styles.navLinks}>
            <Link href="/#how-it-works" style={styles.navLink}>How It Works</Link>
            <Link href="/storefront" style={styles.navLink}>Storefront</Link>
            <Link href="/community" style={styles.navLink}>Community</Link>
            <Link href="/contact" style={styles.navLink}>Contact</Link>
            {userTier !== 'unlimited' && (
              <span style={styles.qBadge}>{questionsLeft} {lang === 'es' ? 'preguntas' : 'left'}</span>
            )}
            <button onClick={toggleLang} style={styles.langToggle}>
              <span style={lang==='en' ? styles.langOn : styles.langOff}>EN</span>
              <span style={styles.langDiv}>|</span>
              <span style={lang==='es' ? styles.langOn : styles.langOff}>ES</span>
            </button>
            {userTier !== 'unlimited' && (
              <Link href="/signup" style={styles.upgradeBtn}>⭐ Ada Unlimited</Link>
            )}
          </div>
        </div>
      </nav>

      <div style={styles.page}>
        <div style={styles.leftPanel}>
          <div style={{...styles.adaRing, boxShadow: isSpeaking ? '0 0 0 8px rgba(212,168,67,0.4)' : 'none', transition:'box-shadow 0.3s'}}>
            <img src="/images/ada-avatar.png" alt="Ada" style={styles.adaAvatar}
              onError={(e) => { e.target.style.display='none'; }} />
            <div style={styles.adaInitials}>ADA</div>
          </div>
          <h2 style={styles.adaName}>Ada</h2>
          <p style={styles.adaSubtitle}>Your IEP Approved AI Guide</p>
          <div style={styles.statusBadge}>
            <span style={{...styles.statusDot, backgroundColor: isThinking ? '#f59e0b' : isSpeaking ? '#D4A843' : '#22c55e'}} />
            {isThinking ? (lang==='es'?'Pensando...':'Thinking...') : isSpeaking ? (lang==='es'?'Hablando...':'Speaking...') : (lang==='es'?'En línea':'Online')}
          </div>

          <div style={styles.audioControls}>
            <div style={styles.audioRow}>
              {isSpeaking ? (
                <button onClick={togglePause} style={styles.audioBtn}>
                  {isPaused ? '▶ Resume' : '⏸ Pause'}
                </button>
              ) : (
                <button onClick={repeatLastResponse} style={styles.audioBtn} disabled={!lastSpokenTextRef.current}>
                  ▶ Repeat
                </button>
              )}
              {isSpeaking && (
                <button onClick={stopAudio} style={styles.stopBtn}>⏹ Stop</button>
              )}
            </div>

            {isSpeaking && (
              <div style={styles.progressWrap}>
                <span style={styles.progressTime}>{formatTime(audioRef.current?.currentTime)}</span>
                <input type="range" min="0" max="100" value={audioProgress}
                  onChange={handleScrub} style={styles.progressBar} />
                <span style={styles.progressTime}>{formatTime(audioDuration)}</span>
              </div>
            )}

            <div style={styles.volumeRow}>
              <span style={styles.volIcon}>🔉</span>
              <input type="range" min="0" max="1" step="0.05" value={volume}
                onChange={e => setVolume(parseFloat(e.target.value))} style={styles.volumeSlider} />
              <span style={styles.volIcon}>🔊</span>
            </div>

            <label style={styles.autoReadLabel}>
              <input type="checkbox" checked={autoRead} onChange={e => setAutoRead(e.target.checked)} style={{marginRight:'6px'}} />
              {lang === 'es' ? 'Leer auto' : 'Auto-Read'}
            </label>
          </div>

          <p style={styles.disclaimer}>Ada is not an attorney. IEP Approved provides legal information only.</p>
        </div>

        <div style={styles.rightPanel}>
          <div style={styles.chatArea}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role==='user' ? styles.userBubble : styles.adaBubble}>
                {msg.role === 'assistant' && <span style={styles.adaLabel}>Ada</span>}
                <p style={styles.msgText}>{msg.content}</p>
              </div>
            ))}
            {isThinking && (
              <div style={styles.adaBubble}>
                <span style={styles.adaLabel}>Ada</span>
                <div style={styles.thinkingWrap}>
                  <div style={styles.dot1} />
                  <div style={styles.dot2} />
                  <div style={styles.dot3} />
                  <span style={styles.thinkingText}>
                    {lang === 'es' ? 'Buscando en la ley federal...' : 'Searching federal law...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div style={styles.inputArea}>
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={lang==='es' ? 'Hazle una pregunta a Ada...' : 'Ask Ada a question...'}
              style={styles.textarea} rows={2} disabled={isThinking} />
            <button onClick={() => sendMessage()} disabled={isThinking || !input.trim()} style={styles.sendBtn}>
              {lang === 'es' ? 'Enviar' : 'Send'}
            </button>
          </div>

          <div style={styles.micRow}>
            <button onClick={() => isListeningEN ? stopListening() : startListening('en-US')}
              style={{...styles.micBtn, ...(isListeningEN ? styles.micActive : {})}}>
              <span>🎤</span>
              <span>{isListeningEN ? 'Listening...' : 'Speak to Ask Ada'}</span>
              {isListeningEN && <span style={styles.recDot} />}
            </button>
            <button onClick={() => isListeningES ? stopListening() : startListening('es-ES')}
              style={{...styles.micBtn, ...styles.micSpanish, ...(isListeningES ? styles.micActive : {})}}>
              <span>🎤</span>
              <span>{isListeningES ? 'Escuchando...' : 'Habla con Ada'}</span>
              {isListeningES && <span style={styles.recDot} />}
            </button>
          </div>

          {userTier !== 'unlimited' && (
            <p style={styles.counter}>
              {lang==='es' ? `${questionsLeft} preguntas restantes` : `${questionsLeft} questions remaining`}
              {' · '}
              <Link href="/signup" style={styles.upgradeLink}>
                {lang==='es' ? 'Obtener Ada Sin Límites' : 'Get Ada Unlimited'}
              </Link>
            </p>
          )}
        </div>
      </div>

      {showLimitModal && (
        <div style={styles.overlay} onClick={() => setShowLimitModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLimitModal(false)} style={styles.modalClose}>✕</button>
            <h3 style={styles.modalTitle}>
              {lang==='es' ? 'Has alcanzado tu límite gratuito' : "You've reached your free limit"}
            </h3>
            <Link href="/signup" style={styles.modalPrimary}>
              ⭐ {lang==='es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/month'}
            </Link>
            <div style={styles.modalOr}>{lang==='es' ? '— o —' : '— or —'}</div>
            {!limitEmailSent ? (
              <form onSubmit={handleLimitSignup} style={styles.modalForm}>
                <p style={styles.modalFreeLabel}>
                  {lang==='es' ? 'Regístrate gratis — 10 preguntas/mes' : 'Sign up free — 10 questions/month'}
                </p>
                <input type="email" value={limitEmail} onChange={e=>setLimitEmail(e.target.value)}
                  placeholder={lang==='es'?'Tu correo electrónico':'Your email address'}
                  style={styles.modalInput} required />
                <button type="submit" style={styles.modalFreeBtn}>
                  {lang==='es' ? 'Continuar' : 'Continue'}
                </button>
              </form>
            ) : (
              <p style={styles.modalSuccess}>✅ {lang==='es'?'¡Listo! Redirigiendo...':'Done! Redirecting...'}</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-8px)}
        }
        input[type=range]{accent-color:#D4A843;}
      `}</style>
    </>
  );
}

const styles = {
  nav:{position:'sticky',top:0,zIndex:100,backgroundColor:'#2D1B4E',borderBottom:'2px solid #D4A843'},
  navInner:{maxWidth:'1200px',margin:'0 auto',padding:'0 24px',height:'68px',display:'flex',alignItems:'center',justifyContent:'space-between'},
  logoLink:{textDecoration:'none',display:'flex',alignItems:'center'},
  logo:{height:'44px',width:'auto',objectFit:'contain'},
  logoFallback:{alignItems:'center',gap:'4px'},
  logoIEP:{fontSize:'20px',fontWeight:'800',color:'#D4A843',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px'},
  logoApproved:{fontSize:'20px',fontWeight:'800',color:'#fff',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px'},
  navLinks:{display:'flex',alignItems:'center',gap:'20px'},
  navLink:{color:'#e8e0f0',textDecoration:'none',fontSize:'14px',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  qBadge:{backgroundColor:'rgba(212,168,67,0.15)',border:'1px solid #D4A843',color:'#D4A843',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontFamily:'Outfit,sans-serif',fontWeight:'600',whiteSpace:'nowrap'},
  langToggle:{background:'rgba(255,255,255,0.08)',border:'2px solid rgba(212,168,67,0.6)',borderRadius:'20px',padding:'6px 14px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',fontSize:'14px',fontFamily:'Outfit,sans-serif',fontWeight:'700'},
  langOn:{color:'#D4A843'},
  langOff:{color:'rgba(255,255,255,0.3)'},
  langDiv:{color:'rgba(255,255,255,0.2)'},
  upgradeBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',padding:'8px 16px',borderRadius:'6px',textDecoration:'none',fontSize:'13px',fontWeight:'800',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  page:{minHeight:'calc(100vh - 68px)',backgroundColor:'#0f0a1a',display:'flex',fontFamily:'Outfit,sans-serif'},
  leftPanel:{width:'260px',minWidth:'260px',backgroundColor:'#1a0f2e',borderRight:'1px solid rgba(212,168,67,0.2)',display:'flex',flexDirection:'column',alignItems:'center',padding:'28px 16px 20px',gap:'10px'},
  adaRing:{width:'96px',height:'96px',borderRadius:'50%',border:'3px solid #D4A843',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',backgroundColor:'#2D1B4E',marginBottom:'4px'},
  adaAvatar:{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',position:'absolute',zIndex:2},
  adaInitials:{color:'#D4A843',fontSize:'20px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px',zIndex:1},
  adaName:{color:'#D4A843',fontSize:'22px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:0},
  adaSubtitle:{color:'#b8a8d0',fontSize:'11px',textAlign:'center',margin:0,lineHeight:'1.4'},
  statusBadge:{display:'flex',alignItems:'center',gap:'6px',backgroundColor:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',padding:'5px 12px',fontSize:'12px',color:'#e8e0f0'},
  statusDot:{width:'8px',height:'8px',borderRadius:'50%',flexShrink:0,transition:'background-color 0.3s'},
  audioControls:{width:'100%',display:'flex',flexDirection:'column',gap:'8px',marginTop:'4px'},
  audioRow:{display:'flex',gap:'8px'},
  audioBtn:{flex:1,padding:'10px',backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer'},
  stopBtn:{padding:'10px 14px',backgroundColor:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',fontSize:'13px',fontWeight:'700',cursor:'pointer'},
  progressWrap:{display:'flex',alignItems:'center',gap:'6px'},
  progressTime:{color:'#b8a8d0',fontSize:'11px',whiteSpace:'nowrap'},
  progressBar:{flex:1,height:'4px',cursor:'pointer'},
  volumeRow:{display:'flex',alignItems:'center',gap:'8px'},
  volIcon:{fontSize:'16px'},
  volumeSlider:{flex:1,cursor:'pointer'},
  autoReadLabel:{color:'#b8a8d0',fontSize:'12px',cursor:'pointer',display:'flex',alignItems:'center'},
  disclaimer:{color:'rgba(184,168,208,0.5)',fontSize:'10px',textAlign:'center',lineHeight:'1.5',marginTop:'auto',borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'10px'},
  rightPanel:{flex:1,display:'flex',flexDirection:'column',maxWidth:'800px',margin:'0 auto',padding:'20px 24px 0'},
  chatArea:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'14px',paddingBottom:'12px',minHeight:'300px',maxHeight:'calc(100vh - 320px)'},
  adaBubble:{backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.2)',borderRadius:'12px 12px 12px 4px',padding:'14px 16px',maxWidth:'85%',alignSelf:'flex-start'},
  userBubble:{backgroundColor:'#2D1B4E',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'12px 12px 4px 12px',padding:'14px 16px',maxWidth:'75%',alignSelf:'flex-end'},
  adaLabel:{color:'#D4A843',fontSize:'11px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',display:'block',marginBottom:'6px'},
  msgText:{color:'#e8e0f0',fontSize:'15px',lineHeight:'1.6',margin:0,whiteSpace:'pre-wrap'},
  thinkingWrap:{display:'flex',alignItems:'center',gap:'6px',padding:'4px 0'},
  dot1:{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite'},
  dot2:{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite 0.2s'},
  dot3:{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite 0.4s'},
  thinkingText:{color:'#b8a8d0',fontSize:'12px',marginLeft:'4px'},
  inputArea:{display:'flex',gap:'10px',alignItems:'flex-end',padding:'14px 0 0',borderTop:'1px solid rgba(212,168,67,0.15)'},
  textarea:{flex:1,backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',fontFamily:'Outfit,sans-serif',padding:'12px 14px',resize:'none',outline:'none',lineHeight:'1.5'},
  sendBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',padding:'12px 20px',fontSize:'14px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer',whiteSpace:'nowrap',alignSelf:'flex-end'},
  micRow:{display:'flex',gap:'12px',padding:'12px 0'},
  micBtn:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',backgroundColor:'#1a0f2e',border:'2px solid rgba(212,168,67,0.4)',borderRadius:'10px',padding:'12px 16px',color:'#e8e0f0',fontSize:'13px',fontFamily:'Outfit,sans-serif',fontWeight:'600',cursor:'pointer',position:'relative'},
  micSpanish:{borderColor:'rgba(212,168,67,0.7)',backgroundColor:'rgba(212,168,67,0.06)'},
  micActive:{backgroundColor:'rgba(212,168,67,0.15)',borderColor:'#D4A843',boxShadow:'0 0 12px rgba(212,168,67,0.3)'},
  recDot:{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#ef4444',position:'absolute',top:'8px',right:'8px',animation:'bounce 1s infinite'},
  counter:{color:'rgba(184,168,208,0.6)',fontSize:'12px',textAlign:'center',padding:'4px 0 14px'},
  upgradeLink:{color:'#D4A843',textDecoration:'none',fontWeight:'700'},
  overlay:{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.75)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200},
  modal:{backgroundColor:'#1a0f2e',border:'2px solid #D4A843',borderRadius:'16px',padding:'36px 32px',maxWidth:'480px',width:'90%',textAlign:'center',position:'relative'},
  modalClose:{position:'absolute',top:'12px',right:'14px',background:'none',border:'none',color:'rgba(184,168,208,0.5)',fontSize:'18px',cursor:'pointer'},
  modalTitle:{color:'#e8e0f0',fontSize:'20px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',marginBottom:'20px'},
  modalPrimary:{display:'block',backgroundColor:'#D4A843',color:'#2D1B4E',padding:'16px 24px',borderRadius:'10px',textDecoration:'none',fontSize:'16px',fontWeight:'800',fontFamily:'Outfit,sans-serif',marginBottom:'16px'},
  modalOr:{color:'rgba(184,168,208,0.4)',fontSize:'13px',marginBottom:'14px'},
  modalFreeLabel:{color:'#b8a8d0',fontSize:'14px',marginBottom:'10px'},
  modalForm:{display:'flex',flexDirection:'column',gap:'10px'},
  modalInput:{backgroundColor:'#0f0a1a',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',padding:'12px 14px',fontFamily:'Outfit,sans-serif',outline:'none'},
  modalFreeBtn:{backgroundColor:'transparent',border:'2px solid rgba(212,168,67,0.5)',color:'#D4A843',padding:'12px',borderRadius:'8px',fontSize:'14px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer'},
  modalSuccess:{color:'#22c55e',fontSize:'16px',fontWeight:'600',padding:'16px'},
};
