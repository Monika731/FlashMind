const express = require('express');
const { Card, Deck } = require('../models');

const router = express.Router();

// GET /api/decks — list all decks
router.get('/decks', async (req, res) => {
  try {
    const decks = await Deck.find().sort({ createdAt: -1 });
    res.json({ decks });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch decks' });
  }
});

// GET /api/decks/:id/cards — get all cards for a deck
router.get('/decks/:id/cards', async (req, res) => {
  try {
    const cards = await Card.find({ deckId: req.params.id });
    res.json({ cards });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cards' });
  }
});

// GET /api/decks/:id/due — get cards due for review today
router.get('/decks/:id/due', async (req, res) => {
  try {
    const cards = await Card.find({
      deckId: req.params.id,
      nextReview: { $lte: new Date() },
    });
    res.json({ cards, count: cards.length });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch due cards' });
  }
});

module.exports = router;
