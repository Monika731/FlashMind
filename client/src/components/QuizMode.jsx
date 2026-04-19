import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

export default function QuizMode({ cards, onFinish }) {
  const { c } = useTheme();
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [results, setResults] = useState([]);
  const [updatedCards, setUpdatedCards] = useState([...cards]);
  const [done, setDone] = useState(false);
  const [gotItCount, setGotItCount] = useState(0);

  const current = cards[index];
  const progress = Math.round((gotItCount / cards.length) * 100);

  async function handleQuality(quality) {
    try {
      if (current._id && !current._id.toString().startsWith('local-')) {
        await axios.post(`/api/review/${current._id}`, { quality });
      }
    } catch (_) {}

    const newUpdatedCards = updatedCards.map((card, i) => {
      if (i !== index) return card;
      return {
        ...card,
        timesCorrect:   (card.timesCorrect   || 0) + (quality === 3 ? 1 : 0),
        timesIncorrect: (card.timesIncorrect || 0) + (quality === 1 ? 1 : 0),
        interval: quality === 3 ? (card.interval || 1) * 2 : quality === 1 ? 2 : 1,
      };
    });
    setUpdatedCards(newUpdatedCards);

    const newGotItCount = gotItCount + (quality === 3 ? 1 : 0);
    setGotItCount(newGotItCount);
    const newResults = [...results, { card: current, quality }];
    setResults(newResults);

    if (index + 1 >= cards.length) { setDone(true); onFinish(newUpdatedCards); }
    else { setIndex(index + 1); setFlipped(false); }
  }

  if (done) {
    const correct = results.filter((r) => r.quality === 3).length;
    const hard    = results.filter((r) => r.quality === 2).length;
    const forgot  = results.filter((r) => r.quality === 1).length;
    const pct     = Math.round((correct / cards.length) * 100);
    return (
      <div className="max-w-md mx-auto text-center space-y-8 py-10">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto shadow-lg text-4xl"
          style={{ background: 'linear-gradient(135deg, #4585a1, #376e88)' }}>🎉</div>
        <div>
          <h2 className="text-3xl font-bold" style={{ color: c.textPrimary }}>Quiz complete!</h2>
          <p className="mt-2" style={{ color: c.accent }}>You scored {pct}% — {correct} of {cards.length} correct</p>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <ResultStat label="Got it" value={correct} bg={c.accentLight} color={c.accent} />
          <ResultStat label="Hard"   value={hard}    bg="#FEF9C3"       color="#854D0E" />
          <ResultStat label="Forgot" value={forgot}  bg="#FFE4E6"       color="#9F1239" />
        </div>
        <button onClick={() => onFinish(updatedCards)} className="btn-primary font-semibold px-8 py-3 rounded-xl w-full">
          See Progress →
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-medium" style={{ color: c.textMuted }}>
          <span>Card {index + 1} of {cards.length}</span>
          <span>{gotItCount} / {cards.length} correct</span>
        </div>
        <div className="h-2 rounded-full overflow-hidden" style={{ background: c.accentMid }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #4585a1, #376e88)' }} />
        </div>
      </div>

      <div className="flip-card w-full h-72 cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          <div className="flip-card-front shadow-sm"
            style={{ background: c.cardFrontBg, border: `1.5px solid ${c.cardFrontBorder}` }}>
            <div className="text-center space-y-4 px-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: c.cardLabelBg, color: c.cardLabelColor }}>Question</span>
              <p className="text-xl font-semibold leading-relaxed" style={{ color: c.textPrimary }}>{current.question}</p>
              {!flipped && <p className="text-xs" style={{ color: c.textSecondary }}>Tap to reveal answer</p>}
            </div>
          </div>
          <div className="flip-card-back shadow-sm" style={{ background: 'linear-gradient(145deg, #4585a1, #376e88)' }}>
            <div className="text-center space-y-4 px-6">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#EAF3F9' }}>Answer</span>
              <p className="text-xl font-semibold text-white leading-relaxed">{current.answer}</p>
            </div>
          </div>
        </div>
      </div>

      <div className={`grid grid-cols-3 gap-3 transition-all duration-300 ${flipped ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
        <RatingBtn label="Forgot"  sub="Will revisit"  bg="#FFE4E6" border="#FECDD3" color="#9F1239" onClick={() => handleQuality(1)} />
        <RatingBtn label="Hard"    sub="Need practice" bg="#FEF9C3" border="#FDE68A" color="#854D0E" onClick={() => handleQuality(2)} />
        <RatingBtn label="Got it!" sub="Moving on"     bg={c.accentLight} border={c.accentMid} color={c.accent} onClick={() => handleQuality(3)} />
      </div>

      {!flipped && <p className="text-center text-sm" style={{ color: c.textSecondary }}>Think of your answer, then tap the card to check</p>}
    </div>
  );
}

function RatingBtn({ label, sub, bg, border, color, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl py-4 font-semibold transition-all hover:-translate-y-0.5 active:translate-y-0 border"
      style={{ background: bg, borderColor: border, color }}>
      <div className="text-base">{label}</div>
      <div className="text-xs opacity-60 mt-0.5">{sub}</div>
    </button>
  );
}

function ResultStat({ label, value, bg, color }) {
  return (
    <div className="rounded-2xl p-4" style={{ background: bg, color }}>
      <div className="text-3xl font-bold">{value}</div>
      <div className="text-xs font-semibold mt-1">{label}</div>
    </div>
  );
}
