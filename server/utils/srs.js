/**
 * SM-2 Spaced Repetition Algorithm
 * quality: 1 = forgot, 2 = hard, 3 = easy
 */
function updateCardSRS(card, quality) {
  if (quality < 2) {
    // Forgot — reset interval, lower ease
    card.interval = 1;
    card.easeFactor = Math.max(1.3, card.easeFactor - 0.2);
    card.timesIncorrect += 1;
  } else {
    // Remembered — increase interval
    card.interval = Math.round(card.interval * card.easeFactor);
    card.easeFactor = Math.max(
      1.3,
      card.easeFactor + (0.1 - (3 - quality) * 0.08)
    );
    card.timesCorrect += 1;
  }

  // Schedule next review
  const msPerDay = 24 * 60 * 60 * 1000;
  card.nextReview = new Date(Date.now() + card.interval * msPerDay);
  return card;
}

module.exports = { updateCardSRS };
