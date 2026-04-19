import { useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function Dashboard({ allDecks, activeIndex, onRestart, onSelectDeck }) {
  const { c } = useTheme();
  const [selected, setSelected] = useState(activeIndex ?? 0);

  if (!allDecks || allDecks.length === 0) {
    return (
      <div className="text-center py-24" style={{ color: c.textSecondary }}>
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl" style={{ background: c.accentLight }}>📊</div>
        <p className="font-semibold" style={{ color: c.textPrimary }}>No progress yet</p>
        <p className="text-sm mt-1">Complete a quiz to see your stats here</p>
      </div>
    );
  }

  const { deck, cards } = allDecks[selected];
  const total   = cards.length;
  const correct = cards.reduce((sum, card) => sum + (card.timesCorrect   || 0), 0);
  const wrong   = cards.reduce((sum, card) => sum + (card.timesIncorrect || 0), 0);
  const mastery = total > 0 ? Math.round((correct / Math.max(correct + wrong, 1)) * 100) : 0;
  const mastered = cards.filter((card) => (card.interval || 1) >= 7);
  const learning = cards.filter((card) => (card.interval || 1) >= 2 && (card.interval || 1) < 7);
  const toReview = cards.filter((card) => (card.interval || 1) < 2);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: c.textPrimary }}>Progress</h2>
        <button onClick={() => { onSelectDeck(selected); onRestart(); }}
          className="btn-primary font-semibold px-5 py-2.5 rounded-xl text-sm">Quiz Again</button>
      </div>

      {allDecks.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {allDecks.map((entry, i) => (
            <button key={i} onClick={() => setSelected(i)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition"
              style={{
                background: selected === i ? c.accent : c.accentLight,
                color: selected === i ? 'white' : c.accent,
                border: `1.5px solid ${selected === i ? c.accent : c.accentMid}`,
              }}>
              {entry.deck?.title || `Deck ${i + 1}`}
            </button>
          ))}
        </div>
      )}

      <div className="rounded-2xl p-6 flex items-center gap-8 shadow-sm"
        style={{ background: c.surface, border: `1.5px solid ${c.surfaceBorder}` }}>
        <div className="relative w-28 h-28 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={c.accentMid} strokeWidth="3.5" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke={c.accent} strokeWidth="3.5"
              strokeDasharray={`${mastery} ${100 - mastery}`} strokeLinecap="round" className="transition-all duration-700" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold" style={{ color: c.textPrimary }}>{mastery}%</span>
          </div>
        </div>
        <div>
          <p className="text-lg font-bold" style={{ color: c.textPrimary }}>
            {mastery >= 80 ? 'Excellent mastery!' : mastery >= 50 ? 'Good progress!' : 'Keep practising!'}
          </p>
          <p className="text-sm mt-1" style={{ color: c.textMuted }}>{correct} correct · {wrong} incorrect · {total} cards</p>
          <p className="text-xs mt-0.5 font-medium" style={{ color: c.textSecondary }}>{deck?.title || 'Your Deck'}</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard label="Mastered" value={mastered.length} total={total} bg={c.accentLight} color={c.accent}     bar={c.accent} />
        <StatCard label="Learning"  value={learning.length}  total={total} bg="#FEF9C3"      color="#854D0E"       bar="#F59E0B" />
        <StatCard label="To Review" value={toReview.length}  total={total} bg="#FFE4E6"      color="#9F1239"       bar="#F87171" />
      </div>

      <div>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: c.textSecondary }}>Card Breakdown</h3>
        <div className="space-y-2">
          {cards.map((card, i) => {
            const interval = card.interval || 1;
            const status =
              interval >= 7 ? { label: 'Mastered', bg: c.accentLight, color: c.accent } :
              interval >= 2 ? { label: 'Learning',  bg: '#FEF9C3',    color: '#854D0E' } :
                              { label: 'Review',    bg: '#FFE4E6',    color: '#9F1239' };
            return (
              <div key={card._id || i} className="flex items-center gap-3 rounded-2xl px-4 py-3 shadow-sm"
                style={{ background: c.surface, border: `1.5px solid ${c.surfaceBorder}` }}>
                <span className="text-xs font-bold w-6 shrink-0" style={{ color: c.accentMid }}>Q{i + 1}</span>
                <p className="text-sm flex-1 line-clamp-1" style={{ color: c.textPrimary }}>{card.question}</p>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full shrink-0"
                  style={{ background: status.bg, color: status.color }}>{status.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, total, bg, color, bar }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="rounded-2xl p-4" style={{ background: bg }}>
      <div className="text-3xl font-bold" style={{ color }}>{value}</div>
      <div className="text-xs font-bold mt-1" style={{ color }}>{label}</div>
      <div className="mt-3 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.7)' }}>
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: bar }} />
      </div>
      <div className="text-xs mt-1" style={{ color, opacity: 0.6 }}>{pct}%</div>
    </div>
  );
}
