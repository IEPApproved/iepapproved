// pages/ada.js — IEP Approved
// UPDATED: Guest signup nudge banner — slides up after first question, dismissible
// No other changes to existing functionality

import { useState, useRef, useEffect, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useLanguage } from '../context/LanguageContext';

const QUESTION_LIMIT_GUEST = 3;   // guests get 3 before nudge becomes hard wall
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
  const [showSettings, setShowSettings] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // ── NUDGE BANNER STATE ──────────────────────────────────────────────────────
  const [showNudge, setShowNudge] = useState(false);
  const [nudgeDismissed, setNudgeDismissed] = useState(false);

  const audioRef = useRef(null);
  const audioBlobUrlRef = useRef(null);
  const progressIntervalRef = useRef(null);
  const lastSpokenTextRef = useRef('');
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const chatBottomRef = useRef(null);
  const greetingPlayedRef = useRef(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('iep_question_count');
    const savedTier = localStorage.getItem('iep_user_tier');
    const nudgeSeen = localStorage.getItem('iep_nudge_dismissed');
    if (saved) setQuestionCount(parseInt(saved));
    if (savedTier) setUserTier(savedTier);
    if (nudgeSeen) setNudgeDismissed(true);
  }, []);

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

  useEffect(() => {
    return () => {
      stopAudio();
      if (recognitionRef.current) recognitionRef.current.abort();
    };
  }, [stopAudio]);

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

  useEffect(() => {
    if (!mounted) return;
    const greeting = lang === 'es'
      ? '¡Hola! Soy Ada, tu guía de leyes del IEP. Pregúntame cualquier cosa sobre los derechos de tu hijo bajo IDEA, la Sección 504 o la ADA.'
      : "Hello! I'm Ada, your IEP Approved AI Guide. Ask me anything about your child's rights under IDEA, Section 504, or ADA — in English or Spanish.";
    setMessages([{ role: 'assistant', content: greeting }]);
    if (!greetingPlayedRef.current && autoRead) {
      greetingPlayedRef.current = true;
      setTimeout(() => speakText(greeting, lang), 800);
    }
  }, [lang, mounted]);

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

    // Hard wall — show modal
    if (questionCount >= limit) {
      setShowLimitModal(true);
      return;
    }

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
      const reply = data.content || data.message || "I'm sorry, I had trouble with that. Please try again.";
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setIsThinking(false);
      if (autoRead) await speakText(reply, lang);

      // ── SHOW NUDGE BANNER after answer is delivered ──
      // Show after Q1 for guests, stay visible but dismissible
      if (userTier === 'guest' && !nudgeDismissed) {
        setTimeout(() => setShowNudge(true), 600);
      }

    } catch (err) {
      console.error('Ada error:', err);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'es' ? 'Lo siento, tuve un problema. Por favor intenta de nuevo.' : "I'm sorry, I had trouble with that. Please try again."
      }]);
    }
  };

  const dismissNudge = () => {
    setShowNudge(false);
    setNudgeDismissed(true);
    localStorage.setItem('iep_nudge_dismissed', '1');
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
        window.location.href = '/login?mode=signup&email=' + encodeURIComponent(limitEmail);
      }, 1500);
    } catch (err) { console.error(err); }
  };

  if (!mounted) return null;

  const limit = userTier === 'guest' ? QUESTION_LIMIT_GUEST : userTier === 'free' ? QUESTION_LIMIT_FREE : 999;
  const questionsLeft = Math.max(0, limit - questionCount);
  const isUrgent = userTier === 'guest' && questionsLeft <= 1;

  const formatTime = (secs) => {
    if (!secs || isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const PlayPauseBtn = ({ style }) => {
    if (isSpeaking) {
      return (
        <button onClick={togglePause} style={style || s.audioBtn}>
          {isPaused ? '▶ Play' : '⏸ Pause'}
        </button>
      );
    }
    return (
      <button onClick={() => lastSpokenTextRef.current && speakText(lastSpokenTextRef.current, lang)}
        style={style || s.audioBtn} disabled={!lastSpokenTextRef.current}>
        ▶ Play
      </button>
    );
  };

  const SettingsPanel = () => (
    <div style={s.settingsPanel}>
      <div style={s.volumeRow}>
        <span>🔉</span>
        <input type="range" min="0" max="1" step="0.05" value={volume}
          onChange={e => setVolume(parseFloat(e.target.value))} style={s.slider} />
        <span>🔊</span>
      </div>
      {isSpeaking && (
        <div style={s.progressRow}>
          <span style={s.timeText}>{formatTime(audioRef.current?.currentTime)}</span>
          <input type="range" min="0" max="100" value={audioProgress}
            onChange={handleScrub} style={s.slider} />
          <span style={s.timeText}>{formatTime(audioDuration)}</span>
        </div>
      )}
      <label style={s.autoLabel}>
        <input type="checkbox" checked={autoRead} onChange={e => setAutoRead(e.target.checked)} style={{marginRight:'6px'}} />
        {lang === 'es' ? 'Leer automáticamente' : 'Auto-Read'}
      </label>
    </div>
  );

  // ── NUDGE BANNER TEXT ────────────────────────────────────────────────────────
  const nudgeTitle = isUrgent
    ? (lang === 'es' ? '⚡ Última pregunta gratuita de hoy' : '⚡ That was your last free question today')
    : (lang === 'es' ? `💬 Te quedan ${questionsLeft} preguntas gratis hoy` : `💬 You have ${questionsLeft} free question${questionsLeft !== 1 ? 's' : ''} left today`);

  const nudgeSubtext = lang === 'es'
    ? 'Crea una cuenta gratuita y obtén 10 preguntas cada mes — sin tarjeta de crédito.'
    : 'Create a free account and get 10 questions every month — no credit card needed.';

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP law questions — free, bilingual, powered by AI." />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </Head>

      {/* ── TOP NAV ── */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <Link href="/" style={s.logoLink}>
            <img src="/logo.png" alt="IEP Approved" style={s.logo}
              onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
            <div style={{...s.logoFallback, display:'none'}}>
              <span style={s.logoIEP}>IEP</span>
              <span style={s.logoApp}>APPROVED</span>
            </div>
          </Link>
          {!isMobile && (
            <div style={s.navLinks}>
              <Link href="/#how-it-works" style={s.navLink}>How It Works</Link>
              <Link href="/storefront" style={s.navLink}>Storefront</Link>
              <Link href="/community" style={s.navLink}>Community</Link>
              <Link href="/contact" style={s.navLink}>Contact</Link>
              {userTier !== 'unlimited' && (
                <span style={s.qBadge}>{questionsLeft} {lang==='es'?'preguntas':'left'}</span>
              )}
              <button onClick={toggleLang} style={s.langToggle}>
                <span style={lang==='en'?s.langOn:s.langOff}>EN</span>
                <span style={s.langDiv}>|</span>
                <span style={lang==='es'?s.langOn:s.langOff}>ES</span>
              </button>
              {userTier !== 'unlimited' && (
                <Link href="/signup" style={s.upgradeBtn}>⭐ Ada Unlimited</Link>
              )}
            </div>
          )}
          {isMobile && (
            <div style={s.mobileNavRight}>
              {userTier !== 'unlimited' && (
                <span style={s.qBadgeSm}>{questionsLeft}</span>
              )}
              <button onClick={toggleLang} style={s.langToggleSm}>
                <span style={lang==='en'?s.langOn:s.langOff}>EN</span>
                <span style={s.langDiv}>|</span>
                <span style={lang==='es'?s.langOn:s.langOff}>ES</span>
              </button>
              {userTier !== 'unlimited' && (
                <Link href="/signup" style={s.upgradeBtnSm}>⭐</Link>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── MOBILE TOP BAR ── */}
      {isMobile && (
        <div style={s.mobileTopBar}>
          <div style={s.mobileAdaInfo}>
            <div style={{...s.mobileAvatar, boxShadow: isSpeaking ? '0 0 0 3px #D4A843' : 'none'}}>
              <img src="/ada-avatar.png" alt="Ada" style={s.mobileAvatarImg}
                onError={(e) => { e.target.style.display='none'; }} />
              <span style={s.mobileAvatarInit}>A</span>
            </div>
            <div>
              <div style={s.mobileAdaName}>Ada</div>
              <div style={s.mobileStatus}>
                <span style={{...s.statusDot, backgroundColor: isThinking?'#f59e0b':isSpeaking?'#D4A843':'#22c55e'}} />
                <span style={s.statusText}>
                  {isThinking?(lang==='es'?'Pensando...':'Thinking...'):isSpeaking?(lang==='es'?'Hablando...':'Speaking...'):(lang==='es'?'En línea':'Online')}
                </span>
              </div>
            </div>
          </div>
          <div style={s.mobileAudioRow}>
            <PlayPauseBtn style={s.mobileAudioBtn} />
            {isSpeaking && (
              <button onClick={stopAudio} style={s.mobileStopBtn}>⏹</button>
            )}
            <button onClick={() => setShowSettings(!showSettings)} style={s.settingsBtn}>⚙️</button>
          </div>
          {showSettings && <SettingsPanel />}
        </div>
      )}

      {/* ── MAIN LAYOUT ── */}
      <div style={isMobile ? s.pageMobile : s.pageDesktop}>

        {/* DESKTOP LEFT PANEL */}
        {!isMobile && (
          <div style={s.leftPanel}>
            <div style={{...s.adaRing, boxShadow: isSpeaking?'0 0 0 8px rgba(212,168,67,0.4)':'none'}}>
              <img src="/ada-avatar.png" alt="Ada" style={s.adaAvatar}
                onError={(e) => { e.target.style.display='none'; }} />
              <div style={s.adaInitials}>ADA</div>
            </div>
            <h2 style={s.adaName}>Ada</h2>
            <p style={s.adaSubtitle}>Your IEP Approved AI Guide</p>
            <div style={s.statusBadge}>
              <span style={{...s.statusDot, backgroundColor: isThinking?'#f59e0b':isSpeaking?'#D4A843':'#22c55e'}} />
              {isThinking?(lang==='es'?'Pensando...':'Thinking...'):isSpeaking?(lang==='es'?'Hablando...':'Speaking...'):(lang==='es'?'En línea':'Online')}
            </div>
            <div style={s.audioControls}>
              <div style={s.audioRow}>
                <PlayPauseBtn />
                {isSpeaking && <button onClick={stopAudio} style={s.stopBtn}>⏹ Stop</button>}
              </div>
              <SettingsPanel />
            </div>
            <p style={s.disclaimer}>Ada is not an attorney. IEP Approved provides legal information only.</p>
          </div>
        )}

        {/* CHAT PANEL */}
        <div style={isMobile ? s.chatPanelMobile : s.chatPanelDesktop}>
          <div style={isMobile ? s.chatAreaMobile : s.chatAreaDesktop}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role==='user' ? s.userBubble : s.adaBubble}>
                {msg.role === 'assistant' && <span style={s.adaLabel}>Ada</span>}
                <p style={s.msgText}>{msg.content}</p>
              </div>
            ))}
            {isThinking && (
              <div style={s.adaBubble}>
                <span style={s.adaLabel}>Ada</span>
                <div style={s.thinkingWrap}>
                  <div style={s.dot1} /><div style={s.dot2} /><div style={s.dot3} />
                  <span style={s.thinkingText}>
                    {lang === 'es' ? 'Buscando...' : 'Searching...'}
                  </span>
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>

          <div style={s.inputArea}>
            <textarea ref={inputRef} value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key==='Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder={lang==='es' ? 'Hazle una pregunta a Ada...' : 'Ask Ada a question...'}
              style={isMobile ? s.textareaMobile : s.textarea}
              rows={2} disabled={isThinking} />
            <button onClick={() => sendMessage()} disabled={isThinking || !input.trim()}
              style={isMobile ? s.sendBtnMobile : s.sendBtn}>
              {lang === 'es' ? 'Enviar' : 'Send'}
            </button>
          </div>

          <div style={isMobile ? s.micRowMobile : s.micRow}>
            <button onClick={() => isListeningEN ? stopListening() : startListening('en-US')}
              style={{...(isMobile ? s.micBtnMobile : s.micBtn), ...(isListeningEN ? s.micActive : {})}}>
              <span style={s.micIcon}>🎤</span>
              <span>{isListeningEN ? 'Listening...' : 'Speak to Ask Ada'}</span>
              {isListeningEN && <span style={s.recDot} />}
            </button>
            <button onClick={() => isListeningES ? stopListening() : startListening('es-ES')}
              style={{...(isMobile ? s.micBtnMobile : s.micBtn), ...s.micSpanish, ...(isListeningES ? s.micActive : {})}}>
              <span style={s.micIcon}>🎤</span>
              <span>{isListeningES ? 'Escuchando...' : 'Habla con Ada'}</span>
              {isListeningES && <span style={s.recDot} />}
            </button>
          </div>

          {userTier !== 'unlimited' && (
            <p style={s.counter}>
              {lang==='es' ? `${questionsLeft} preguntas restantes` : `${questionsLeft} questions remaining`}
              {' · '}
              <Link href="/signup" style={s.upgradeLink}>
                {lang==='es' ? 'Ada Sin Límites' : 'Get Ada Unlimited'}
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ── NUDGE BANNER ── slides up from bottom after first answer ── */}
      {showNudge && userTier === 'guest' && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 150,
          backgroundColor: isUrgent ? '#1a0f2e' : '#1a0f2e',
          borderTop: `2px solid ${isUrgent ? '#ef4444' : '#D4A843'}`,
          padding: '16px 20px',
          boxShadow: '0 -8px 32px rgba(0,0,0,0.5)',
          animation: 'slideUp 0.4s ease-out',
        }}>
          <button
            onClick={dismissNudge}
            style={{
              position: 'absolute', top: '12px', right: '16px',
              background: 'none', border: 'none', color: 'rgba(184,168,208,0.5)',
              fontSize: '18px', cursor: 'pointer', lineHeight: 1,
            }}
          >✕</button>

          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <p style={{
              color: isUrgent ? '#ef4444' : '#D4A843',
              fontWeight: '700', fontSize: '15px',
              fontFamily: 'Outfit, sans-serif', margin: '0 0 4px',
            }}>
              {nudgeTitle}
            </p>
            <p style={{
              color: '#b8a8d0', fontSize: '13px',
              fontFamily: 'Outfit, sans-serif', margin: '0 0 12px',
            }}>
              {nudgeSubtext}
            </p>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <Link href="/login?mode=signup" style={{
                backgroundColor: '#D4A843', color: '#2D1B4E',
                padding: '10px 20px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: '800',
                fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
              }}>
                {lang === 'es' ? 'Crear Cuenta Gratis' : 'Create Free Account'}
              </Link>
              <Link href="/signup" style={{
                backgroundColor: 'transparent',
                border: '1px solid #D4A843', color: '#D4A843',
                padding: '10px 20px', borderRadius: '8px',
                textDecoration: 'none', fontSize: '14px', fontWeight: '700',
                fontFamily: 'Outfit, sans-serif', whiteSpace: 'nowrap',
              }}>
                {lang === 'es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/mo'}
              </Link>
              <button onClick={dismissNudge} style={{
                background: 'none', border: 'none',
                color: 'rgba(184,168,208,0.5)', fontSize: '13px',
                fontFamily: 'Outfit, sans-serif', cursor: 'pointer',
                padding: '10px 4px', whiteSpace: 'nowrap',
              }}>
                {lang === 'es' ? 'Quizás después' : 'Maybe later'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIMIT MODAL */}
      {showLimitModal && (
        <div style={s.overlay} onClick={() => setShowLimitModal(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowLimitModal(false)} style={s.modalClose}>✕</button>
            <h3 style={s.modalTitle}>
              {lang==='es' ? 'Has alcanzado tu límite gratuito' : "You've reached your free limit"}
            </h3>
            <Link href="/signup" style={s.modalPrimary}>
              ⭐ {lang==='es' ? 'Ada Sin Límites — $4.99/mes' : 'Ada Unlimited — $4.99/month'}
            </Link>
            <div style={s.modalOr}>{lang==='es' ? '— o —' : '— or —'}</div>
            {!limitEmailSent ? (
              <form onSubmit={handleLimitSignup} style={s.modalForm}>
                <p style={s.modalFreeLabel}>
                  {lang==='es' ? 'Regístrate gratis — 10 preguntas/mes' : 'Sign up free — 10 questions/month'}
                </p>
                <input type="email" value={limitEmail} onChange={e=>setLimitEmail(e.target.value)}
                  placeholder={lang==='es'?'Tu correo electrónico':'Your email address'}
                  style={s.modalInput} required />
                <button type="submit" style={s.modalFreeBtn}>
                  {lang==='es' ? 'Continuar' : 'Continue →'}
                </button>
              </form>
            ) : (
              <p style={s.modalSuccess}>✅ {lang==='es'?'¡Listo! Redirigiendo...':'Done! Redirecting...'}</p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%,60%,100%{transform:translateY(0)}
          30%{transform:translateY(-8px)}
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        * { box-sizing: border-box; }
        input[type=range]{ accent-color:#D4A843; width:100%; }
        body { margin:0; overflow-x:hidden; }
      `}</style>
    </>
  );
}

const s = {
  nav:{position:'sticky',top:0,zIndex:100,backgroundColor:'#2D1B4E',borderBottom:'2px solid #D4A843',width:'100%'},
  navInner:{maxWidth:'1200px',margin:'0 auto',padding:'0 16px',height:'60px',display:'flex',alignItems:'center',justifyContent:'space-between'},
  logoLink:{textDecoration:'none',display:'flex',alignItems:'center',flexShrink:0},
  logo:{height:'40px',width:'auto',objectFit:'contain'},
  logoFallback:{alignItems:'center',gap:'3px'},
  logoIEP:{fontSize:'18px',fontWeight:'800',color:'#D4A843',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px'},
  logoApp:{fontSize:'18px',fontWeight:'800',color:'#fff',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px'},
  navLinks:{display:'flex',alignItems:'center',gap:'18px'},
  navLink:{color:'#e8e0f0',textDecoration:'none',fontSize:'14px',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  qBadge:{backgroundColor:'rgba(212,168,67,0.15)',border:'1px solid #D4A843',color:'#D4A843',padding:'3px 10px',borderRadius:'20px',fontSize:'12px',fontFamily:'Outfit,sans-serif',fontWeight:'600',whiteSpace:'nowrap'},
  langToggle:{background:'rgba(255,255,255,0.08)',border:'2px solid rgba(212,168,67,0.6)',borderRadius:'20px',padding:'5px 12px',cursor:'pointer',display:'flex',alignItems:'center',gap:'4px',fontSize:'13px',fontFamily:'Outfit,sans-serif',fontWeight:'700'},
  langOn:{color:'#D4A843'},
  langOff:{color:'rgba(255,255,255,0.3)'},
  langDiv:{color:'rgba(255,255,255,0.2)'},
  upgradeBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',padding:'7px 14px',borderRadius:'6px',textDecoration:'none',fontSize:'13px',fontWeight:'800',fontFamily:'Outfit,sans-serif',whiteSpace:'nowrap'},
  mobileNavRight:{display:'flex',alignItems:'center',gap:'10px'},
  qBadgeSm:{backgroundColor:'rgba(212,168,67,0.15)',border:'1px solid #D4A843',color:'#D4A843',padding:'3px 8px',borderRadius:'20px',fontSize:'11px',fontWeight:'600'},
  langToggleSm:{background:'rgba(255,255,255,0.08)',border:'2px solid rgba(212,168,67,0.6)',borderRadius:'20px',padding:'4px 10px',cursor:'pointer',display:'flex',alignItems:'center',gap:'3px',fontSize:'12px',fontFamily:'Outfit,sans-serif',fontWeight:'700'},
  upgradeBtnSm:{backgroundColor:'#D4A843',color:'#2D1B4E',padding:'6px 10px',borderRadius:'6px',textDecoration:'none',fontSize:'14px',fontWeight:'800'},
  mobileTopBar:{backgroundColor:'#1a0f2e',borderBottom:'1px solid rgba(212,168,67,0.2)',padding:'10px 16px',display:'flex',flexDirection:'column',gap:'10px'},
  mobileAdaInfo:{display:'flex',alignItems:'center',gap:'12px'},
  mobileAvatar:{width:'44px',height:'44px',borderRadius:'50%',border:'2px solid #D4A843',position:'relative',overflow:'hidden',backgroundColor:'#2D1B4E',flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center',transition:'box-shadow 0.3s'},
  mobileAvatarImg:{width:'100%',height:'100%',objectFit:'cover',position:'absolute'},
  mobileAvatarInit:{color:'#D4A843',fontSize:'16px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',zIndex:1},
  mobileAdaName:{color:'#D4A843',fontSize:'15px',fontWeight:'700',fontFamily:'Cormorant Garamond,serif'},
  mobileStatus:{display:'flex',alignItems:'center',gap:'5px',marginTop:'2px'},
  mobileAudioRow:{display:'flex',gap:'8px',alignItems:'center'},
  mobileAudioBtn:{flex:1,padding:'9px 12px',backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer'},
  mobileStopBtn:{padding:'9px 12px',backgroundColor:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',fontSize:'13px',cursor:'pointer'},
  settingsBtn:{padding:'9px 12px',backgroundColor:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.15)',borderRadius:'8px',fontSize:'16px',cursor:'pointer'},
  settingsPanel:{display:'flex',flexDirection:'column',gap:'8px',padding:'10px',backgroundColor:'rgba(255,255,255,0.03)',borderRadius:'8px',border:'1px solid rgba(212,168,67,0.15)'},
  volumeRow:{display:'flex',alignItems:'center',gap:'8px'},
  progressRow:{display:'flex',alignItems:'center',gap:'6px'},
  slider:{flex:1,cursor:'pointer'},
  timeText:{color:'#b8a8d0',fontSize:'11px',whiteSpace:'nowrap'},
  autoLabel:{color:'#b8a8d0',fontSize:'12px',cursor:'pointer',display:'flex',alignItems:'center'},
  statusDot:{width:'7px',height:'7px',borderRadius:'50%',flexShrink:0,transition:'background-color 0.3s'},
  statusText:{color:'#b8a8d0',fontSize:'11px'},
  leftPanel:{width:'250px',minWidth:'250px',backgroundColor:'#1a0f2e',borderRight:'1px solid rgba(212,168,67,0.2)',display:'flex',flexDirection:'column',alignItems:'center',padding:'24px 14px 20px',gap:'10px'},
  adaRing:{width:'90px',height:'90px',borderRadius:'50%',border:'3px solid #D4A843',display:'flex',alignItems:'center',justifyContent:'center',position:'relative',overflow:'hidden',backgroundColor:'#2D1B4E',marginBottom:'4px',transition:'box-shadow 0.3s'},
  adaAvatar:{width:'100%',height:'100%',objectFit:'cover',borderRadius:'50%',position:'absolute',zIndex:2},
  adaInitials:{color:'#D4A843',fontSize:'20px',fontWeight:'800',fontFamily:'Cormorant Garamond,serif',letterSpacing:'2px',zIndex:1,display:'none'},
  adaName:{color:'#D4A843',fontSize:'20px',fontFamily:'Cormorant Garamond,serif',fontWeight:'700',margin:0},
  adaSubtitle:{color:'#b8a8d0',fontSize:'11px',textAlign:'center',margin:0,lineHeight:'1.4'},
  statusBadge:{display:'flex',alignItems:'center',gap:'6px',backgroundColor:'rgba(255,255,255,0.05)',border:'1px solid rgba(255,255,255,0.1)',borderRadius:'20px',padding:'5px 12px',fontSize:'12px',color:'#e8e0f0'},
  audioControls:{width:'100%',display:'flex',flexDirection:'column',gap:'8px'},
  audioRow:{display:'flex',gap:'8px'},
  audioBtn:{flex:1,padding:'10px',backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',fontSize:'13px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer'},
  stopBtn:{padding:'10px 12px',backgroundColor:'rgba(239,68,68,0.15)',color:'#ef4444',border:'1px solid rgba(239,68,68,0.3)',borderRadius:'8px',fontSize:'13px',cursor:'pointer'},
  disclaimer:{color:'rgba(184,168,208,0.5)',fontSize:'10px',textAlign:'center',lineHeight:'1.5',marginTop:'auto',borderTop:'1px solid rgba(255,255,255,0.06)',paddingTop:'10px'},
  pageDesktop:{minHeight:'calc(100vh - 60px)',backgroundColor:'#0f0a1a',display:'flex',fontFamily:'Outfit,sans-serif',overflow:'hidden'},
  pageMobile:{minHeight:'calc(100vh - 60px)',backgroundColor:'#0f0a1a',display:'flex',flexDirection:'column',fontFamily:'Outfit,sans-serif',width:'100%',overflow:'hidden'},
  chatPanelDesktop:{flex:1,display:'flex',flexDirection:'column',maxWidth:'800px',margin:'0 auto',padding:'16px 20px 0',width:'100%'},
  chatPanelMobile:{flex:1,display:'flex',flexDirection:'column',padding:'12px 12px 0',width:'100%'},
  chatAreaDesktop:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'12px',paddingBottom:'10px',maxHeight:'calc(100vh - 280px)'},
  chatAreaMobile:{flex:1,overflowY:'auto',display:'flex',flexDirection:'column',gap:'10px',paddingBottom:'80px',maxHeight:'calc(100vh - 340px)'},
  adaBubble:{backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.2)',borderRadius:'12px 12px 12px 4px',padding:'12px 14px',maxWidth:'88%',alignSelf:'flex-start'},
  userBubble:{backgroundColor:'#2D1B4E',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'12px 12px 4px 12px',padding:'12px 14px',maxWidth:'80%',alignSelf:'flex-end'},
  adaLabel:{color:'#D4A843',fontSize:'10px',fontWeight:'700',letterSpacing:'1px',textTransform:'uppercase',display:'block',marginBottom:'5px'},
  msgText:{color:'#e8e0f0',fontSize:'15px',lineHeight:'1.6',margin:0,whiteSpace:'pre-wrap'},
  thinkingWrap:{display:'flex',alignItems:'center',gap:'5px',padding:'3px 0'},
  dot1:{width:'7px',height:'7px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite'},
  dot2:{width:'7px',height:'7px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite 0.2s'},
  dot3:{width:'7px',height:'7px',borderRadius:'50%',backgroundColor:'#D4A843',animation:'bounce 1.2s infinite 0.4s'},
  thinkingText:{color:'#b8a8d0',fontSize:'12px',marginLeft:'4px'},
  inputArea:{display:'flex',gap:'8px',alignItems:'flex-end',padding:'10px 0 0',borderTop:'1px solid rgba(212,168,67,0.15)'},
  textarea:{flex:1,backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'15px',fontFamily:'Outfit,sans-serif',padding:'10px 12px',resize:'none',outline:'none',lineHeight:'1.5'},
  textareaMobile:{flex:1,backgroundColor:'#1a0f2e',border:'1px solid rgba(212,168,67,0.3)',borderRadius:'8px',color:'#e8e0f0',fontSize:'16px',fontFamily:'Outfit,sans-serif',padding:'10px 12px',resize:'none',outline:'none',lineHeight:'1.5'},
  sendBtn:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',padding:'10px 18px',fontSize:'14px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer',whiteSpace:'nowrap',alignSelf:'flex-end'},
  sendBtnMobile:{backgroundColor:'#D4A843',color:'#2D1B4E',border:'none',borderRadius:'8px',padding:'10px 14px',fontSize:'14px',fontWeight:'700',fontFamily:'Outfit,sans-serif',cursor:'pointer',whiteSpace:'nowrap',alignSelf:'flex-end'},
  micRow:{display:'flex',gap:'10px',padding:'10px 0'},
  micRowMobile:{display:'flex',gap:'8px',padding:'10px 0'},
  micBtn:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',backgroundColor:'#1a0f2e',border:'2px solid rgba(212,168,67,0.4)',borderRadius:'10px',padding:'11px 14px',color:'#e8e0f0',fontSize:'13px',fontFamily:'Outfit,sans-serif',fontWeight:'600',cursor:'pointer',position:'relative'},
  micBtnMobile:{flex:1,display:'flex',alignItems:'center',justifyContent:'center',gap:'8px',backgroundColor:'#1a0f2e',border:'2px solid rgba(212,168,67,0.4)',borderRadius:'12px',padding:'16px 12px',color:'#e8e0f0',fontSize:'15px',fontFamily:'Outfit,sans-serif',fontWeight:'700',cursor:'pointer',position:'relative'},
  micSpanish:{borderColor:'rgba(212,168,67,0.7)',backgroundColor:'rgba(212,168,67,0.06)'},
  micActive:{backgroundColor:'rgba(212,168,67,0.15)',borderColor:'#D4A843',boxShadow:'0 0 12px rgba(212,168,67,0.3)'},
  micIcon:{fontSize:'18px'},
  recDot:{width:'8px',height:'8px',borderRadius:'50%',backgroundColor:'#ef4444',position:'absolute',top:'8px',right:'8px',animation:'bounce 1s infinite'},
  counter:{color:'rgba(184,168,208,0.6)',fontSize:'12px',textAlign:'center',padding:'4px 0 10px'},
  upgradeLink:{color:'#D4A843',textDecoration:'none',fontWeight:'700'},
  overlay:{position:'fixed',inset:0,backgroundColor:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:200,padding:'16px'},
  modal:{backgroundColor:'#1a0f2e',border:'2px solid #D4A843',borderRadius:'16px',padding:'32px 24px',maxWidth:'460px',width:'100%',textAlign:'center',position:'relative'},
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
