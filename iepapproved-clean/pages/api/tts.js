export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { text } = req.body
  if (!text) return res.status(400).json({ error: 'No text provided' })

  // Debug: check if API key exists
  const apiKey = process.env.ELEVENLABS_API_KEY
  if (!apiKey) {
    console.error('ELEVENLABS_API_KEY is not set')
    return res.status(500).json({ error: 'API key not configured' })
  }

  const VOICE_ID = '9q9xpGHwmkXdA4JI72IU'

  const clean = text
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/📖/g, '')
    .replace(/[•\-]{1,2}\s/g, '')
    .replace(/#{1,3}\s/g, '')
    .trim()
    .substring(0, 2500)

  try {
    console.log('Calling ElevenLabs with voice:', VOICE_ID)
    console.log('API key starts with:', apiKey.substring(0, 8))

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'audio/mpeg',
        },
        body: JSON.stringify({
          text: clean,
          model_id: 'eleven_turbo_v2',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.75,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      }
    )

    console.log('ElevenLabs response status:', response.status)

    if (!response.ok) {
      const errText = await response.text()
      console.error('ElevenLabs error body:', errText)
      return res.status(500).json({ 
        error: `ElevenLabs error ${response.status}`,
        details: errText.substring(0, 200)
      })
    }

    const buffer = await response.arrayBuffer()
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'no-cache')
    res.send(Buffer.from(buffer))

  } catch (error) {
    console.error('TTS fetch error:', error)
    res.status(500).json({ error: error.message })
  }
}
