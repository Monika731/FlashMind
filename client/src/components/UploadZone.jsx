import { useState, useRef } from 'react';
import axios from 'axios';
import { useTheme } from '../ThemeContext';

export default function UploadZone({ onGenerated }) {
  const { c } = useTheme();
  const [text, setText] = useState('');
  const [title, setTitle] = useState('');
  const [cardCount, setCardCount] = useState(10);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const messages = ['Reading your material...', 'Finding key concepts...', 'Crafting questions...', 'Polishing answers...', 'Almost done...'];

  async function handleFile(file) {
    if (!file || file.type !== 'application/pdf') { setError('Please upload a PDF file.'); return; }
    setError(''); setLoading(true); setLoadingMsg('Parsing PDF...');
    try {
      const form = new FormData();
      form.append('file', file);
      const { data } = await axios.post('/api/upload', form);
      setText(data.text); setLoadingMsg('');
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to parse PDF');
    } finally { setLoading(false); }
  }

  async function handleGenerate() {
    if (!text.trim()) { setError('Please paste text or upload a PDF first.'); return; }
    setError(''); setLoading(true);
    let idx = 0; setLoadingMsg(messages[0]);
    const interval = setInterval(() => { idx = (idx + 1) % messages.length; setLoadingMsg(messages[idx]); }, 1800);
    try {
      const { data } = await axios.post('/api/generate', { text, title: title || 'My Deck', count: cardCount });
      onGenerated(data, title || 'My Deck');
    } catch (e) {
      setError(e.response?.data?.error || 'Generation failed. Check your API key.');
    } finally { clearInterval(interval); setLoading(false); setLoadingMsg(''); }
  }

  function onDrop(e) { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }

  const topics = ['Photosynthesis', 'World War II', "Newton's Laws", 'Machine Learning'];
  const inputStyle = { background: c.inputBg, border: `1.5px solid ${c.inputBorder}`, color: c.textPrimary, outline: 'none' };

  return (
    <div className="max-w-2xl mx-auto space-y-7">
      <div className="text-center space-y-3 pt-4">
        <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border mb-1"
          style={{ background: c.accentLight, color: c.accent, borderColor: c.accentMid }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: c.accent }} />
          AI-Powered Flashcards
        </div>
        <h1 className="text-4xl font-bold leading-tight" style={{ color: c.textPrimary }}>
          Turn any text into<br />
          <span style={{ background: 'linear-gradient(135deg, #4585a1, #376e88)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            smart flashcards
          </span>
        </h1>
        <p className="text-lg" style={{ color: c.textMuted }}>Paste notes or upload a PDF — AI generates quiz-ready cards in seconds.</p>
      </div>

      <div onDragOver={(e) => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)}
        onDrop={onDrop} onClick={() => fileRef.current.click()}
        className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200"
        style={{ borderColor: dragOver ? c.accent : c.accentMid, background: dragOver ? c.accentLight : c.surface }}>
        <input ref={fileRef} type="file" accept=".pdf" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3" style={{ background: c.accentLight }}>
          <svg className="w-6 h-6" style={{ color: c.accent }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <p className="font-semibold" style={{ color: c.textPrimary }}>Drop a PDF here or click to browse</p>
        <p className="text-sm mt-1" style={{ color: c.textSecondary }}>Max 10MB · PDF only</p>
      </div>

      <div className="flex items-center gap-3 text-sm" style={{ color: c.textSecondary }}>
        <div className="flex-1 h-px" style={{ background: c.divider }} />
        or paste your notes below
        <div className="flex-1 h-px" style={{ background: c.divider }} />
      </div>

      <textarea value={text} onChange={(e) => { setText(e.target.value); setError(''); }} rows={6}
        placeholder="Paste any text — lecture notes, a textbook excerpt, a Wikipedia article..."
        className="w-full rounded-2xl p-4 text-sm resize-none transition shadow-sm"
        style={inputStyle}
        onFocus={e => e.target.style.borderColor = c.accent}
        onBlur={e => e.target.style.borderColor = c.inputBorder} />

      <div className="flex gap-4 items-end">
        <div className="flex-1">
          <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.accent }}>Deck Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Biology Chapter 3"
            className="w-full rounded-xl px-3.5 py-2.5 text-sm transition shadow-sm" style={inputStyle}
            onFocus={e => e.target.style.borderColor = c.accent} onBlur={e => e.target.style.borderColor = c.inputBorder} />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-1.5" style={{ color: c.accent }}>Cards</label>
          <select value={cardCount} onChange={(e) => setCardCount(Number(e.target.value))}
            className="rounded-xl px-3.5 py-2.5 text-sm transition shadow-sm" style={inputStyle}>
            {[5, 10, 15, 20].map((n) => <option key={n} value={n}>{n} cards</option>)}
          </select>
        </div>
      </div>

      {error && (
        <div className="rounded-xl px-4 py-3 text-sm flex items-center gap-2"
          style={{ background: '#FFE4E6', color: '#9F1239', border: '1px solid #FECDD3' }}>
          <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      <button onClick={handleGenerate} disabled={loading}
        className="btn-primary font-semibold py-2.5 px-8 rounded-xl text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none mx-auto block">
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
            </svg>
            {loadingMsg}
          </span>
        ) : 'Generate Flashcards'}
      </button>

      <div className="text-center">
        <p className="text-xs font-medium mb-2.5" style={{ color: c.textSecondary }}>Try a sample topic</p>
        <div className="flex flex-wrap justify-center gap-2">
          {topics.map((t) => (
            <button key={t}
              onClick={() => { setText(`Explain the key concepts of: ${t}. Include definitions, key facts, and important points a student should know.`); setTitle(t); }}
              className="text-xs px-3.5 py-1.5 rounded-full transition"
              style={{ background: c.accentLight, color: c.accent, border: `1px solid ${c.accentMid}` }}
              onMouseEnter={e => e.currentTarget.style.background = c.accentMid}
              onMouseLeave={e => e.currentTarget.style.background = c.accentLight}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
