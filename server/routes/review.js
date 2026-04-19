const express = require('express');
const { Card } = require('../models');
const { updateCardSRS } = require('../utils/srs');

const router = express.Router();

// POST /api/review/:cardId — update SRS after answering
// body: { quality: 1 | 2 | 3 }  (1=forgot, 2=hard, 3=easy)
router.post('/review/:cardId', async (req, res) => {
  try {
    const { quality } = req.body;

    if (![1, 2, 3].includes(Number(quality))) {
      return res.status(400).json({ error: 'quality must be 1, 2, or 3' });
    }

    const card = await Card.findById(req.params.cardId);
    if (!card) return res.status(404).json({ error: 'Card not found' });

    updateCardSRS(card, Number(quality));
    await card.save();

    res.json({
      card,
      nextReview: card.nextReview,
      interval: card.interval,
    });
  } catch (err) {
    console.error('Review error:', err.message);
    res.status(500).json({ error: 'Failed to update card' });
  }
});

module.exports = router;
