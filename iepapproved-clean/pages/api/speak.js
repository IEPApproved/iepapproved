// pages/api/speak.js
// ElevenLabs TTS endpoint
// Fixes: Spanish speed inconsistency, punctuation narration, number language

import { createServerClient } from '../../lib/supabase';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text, lang = 'en' } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'No text provided' });
  }

// Voice is a paid member feature — server-side gate (Flash/Turbo costs only for revenue users)
try {
const supabase = createServerClient(req, res);
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
return res.status(403).json({ error: 'voice_upgrade_required' });
}
const { data: profile } = await supabase.from('profiles').select('tier').eq('id', user.id).single();
const tier = (profile && profile.tier) || 'free';
if (tier !== 'unlimited' && tier !== 'pro') {
return res.status(403).json({ error: 'voice_upgrade_required' });
}
} catch (gateErr) {
console.error('Voice gate error:', gateErr);
return res.status(403).json({ error: 'voice_upgrade_required' });
}

  const VOICE_ID = '9q9xpGHwmkXdA4JI72IU'; // Kaylin

  // Voice settings tuned per language
  // Spanish needs slightly lower stability to avoid robotic cadence
  // and slightly higher similarity_boost for naturalness
  const voiceSettings = lang === 'es'
    ? {
        stability: 0.45,           // Lower = more natural, less robotic
        similarity_boost: 0.82,    // Higher = more natural expression
        style: 0.30,               // Some style for warmth
        use_speaker_boost: true,
      }
    : {
        stability: 0.52,
        similarity_boost: 0.78,
        style: 0.25,
        use_speaker_boost: true,
      };

  // Use multilingual model when Spanish to fix number/word pronunciation
  const model = lang === 'es'
    ? 'eleven_multilingual_v2'
    : 'eleven_turbo_v2_5';

  try {
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': process.env.ELEVENLABS_API_KEY,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text,
          model_id: model,
          voice_settings: voiceSettings,
          // Output format for best quality
          output_format: 'mp3_44100_128',
        }),
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('ElevenLabs error:', err);
      return res.status(500).json({ error: 'TTS failed', detail: err });
    }

    const buffer = await response.arrayBuffer();
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'no-cache');
    return res.status(200).send(Buffer.from(buffer));

  } catch (err) {
    console.error('Speak API error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
