import { useState } from 'react';
import { useTheme } from '../ThemeContext';

export default function DeckList({ decks, onSelect, onNew }) {
  const { c } = useTheme();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all'); // all | new | learning | mastered

  const filtered = decks.filter(entry => {
    const title = (entry.deck?.title || '').toLowerCase();
    if (!title.includes(search.toLowerCase())) return false;
    if (filter === 'all') return true;
    const total   = entry.cards.length;
    const correct = entry.cards.reduce((s, c) => s + (c.timesCorrect || 0), 0);
    const wrong   = entry.cards.reduce((s, c) => s + (c.timesIncorrect || 0), 0);
    const mastery = total > 0 ? Math.round((correct / Math.max(correct + wrong, 1)) * 100) : 0;
    if (filter === 'new')      return mastery === 0;
    if (filter === 'learning') return mastery > 0 && mastery < 80;
    if (filter === 'mastered') return mastery >= 80;
    return true;
  });

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'new', label: 'Not started' },
    { key: 'learning', label: 'In progress' },
    { key: 'mastered', label: 'Mastered' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold" style={{ color: c.textPrimary }}>My Decks</h2>
          <p className="text-sm mt-0.5" style={{ color: c.textSecondary }}>
            {filtered.length} of {decks.length} deck{decks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button onClick={onNew} className="btn-primary font-semibold px-5 py-2.5 rounded-xl text-sm">+ New Deck</button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: c.textSecondary }}
          fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search decks..."
          className="w-full rounded-xl pl-10 pr-4 py-2.5 text-sm transition"
          style={{ background: c.surface, border: `1.5px solid ${c.inputBorder}`, color: c.textPrimary, outline: 'none' }}
          onFocus={e => e.target.style.borderColor = c.accent}
          onBlur={e => e.target.style.borderColor = c.inputBorder}
        />
      </div>

      {/* Filter pills */}
      <div className="flex gap-2 flex-wrap">
        {filters.map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className="px-3.5 py-1 rounded-full text-xs font-semibold transition"
            style={{
              background: filter === f.key ? c.accent : c.accentLight,
              color: filter === f.key ? 'white' : c.accent,
              border: `1.5px solid ${filter === f.key ? c.accent : c.accentMid}`,
            }}>
            {f.label}
          </button>
        ))}
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 text-3xl"
            style={{ background: c.accentLight }}>📚</div>
          <p className="font-semibold" style={{ color: c.textPrimary }}>No decks yet</p>
          <p className="text-sm mt-1" style={{ color: c.textSecondary }}>Generate your first deck to get started</p>
          <button onClick={onNew} className="mt-6 btn-primary font-semibold px-6 py-2.5 rounded-xl text-sm">Create Deck</button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="font-semibold" style={{ color: c.textPrimary }}>No decks match your search</p>
          <p className="text-sm mt-1" style={{ color: c.textSecondary }}>Try a different keyword or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filtered.map((entry, i) => {
            const realIndex = decks.indexOf(entry);
            const total    = entry.cards.length;
            const correct  = entry.cards.reduce((s, c) => s + (c.timesCorrect   || 0), 0);
            const wrong    = entry.cards.reduce((s, c) => s + (c.timesIncorrect || 0), 0);
            const mastery  = total > 0 ? Math.round((correct / Math.max(correct + wrong, 1)) * 100) : 0;
            const mastered = entry.cards.filter((c) => (c.interval || 1) >= 7).length;

            return (
              <div key={i} onClick={() => onSelect(realIndex)}
                className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:shadow-md"
                style={{ border: `1.5px solid ${c.surfaceBorder}`, background: c.surface }}
                onMouseEnter={e => e.currentTarget.style.borderColor = c.accent}
                onMouseLeave={e => e.currentTarget.style.borderColor = c.surfaceBorder}>
                <div className="flex items-start gap-4">
                  <div className="relative w-12 h-12 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                      <circle cx="18" cy="18" r="14" fill="none" stroke={c.accentMid} strokeWidth="4" />
                      <circle cx="18" cy="18" r="14" fill="none" stroke={c.accent} strokeWidth="4"
                        strokeDasharray={`${mastery} ${100 - mastery}`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-bold" style={{ color: c.textPrimary }}>{mastery}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold line-clamp-1" style={{ color: c.textPrimary }}>
                      {entry.deck?.title || `Deck ${realIndex + 1}`}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: c.textSecondary }}>{total} cards · {mastered} mastered</p>
                  </div>
                </div>

                <div className="mt-4 h-1.5 rounded-full overflow-hidden" style={{ background: c.accentMid }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${mastery}%`, background: c.accent }} />
                </div>

                <div className="mt-3 flex justify-end">
                  <span className="text-xs font-bold" style={{ color: c.accent }}>Study →</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
