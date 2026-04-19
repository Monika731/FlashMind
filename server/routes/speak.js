const express = require('express');
const router = express.Router();

const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'; // Rachel

router.post('/speak', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'No text provided' });

  const apiKey = process.env.ELEVENLABS_API_KEY;
  console.log('ElevenLabs key present:', !!apiKey, '| starts with:', apiKey?.slice(0, 5));

  try {
    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text: text.slice(0, 500),
        model_id: 'eleven_multilingual_v2',
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    });

    console.log('ElevenLabs status:', response.status);

    if (!response.ok) {
      const errText = await response.text();
      console.error('ElevenLabs error body:', errText);
      return res.status(500).json({ error: errText });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    const buffer = await response.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (err) {
    console.error('Speak route exception:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
