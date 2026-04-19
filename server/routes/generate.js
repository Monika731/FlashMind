const express = require('express');
const { generateFlashcards } = require('../utils/aiPrompt');
const { Card, Deck } = require('../models');

const router = express.Router();

// POST /api/generate — takes text + title, returns generated flashcards
router.post('/generate', async (req, res) => {
  try {
    const { text, title, count = 10 } = req.body;

    if (!text || text.trim().length < 20) {
      return res.status(400).json({ error: 'Please provide at least a paragraph of text' });
    }

    // Generate cards via AI
    const cards = await generateFlashcards(text, Math.min(count, 20));

    // Try to persist to DB (gracefully skip if no DB)
    let deck = null;
    let savedCards = cards; // fallback: return raw AI output

    try {
      deck = await Deck.create({
        title: title || 'Untitled Deck',
        cardCount: cards.length,
      });

      const docs = cards.map((c) => ({
        deckId: deck._id,
        question: c.question,
        answer: c.answer,
      }));

      savedCards = await Card.insertMany(docs);
    } catch (dbErr) {
      console.warn('DB save skipped (no DB?):', dbErr.message);
      // Return cards without IDs — still useful for demo
      savedCards = cards.map((c, i) => ({ _id: `local-${i}`, ...c }));
    }

    res.json({ deck: deck || { title: title || 'Untitled Deck', cardCount: cards.length }, cards: savedCards });
  } catch (err) {
    console.error('Generate error:', err.message);
    res.status(500).json({ error: 'Failed to generate flashcards. Check your API key.' });
  }
});

module.exports = router;
