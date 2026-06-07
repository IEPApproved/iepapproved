// pages/ada.js
// IEP Approved — Ada AI Chat Page
// Updates: dual EN/ES mic buttons, Spanish voice cleaning fix, bilingual greeting, full nav

import { useState, useRef, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import { useLanguage } from '../context/LanguageContext';

const ELEVENLABS_VOICE_ID = '9q9xpGHwmkXdA4JI72IU';
const QUESTION_LIMIT_GUEST = 5;
const QUESTION_LIMIT_FREE = 10;

// ─── SPANISH TEXT CLEANER ─────────────────────────────────────────────────────
// Fixes: punctuation read aloud, English numbers in Spanish, speed issues
function cleanForElevenLabs(text, lang = 'en') {
  let cleaned = text;

  // Remove markdown formatting
  cleaned = cleaned.replace(/\*\*(.*?)\*\*/g, '$1');
  cleaned = cleaned.replace(/\*(.*?)\*/g, '$1');
  cleaned = cleaned.replace(/#{1,6}\s/g, '');
  cleaned = cleaned.replace(/`([^`]+)`/g, '$1');

  // Remove legal symbols that get narrated
  cleaned = cleaned.replace(/§\s*/g, lang === 'es' ? 'sección ' : 'Section ');
  cleaned = cleaned.replace(/—/g, ', ');
  cleaned = cleaned.replace(/–/g, ', ');
  cleaned = cleaned.replace(/\.\.\./g, '. ');

  if (lang === 'es') {
    // Fix section references — "Section 504" → "la Sección 504"
    cleaned = cleaned.replace(/Section\s+504/gi, 'la Sección quinientos cuatro');
    cleaned = cleaned.replace(/Section\s+(\d+)/gi, (_, n) => `la Sección ${n}`);

    // Fix IDEA acronym pronunciation
    cleaned = cleaned.replace(/\bIDEA\b/g, 'I-D-E-A');
    cleaned = cleaned.replace(/\bIEP\b/g, 'I-E-P');
    cleaned = cleaned.replace(/\bADA\b/g, 'A-D-A');
    cleaned = cleaned.replace(/\bFAPE\b/g, 'F-A-P-E');
    cleaned = cleaned.replace(/\bLRE\b/g, 'L-R-E');

    // Numbers that should be spelled in Spanish context
    // (ElevenLabs multilingual handles most, but these cause issues)
    cleaned = cleaned.replace(/\b504\b/g, 'quinientos cuatro');

    // Remove double dashes that cause pauses/speed issues
    cleaned = cleaned.replace(/--/g, ', ');

    // Fix parenthetical citations that cause choppy cadence
    cleaned = cleaned.replace(/\(20 U\.S\.C\.[^)]*\)/gi, '');
    cleaned = cleaned.replace(/\(34 CFR[^)]*\)/gi, '');
    cleaned = cleaned.replace(/\([^)]{0,8}\)/g, ''); // short parentheticals
  } else {
    // English cleaning
    cleaned = cleaned.replace(/\(20 U\.S\.C\.[^)]*\)/gi, '');
    cleaned = cleaned.replace(/\(34 CFR[^)]*\)/gi, '');
    cleaned = cleaned.replace(/--/g, ', ');
  }

  // Remove URLs
  cleaned = cleaned.replace(/https?:\/\/\S+/g, '');

  // Collapse multiple spaces/newlines
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');
  cleaned = cleaned.replace(/  +/g, ' ');

  return cleaned.trim();
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function AdaPage() {
  const { lang, t } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListeningEN, setIsListeningEN] = useState(false);
  const [isListeningES, setIsListeningES] = useState(false);
  const [autoRead, setAutoRead] = useState(true);
  const [questionCount, setQuestionCount] = useState(0);
  const [userTier, setUserTier] = useState('guest'); // guest | free | unlimited
  const [showLimitModal, setShowLimitModal] = useState(false);
  const [limitEmail, setLimitEmail] = useState('');
  const [limitEmailSent, setLimitEmailSent] = useState(false);

  const audioRef = useRef(null);
  const audioContextRef = useRef(null);
  const currentAudioSourceRef = useRef(null);
  const chatBottomRef = useRef(null);
  const recognitionRef = useRef(null);
  const inputRef = useRef(null);
  const lastSpokenTextRef = useRef('');

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('iep_question_count');
    const savedTier = localStorage.getItem('iep_user_tier');
    if (saved) setQuestionCount(parseInt(saved));
    if (savedTier) setUserTier(savedTier);
  }, []);

  useEffect(() => {
    // Show greeting in current language when lang changes
    if (mounted) {
      const greeting = t('ada_page_greeting');
      setMessages([{ role: 'assistant', content: greeting }]);
    }
  }, [lang, mounted]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // ── MIC INPUT ──────────────────────────────────────────────────────────────
  const startListening = (micLang) => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition is not supported in this browser. Please use Chrome.');
      return;
    }

    // Stop any active recognition first
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.lang = micLang; // 'en-US' or 'es-ES'
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // Higher sensitivity settings
    recognition.onspeechstart = () => {};
    recognition.onsoundstart = () => {};

    if (micLang === 'en-US') {
      setIsListeningEN(true);
      setIsListeningES(false);
    } else {
      setIsListeningES(true);
      setIsListeningEN(false);
    }

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(r => r[0].transcript)
        .join('');
      setInput(transcript);
    };

    recognition.onend = () => {
      setIsListeningEN(false);
      setIsListeningES(false);
      // Auto-submit if we got something
      if (inputRef.current?.value?.trim()) {
        sendMessage(inputRef.current.value.trim());
        setInput('');
      }
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListeningEN(false);
      setIsListeningES(false);
    };

    recognition.start();
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
    setIsListeningEN(false);
    setIsListeningES(false);
  };

  // ── SEND MESSAGE ───────────────────────────────────────────────────────────
  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed) return;

    // Check question limits
    const limit = userTier === 'guest' ? QUESTION_LIMIT_GUEST : userTier === 'free' ? QUESTION_LIMIT_FREE : Infinity;
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
        body: JSON.stringify({
          messages: updatedMessages,
          lang: lang,
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'I\'m sorry, I had trouble with that. Please try again.';

      const assistantMessage = { role: 'assistant', content: reply };
      setMessages(prev => [...prev, assistantMessage]);
      setIsThinking(false);

      if (autoRead) {
        await speakText(reply, lang);
      }
    } catch (err) {
      console.error('Ada error:', err);
      setIsThinking(false);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: lang === 'es'
          ? 'Lo siento, tuve un problema. Por favor intenta de nuevo.'
          : 'I\'m sorry, I had trouble with that. Please try again.'
      }]);
    }
  };

  // ── ELEVENLABS TTS ─────────────────────────────────────────────────────────
  const speakText = async (text, speakLang = lang) => {
    lastSpokenTextRef.current = text;
    const cleaned = cleanForElevenLabs(text, speakLang);

    try {
      setIsSpeaking(true);

      const response = await fetch('/api/speak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleaned,
          lang: speakLang,
        }),
      });

      if (!response.ok) throw new Error('ElevenLabs error');

      const arrayBuffer = await response.arrayBuffer();

      // Use Web Audio API for better quality and resume-from-pause
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') await ctx.resume();

      const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      const source = ctx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(ctx.destination);

      // Store source for pause/resume
      currentAudioSourceRef.current = {
        source,
        buffer: audioBuffer,
        startTime: ctx.currentTime,
        pauseOffset: 0,
        paused: false,
      };

      source.onended = () => {
        setIsSpeaking(false);
        currentAudioSourceRef.current = null;
      };

      source.start(0);

    } catch (err) {
      console.error('ElevenLabs error:', err);
      setIsSpeaking(false);
    }
  };

  const repeatLastResponse = () => {
    if (lastSpokenTextRef.current) {
      speakText(lastSpokenTextRef.current, lang);
    }
  };

  const stopSpeaking = () => {
    if (currentAudioSourceRef.current?.source) {
      try { currentAudioSourceRef.current.source.stop(); } catch (e) {}
      currentAudioSourceRef.current = null;
    }
    setIsSpeaking(false);
  };

  // ── LIMIT MODAL EMAIL SIGNUP ───────────────────────────────────────────────
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
      setUserTier('free');
      localStorage.setItem('iep_user_tier', 'free');
      localStorage.setItem('iep_question_count', '0');
      setQuestionCount(0);
      setTimeout(() => setShowLimitModal(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (!mounted) return null;

  const limit = userTier === 'guest' ? QUESTION_LIMIT_GUEST : userTier === 'free' ? QUESTION_LIMIT_FREE : 999;
  const questionsLeft = Math.max(0, limit - questionCount);

  return (
    <>
      <Head>
        <title>Ask Ada — IEP Approved</title>
        <meta name="description" content="Ask Ada your IEP law questions — free, bilingual, powered by AI." />
      </Head>

      {/* FULL NAV */}
      <Nav questionCount={userTier !== 'unlimited' ? `${questionsLeft} ${lang === 'es' ? 'preguntas restantes' : 'questions left'}` : null} />

      <div style={styles.page}>

        {/* LEFT PANEL — Ada */}
        <div style={styles.leftPanel}>
          <div style={styles.adaAvatarWrap}>
            <div style={{ ...styles.adaRing, animation: isSpeaking ? 'pulse 1.5s infinite' : 'none' }}>
              <img src="/images/ada-avatar.png" alt="Ada" style={styles.adaAvatar}
                onError={(e) => { e.target.src = ''; e.target.style.display = 'none'; }}
              />
              <div style={styles.adaInitials}>ADA</div>
            </div>
          </div>

          <h2 style={styles.adaName}>Ada</h2>
          <p style={styles.adaSubtitle}>{t('ada_subtitle')}</p>

          <div style={styles.statusBadge}>
            <span style={{
              ...styles.statusDot,
              backgroundColor: isThinking ? '#f59e0b' : isSpeaking ? '#D4A843' : '#22c55e'
            }} />
            {isThinking ? t('ada_thinking') : isSpeaking ? t('ada_speaking') : t('ada_online')}
          </div>

          {/* REPEAT BUTTON — prominent */}
          <button
            onClick={isSpeaking ? stopSpeaking : repeatLastResponse}
            style={styles.repeatBtn}
            disabled={!lastSpokenTextRef.current && !isSpeaking}
          >
            {isSpeaking ? '⏹ Stop' : t('ada_repeat')}
          </button>

          {/* AUTO READ TOGGLE */}
          <label style={styles.autoReadToggle}>
            <input
              type="checkbox"
              checked={autoRead}
              onChange={e => setAutoRead(e.target.checked)}
              style={{ marginRight: '8px' }}
            />
            {lang === 'es' ? 'Leer automáticamente' : 'Auto-Read'}
          </label>

          <p style={styles.adaDisclaimer}>{t('ada_disclaimer')}</p>
        </div>

        {/* RIGHT PANEL — Chat */}
        <div style={styles.rightPanel}>

          {/* CHAT MESSAGES */}
          <div style={styles.chatArea}>
            {messages.map((msg, i) => (
              <div key={i} style={msg.role === 'user' ? styles.userBubble : styles.adaBubble}>
                {msg.role === 'assistant' && <span style={styles.adaLabel}>Ada</span>}
                <p style={styles.msgText}>{msg.content}</p>
              </div>
            ))}

            {isThinking && (
              <div style={styles.adaBubble}>
                <span style={styles.adaLabel}>Ada</span>
                <div style={styles.typingDots}>
                  <span /><span /><span />
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* INPUT AREA */}
          <div style={styles.inputArea}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t('ada_input_placeholder')}
              style={styles.textarea}
              rows={2}
              disabled={isThinking}
            />

            {/* SEND BUTTON */}
            <button
              onClick={() => sendMessage()}
              disabled={isThinking || !input.trim()}
              style={styles.sendBtn}
            >
              {t('ada_send')}
            </button>
          </div>

          {/* ── DUAL MIC BUTTONS ─────────────────────────────────────────── */}
          <div style={styles.micRow}>
            {/* ENGLISH MIC */}
            <button
              onClick={() => isListeningEN ? stopListening() : startListening('en-US')}
              style={{
                ...styles.micBtn,
                ...(isListeningEN ? styles.micBtnActive : {}),
              }}
              aria-label="Speak in English"
            >
              <span style={styles.micIcon}>🎤</span>
              <span style={styles.micLabel}>
                {isListeningEN
                  ? (lang === 'es' ? 'Escuchando...' : 'Listening...')
                  : t('ada_mic_english')}
              </span>
              {isListeningEN && <span style={styles.listeningPulse} />}
            </button>

            {/* SPANISH MIC */}
            <button
              onClick={() => isListeningES ? stopListening() : startListening('es-ES')}
              style={{
                ...styles.micBtn,
                ...styles.micBtnSpanish,
                ...(isListeningES ? styles.micBtnActive : {}),
              }}
              aria-label="Habla en español"
            >
              <span style={styles.micIcon}>🎤</span>
              <span style={styles.micLabel}>
                {isListeningES
                  ? (lang === 'es' ? 'Escuchando...' : 'Listening...')
                  : t('ada_mic_spanish')}
              </span>
              {isListeningES && <span style={styles.listeningPulse} />}
            </button>
          </div>

          {/* QUESTION COUNTER */}
          {userTier !== 'unlimited' && (
            <p style={styles.questionCounter}>
              {lang === 'es'
                ? `${questionsLeft} preguntas restantes este mes`
                : `${questionsLeft} questions remaining`}
              {' · '}
              <a href="/signup" style={styles.upgradeLink}>
                {lang === 'es' ? 'Actualizar' : 'Upgrade'}
              </a>
            </p>
          )}
        </div>
      </div>

      {/* ── QUESTION LIMIT MODAL ─────────────────────────────────────────── */}
      {showLimitModal && (
        <div style={styles.modalOverlay} onClick={() => setShowLimitModal(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 style={styles.modalTitle}>{t('ada_limit_title')}</h3>

            {/* PRIMARY CTA — Ada Unlimited */}
            <a href="/signup" style={styles.modalPrimary}>
              {t('ada_limit_primary')}
            </a>

            <div style={styles.modalDivider}>
              {lang === 'es' ? '— o —' : '— or —'}
            </div>

            {/* SECONDARY CTA — Free signup */}
            {!limitEmailSent ? (
              <form onSubmit={handleLimitSignup} style={styles.modalForm}>
                <p style={styles.modalSecondaryLabel}>{t('ada_limit_secondary')}</p>
                <input
                  type="email"
                  value={limitEmail}
                  onChange={e => setLimitEmail(e.target.value)}
                  placeholder={t('email_placeholder')}
                  style={styles.modalInput}
                  required
                />
                <button type="submit" style={styles.modalSecondaryBtn}>
                  {lang === 'es' ? 'Obtener 10 preguntas gratis' : 'Get 10 Free Questions'}
                </button>
              </form>
            ) : (
              <p style={styles.modalSuccess}>
                {lang === 'es' ? '✅ ¡Listo! Tienes 10 preguntas este mes.' : '✅ Done! You have 10 questions this month.'}
              </p>
            )}

            <button onClick={() => setShowLimitModal(false)} style={styles.modalClose}>✕</button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0.6); }
          70% { box-shadow: 0 0 0 16px rgba(212, 168, 67, 0); }
          100% { box-shadow: 0 0 0 0 rgba(212, 168, 67, 0); }
        }
        @keyframes listeningPulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.5; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes typingDot {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
        }
        .typingDots span {
          display: inline-block;
          width: 8px; height: 8px;
          background: #D4A843;
          border-radius: 50%;
          margin: 0 3px;
          animation: typingDot 1.2s infinite;
        }
        .typingDots span:nth-child(2) { animation-delay: 0.2s; }
        .typingDots span:nth-child(3) { animation-delay: 0.4s; }
      `}</style>
    </>
  );
}

