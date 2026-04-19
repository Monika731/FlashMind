import { useState } from 'react';
import { useTheme } from '../ThemeContext';
import FlashCard from './FlashCard';

export default function FlashCardViewer({ deck, cards, onStartQuiz, onUpdateCards }) {
  const { c } = useTheme();
  const [index, setIndex] = useState(0);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQ, setEditQ] = useState('');
  const [editA, setEditA] = useState('');

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(cards.length - 1, i + 1));

  function startEdit(i) {
    setEditingIndex(i);
    setEditQ(cards[i].question);
    setEditA(cards[i].answer);
  }

  function saveEdit() {
    const updated = cards.map((c, i) =>
      i === editingIndex ? { ...c, question: editQ.trim(), answer: editA.trim() } : c
    );
    onUpdateCards(updated);
    setEditingIndex(null);
  }

  function deleteCard(i) {
    const updated = cards.filter((_, idx) => idx !== i);
    onUpdateCards(updated);
    if (index >= updated.length) setIndex(Math.max(0, updated.length - 1));
  }

  const inputStyle = {
    background: c.inputBg,
    border: `1.5px solid ${c.inputBorder}`,
    color: c.textPrimary,
    borderRadius: '0.75rem',
    padding: '0.5rem 0.75rem',
    width: '100%',
    fontSize: '0.875rem',
    outline: 'none',
    resize: 'none',
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: c.textPrimary }}>{deck?.title || 'Your Deck'}</h2>
          <p className="text-sm mt-0.5" style={{ color: c.textSecondary }}>{cards.length} cards · AI generated</p>
        </div>
        <button onClick={onStartQuiz} className="btn-primary font-semibold px-5 py-2.5 rounded-xl text-sm">
          Start Quiz →
        </button>
      </div>

      {cards.length > 0 && <FlashCard card={cards[index]} index={index} total={cards.length} />}

      <div className="flex items-center justify-between">
        <button onClick={prev} disabled={index === 0}
          className="px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-30 shadow-sm"
          style={{ border: `1.5px solid ${c.inputBorder}`, background: c.surface, color: c.accent }}>← Previous</button>

        <div className="flex gap-1.5 items-center">
          {cards.map((_, i) => (
            <button key={i} onClick={() => setIndex(i)} className="rounded-full transition-all duration-200"
              style={{ width: i === index ? '20px' : '8px', height: '8px', background: i === index ? c.accent : c.accentMid }} />
          ))}
        </div>

        <button onClick={next} disabled={index === cards.length - 1}
          className="px-5 py-2 rounded-xl text-sm font-medium transition disabled:opacity-30 shadow-sm"
          style={{ border: `1.5px solid ${c.inputBorder}`, background: c.surface, color: c.accent }}>Next →</button>
      </div>

      {/* All cards grid */}
      <div style={{ borderTop: `1px solid ${c.divider}`, paddingTop: '2rem' }}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: c.textSecondary }}>All Cards</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {cards.map((card, i) => (
            <div key={card._id || i}
              className="rounded-2xl transition-all shadow-sm"
              style={{ border: `1.5px solid ${i === index ? c.accent : c.surfaceBorder}`, background: i === index ? c.accentLight : c.surface }}>

              {editingIndex === i ? (
                /* Edit form */
                <div className="p-4 space-y-2">
                  <label className="text-xs font-bold" style={{ color: c.accent }}>Question</label>
                  <textarea rows={2} value={editQ} onChange={e => setEditQ(e.target.value)} style={inputStyle} />
                  <label className="text-xs font-bold" style={{ color: c.accent }}>Answer</label>
                  <textarea rows={2} value={editA} onChange={e => setEditA(e.target.value)} style={inputStyle} />
                  <div className="flex gap-2 pt-1">
                    <button onClick={saveEdit}
                      className="btn-primary text-xs font-semibold px-3 py-1.5 rounded-lg flex-1">Save</button>
                    <button onClick={() => setEditingIndex(null)}
                      className="text-xs font-semibold px-3 py-1.5 rounded-lg flex-1"
                      style={{ background: c.surfaceBorder, color: c.textPrimary }}>Cancel</button>
                  </div>
                </div>
              ) : (
                /* Display */
                <button className="text-left p-4 w-full" onClick={() => setIndex(i)}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold mb-1.5" style={{ color: c.accent }}>Q{i + 1}</p>
                      <p className="text-sm leading-relaxed line-clamp-2" style={{ color: c.textPrimary }}>{card.question}</p>
                    </div>
                    {/* Edit / Delete icons */}
                    <div className="flex gap-1 shrink-0" onClick={e => e.stopPropagation()}>
                      <button onClick={() => startEdit(i)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                        style={{ background: c.accentMid, color: c.accent }}
                        title="Edit card">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                      <button onClick={() => deleteCard(i)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center transition"
                        style={{ background: '#FFE4E6', color: '#9F1239' }}
                        title="Delete card">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
