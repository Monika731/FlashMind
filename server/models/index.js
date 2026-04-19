const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  deckId:         { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
  question:       { type: String, required: true },
  answer:         { type: String, required: true },
  // Spaced repetition (SM-2 algorithm)
  interval:       { type: Number, default: 1 },      // days until next review
  easeFactor:     { type: Number, default: 2.5 },    // difficulty multiplier
  nextReview:     { type: Date,   default: Date.now },
  timesCorrect:   { type: Number, default: 0 },
  timesIncorrect: { type: Number, default: 0 },
});

const deckSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  cardCount: { type: Number, default: 0 },
});

const Card = mongoose.model('Card', cardSchema);
const Deck = mongoose.model('Deck', deckSchema);

module.exports = { Card, Deck };