// ─── STYLES ───────────────────────────────────────────────────────────────────
const styles = {
  page: {
    minHeight: 'calc(100vh - 68px)',
    backgroundColor: '#0f0a1a',
    display: 'flex',
    flexDirection: 'row',
    fontFamily: 'Outfit, sans-serif',
  },

  // LEFT PANEL
  leftPanel: {
    width: '260px',
    minWidth: '260px',
    backgroundColor: '#1a0f2e',
    borderRight: '1px solid rgba(212,168,67,0.2)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '32px 20px 24px',
    gap: '12px',
  },
  adaAvatarWrap: {
    marginBottom: '8px',
  },
  adaRing: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    border: '3px solid #D4A843',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#2D1B4E',
  },
  adaAvatar: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    borderRadius: '50%',
  },
  adaInitials: {
    position: 'absolute',
    color: '#D4A843',
    fontSize: '22px',
    fontWeight: '800',
    fontFamily: 'Cormorant Garamond, serif',
    letterSpacing: '2px',
  },
  adaName: {
    color: '#D4A843',
    fontSize: '22px',
    fontFamily: 'Cormorant Garamond, serif',
    fontWeight: '700',
    margin: 0,
  },
  adaSubtitle: {
    color: '#b8a8d0',
    fontSize: '12px',
    textAlign: 'center',
    margin: 0,
    lineHeight: '1.4',
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    backgroundColor: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '20px',
    padding: '5px 12px',
    fontSize: '12px',
    color: '#e8e0f0',
  },
  statusDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    flexShrink: 0,
    transition: 'background-color 0.3s',
  },
  repeatBtn: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#D4A843',
    color: '#2D1B4E',
    border: 'none',
    borderRadius: '8px',
    fontSize: '15px',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    cursor: 'pointer',
    transition: 'background 0.2s',
    marginTop: '8px',
  },
  autoReadToggle: {
    color: '#b8a8d0',
    fontSize: '13px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  },
  adaDisclaimer: {
    color: 'rgba(184, 168, 208, 0.6)',
    fontSize: '11px',
    textAlign: 'center',
    lineHeight: '1.5',
    marginTop: 'auto',
    borderTop: '1px solid rgba(255,255,255,0.06)',
    paddingTop: '12px',
  },

  // RIGHT PANEL
  rightPanel: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '800px',
    margin: '0 auto',
    padding: '24px 24px 0',
  },
  chatArea: {
    flex: 1,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    paddingBottom: '16px',
    minHeight: '300px',
    maxHeight: 'calc(100vh - 340px)',
  },
  adaBubble: {
    backgroundColor: '#1a0f2e',
    border: '1px solid rgba(212,168,67,0.2)',
    borderRadius: '12px 12px 12px 4px',
    padding: '14px 16px',
    maxWidth: '85%',
    alignSelf: 'flex-start',
  },
  userBubble: {
    backgroundColor: '#2D1B4E',
    border: '1px solid rgba(212,168,67,0.3)',
    borderRadius: '12px 12px 4px 12px',
    padding: '14px 16px',
    maxWidth: '75%',
    alignSelf: 'flex-end',
  },
  adaLabel: {
    color: '#D4A843',
    fontSize: '11px',
    fontWeight: '700',
    letterSpacing: '1px',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '6px',
  },
  msgText: {
    color: '#e8e0f0',
    fontSize: '15px',
    lineHeight: '1.6',
    margin: 0,
    whiteSpace: 'pre-wrap',
  },
  typingDots: {
    display: 'flex',
    alignItems: 'center',
    height: '20px',
  },

  // INPUT
  inputArea: {
    display: 'flex',
    gap: '10px',
    alignItems: 'flex-end',
    padding: '16px 0 0',
    borderTop: '1px solid rgba(212,168,67,0.15)',
  },
  textarea: {
    flex: 1,
    backgroundColor: '#1a0f2e',
    border: '1px solid rgba(212,168,67,0.3)',
    borderRadius: '8px',
    color: '#e8e0f0',
    fontSize: '15px',
    fontFamily: 'Outfit, sans-serif',
    padding: '12px 14px',
    resize: 'none',
    outline: 'none',
    lineHeight: '1.5',
  },
  sendBtn: {
    backgroundColor: '#D4A843',
    color: '#2D1B4E',
    border: 'none',
    borderRadius: '8px',
    padding: '12px 20px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    alignSelf: 'flex-end',
  },

  // DUAL MIC BUTTONS
  micRow: {
    display: 'flex',
    gap: '12px',
    padding: '14px 0',
  },
  micBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '10px',
    backgroundColor: '#1a0f2e',
    border: '2px solid rgba(212,168,67,0.4)',
    borderRadius: '10px',
    padding: '13px 16px',
    color: '#e8e0f0',
    fontSize: '14px',
    fontFamily: 'Outfit, sans-serif',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
    position: 'relative',
    overflow: 'hidden',
  },
  micBtnSpanish: {
    borderColor: 'rgba(212,168,67,0.6)',
    backgroundColor: 'rgba(212,168,67,0.06)',
  },
  micBtnActive: {
    backgroundColor: 'rgba(212,168,67,0.15)',
    borderColor: '#D4A843',
    boxShadow: '0 0 12px rgba(212,168,67,0.3)',
  },
  micIcon: {
    fontSize: '18px',
  },
  micLabel: {
    fontSize: '13px',
  },
  listeningPulse: {
    position: 'absolute',
    top: '8px',
    right: '8px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    animation: 'listeningPulse 1s infinite',
  },

  questionCounter: {
    color: 'rgba(184,168,208,0.6)',
    fontSize: '12px',
    textAlign: 'center',
    padding: '8px 0 16px',
  },
  upgradeLink: {
    color: '#D4A843',
    textDecoration: 'none',
    fontWeight: '600',
  },

  // LIMIT MODAL
  modalOverlay: {
    position: 'fixed',
    inset: 0,
    backgroundColor: 'rgba(0,0,0,0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 200,
  },
  modal: {
    backgroundColor: '#1a0f2e',
    border: '2px solid #D4A843',
    borderRadius: '16px',
    padding: '36px 32px',
    maxWidth: '480px',
    width: '90%',
    textAlign: 'center',
    position: 'relative',
  },
  modalTitle: {
    color: '#e8e0f0',
    fontSize: '22px',
    fontFamily: 'Cormorant Garamond, serif',
    fontWeight: '700',
    marginBottom: '24px',
  },
  modalPrimary: {
    display: 'block',
    backgroundColor: '#D4A843',
    color: '#2D1B4E',
    padding: '16px 24px',
    borderRadius: '10px',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: '800',
    fontFamily: 'Outfit, sans-serif',
    marginBottom: '20px',
    transition: 'background 0.2s',
  },
  modalDivider: {
    color: 'rgba(184,168,208,0.4)',
    fontSize: '13px',
    marginBottom: '16px',
  },
  modalSecondaryLabel: {
    color: '#b8a8d0',
    fontSize: '14px',
    marginBottom: '12px',
  },
  modalForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  modalInput: {
    backgroundColor: '#0f0a1a',
    border: '1px solid rgba(212,168,67,0.3)',
    borderRadius: '8px',
    color: '#e8e0f0',
    fontSize: '15px',
    padding: '12px 14px',
    fontFamily: 'Outfit, sans-serif',
    outline: 'none',
  },
  modalSecondaryBtn: {
    backgroundColor: 'transparent',
    border: '2px solid rgba(212,168,67,0.5)',
    color: '#D4A843',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '700',
    fontFamily: 'Outfit, sans-serif',
    cursor: 'pointer',
  },
  modalSuccess: {
    color: '#22c55e',
    fontSize: '16px',
    fontWeight: '600',
    padding: '16px',
  },
  modalClose: {
    position: 'absolute',
    top: '12px',
    right: '14px',
    background: 'none',
    border: 'none',
    color: 'rgba(184,168,208,0.5)',
    fontSize: '18px',
    cursor: 'pointer',
  },
};
