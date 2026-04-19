import { useState } from 'react';
import { useTheme } from '../ThemeContext';

function speak(text, setPlaying) {
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.onstart = () => setPlaying(true);
  utterance.onend = () => setPlaying(false);
  utterance.onerror = () => setPlaying(false);
  window.speechSynthesis.speak(utterance);
}

function SpeakerBtn({ text, color }) {
  const [playing, setPlaying] = useState(false);
  return (
    <button
      onClick={e => { e.stopPropagation(); speak(text, setPlaying); }}
      title="Read aloud"
      className="absolute bottom-4 right-4 w-8 h-8 rounded-full flex items-center justify-center transition"
      style={{ background: 'rgba(255,255,255,0.2)', color }}>
      {playing ? (
        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM12.293 7.293a1 1 0 011.414 0L15 8.586l1.293-1.293a1 1 0 111.414 1.414L16.414 10l1.293 1.293a1 1 0 01-1.414 1.414L15 11.414l-1.293 1.293a1 1 0 01-1.414-1.414L13.586 10l-1.293-1.293a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      )}
    </button>
  );
}

export default function FlashCard({ card, index, total }) {
  const { c } = useTheme();
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-medium" style={{ color: c.textMuted }}>
        <span>Card {index + 1} of {total}</span>
        <span>{flipped ? 'Answer' : 'Question'} · tap to flip</span>
      </div>

      <div className="flip-card w-full h-72 cursor-pointer select-none" onClick={() => setFlipped(!flipped)}>
        <div className={`flip-card-inner ${flipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flip-card-front shadow-sm"
            style={{ background: c.cardFrontBg, border: `1.5px solid ${c.cardFrontBorder}` }}>
            <div className="text-center space-y-4 px-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: c.cardLabelBg, color: c.cardLabelColor }}>Question</span>
              <p className="text-xl font-semibold leading-relaxed" style={{ color: c.textPrimary }}>{card.question}</p>
              {!flipped && <p className="text-xs" style={{ color: c.textSecondary }}>Tap to reveal answer</p>}
            </div>
            <SpeakerBtn text={card.question} color={c.cardLabelColor} />
          </div>

          {/* Back */}
          <div className="flip-card-back shadow-sm" style={{ background: 'linear-gradient(145deg, #4585a1, #376e88)' }}>
            <div className="text-center space-y-4 px-4">
              <span className="inline-block text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,255,255,0.2)', color: '#EAF3F9' }}>Answer</span>
              <p className="text-xl font-semibold text-white leading-relaxed">{card.answer}</p>
            </div>
            <SpeakerBtn text={card.answer} color="white" />
          </div>
        </div>
      </div>

      {!flipped && <p className="text-center text-xs" style={{ color: c.textSecondary }}>Think of your answer, then tap to check</p>}
    </div>
  );
}
