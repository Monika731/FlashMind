const OpenAI = require('openai');

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

async function generateFlashcards(text, count = 10) {
  const trimmed = text.slice(0, 4000);

  const response = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    max_tokens: 2048,
    messages: [
      {
        role: 'user',
        content: `You are an expert flashcard generator for students.

Read the study material below and create exactly ${count} high-quality flashcard pairs.

Rules:
- Questions should test understanding, not just memorization
- Answers should be concise (1-3 sentences max)
- Cover different concepts from the material
- Return ONLY valid JSON — no explanation, no markdown, no extra text

Format:
[{"question": "...", "answer": "..."}, ...]

STUDY MATERIAL:
${trimmed}`,
      },
    ],
  });

  const raw = response.choices[0].message.content.trim();

  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/, '').trim();

  const cards = JSON.parse(cleaned);

  if (!Array.isArray(cards)) throw new Error('AI did not return an array');
  return cards;
}

module.exports = { generateFlashcards };
