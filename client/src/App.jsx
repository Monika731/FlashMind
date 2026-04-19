import { useState } from 'react';
import { useTheme } from './ThemeContext';
import UploadZone from './components/UploadZone';
import FlashCardViewer from './components/FlashCardViewer';
import QuizMode from './components/QuizMode';
import Dashboard from './components/Dashboard';
import DeckList from './components/DeckList';

export default function App() {
  const { isDark, toggle, c } = useTheme();
  const [view, setView] = useState('home');
  const [allDecks, setAllDecks] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);

  const active = activeIndex !== null ? allDecks[activeIndex] : null;
  const deck = active?.deck || null;
  const cards = active?.cards || [];

  function handleGenerated(data, titleFallback) {
    const newEntry = {
      deck: data.deck || { title: titleFallback || 'My Deck' },
      cards: data.cards,
    };
    const newDecks = [...allDecks, newEntry];
    setAllDecks(newDecks);
    setActiveIndex(newDecks.length - 1);
    setView('viewer');
  }

  function handleSelectDeck(i) { setActiveIndex(i); setView('viewer'); }

  function updateCards(updated) {
    setAllDecks(prev =>
      prev.map((entry, i) => i === activeIndex ? { ...entry, cards: updated } : entry)
    );
  }

  return (
    <div className="min-h-screen transition-colors duration-200" style={{ background: c.appBg }}>
      <nav className="px-6 py-3.5 flex items-center justify-between sticky top-0 z-10 shadow-sm transition-colors duration-200"
        style={{ background: c.navBg, borderBottom: `1px solid ${c.navBorder}` }}>
        <button onClick={() => setView('home')} className="flex items-center gap-2 hover:opacity-80 transition">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center text-white text-sm font-bold shadow-md"
            style={{ background: 'linear-gradient(135deg, #4585a1, #376e88)' }}>F</div>
          <span className="text-lg font-bold tracking-tight" style={{ color: c.textPrimary }}>FlashAI</span>
        </button>

        <div className="flex items-center gap-1">
          <NavBtn c={c} active={view === 'decks'} onClick={() => setView('decks')}>
            My Decks
            {allDecks.length > 0 && (
              <span className="ml-1.5 text-xs font-bold px-1.5 py-0.5 rounded-full"
                style={{ background: c.accentMid, color: c.accent }}>{allDecks.length}</span>
            )}
          </NavBtn>
          {cards.length > 0 && <>
            <NavBtn c={c} active={view === 'viewer'} onClick={() => setView('viewer')}>Cards</NavBtn>
            <NavBtn c={c} active={view === 'quiz'} onClick={() => setView('quiz')}>Quiz</NavBtn>
          </>}
          {allDecks.length > 0 && (
            <NavBtn c={c} active={view === 'dashboard'} onClick={() => setView('dashboard')}>Progress</NavBtn>
          )}

          {/* Dark mode toggle */}
          <button onClick={toggle}
            className="ml-1 w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
            style={{ background: c.accentLight, color: c.accent }}
            title={isDark ? 'Light mode' : 'Dark mode'}>
            {isDark ? (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>

          <button onClick={() => setView('home')}
            className="ml-1 btn-primary font-semibold px-4 py-2 rounded-xl text-sm">
            + New Deck
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {view === 'home'      && <UploadZone onGenerated={handleGenerated} />}
        {view === 'decks'     && <DeckList decks={allDecks} onSelect={handleSelectDeck} onNew={() => setView('home')} />}
        {view === 'viewer'    && <FlashCardViewer deck={deck} cards={cards} onStartQuiz={() => setView('quiz')} onUpdateCards={updateCards} />}
        {view === 'quiz'      && <QuizMode cards={cards} onFinish={(u) => { updateCards(u); setView('dashboard'); }} />}
        {view === 'dashboard' && (
          <Dashboard allDecks={allDecks} activeIndex={activeIndex}
            onSelectDeck={(i) => setActiveIndex(i)} onRestart={() => setView('quiz')} />
        )}
      </main>
    </div>
  );
}

function NavBtn({ children, active, onClick, c }) {
  return (
    <button onClick={onClick}
      className="px-3.5 py-1.5 rounded-xl text-sm font-medium transition flex items-center"
      style={{ background: active ? c.accentLight : 'transparent', color: active ? c.accent : c.textMuted }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = c.accentLight; e.currentTarget.style.color = c.accent; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = c.textMuted; }}}>
      {children}
    </button>
  );
}
