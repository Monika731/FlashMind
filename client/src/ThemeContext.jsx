import { createContext, useContext, useState } from 'react';

const light = {
  appBg: '#F7FFFE',
  navBg: 'white',
  navBorder: '#C5DCE9',
  surface: 'white',
  surfaceBorder: '#C5DCE9',
  surfaceAlt: '#EAF3F9',
  textPrimary: '#1a3a4a',
  textSecondary: '#7AAEC5',
  textMuted: '#9CA3AF',
  inputBg: 'white',
  inputBorder: '#A8C8DA',
  accent: '#4585a1',
  accentHover: '#376e88',
  accentLight: '#EAF3F9',
  accentMid: '#C5DCE9',
  divider: '#C5DCE9',
  cardFrontBg: 'linear-gradient(145deg, #EAF3F9, #C5DCE9)',
  cardFrontBorder: '#A8C8DA',
  cardLabelBg: '#A8C8DA',
  cardLabelColor: '#376e88',
};

const dark = {
  appBg: '#0d1b26',
  navBg: '#111f2d',
  navBorder: '#1e3347',
  surface: '#111f2d',
  surfaceBorder: '#1e3347',
  surfaceAlt: '#152030',
  textPrimary: '#e2edf5',
  textSecondary: '#7AAEC5',
  textMuted: '#6B7280',
  inputBg: '#0d1b26',
  inputBorder: '#1e3347',
  accent: '#5a9ab7',
  accentHover: '#4585a1',
  accentLight: '#152030',
  accentMid: '#1e3347',
  divider: '#1e3347',
  cardFrontBg: 'linear-gradient(145deg, #152030, #111f2d)',
  cardFrontBorder: '#1e3347',
  cardLabelBg: '#1e3347',
  cardLabelColor: '#7AAEC5',
};

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);
  const c = isDark ? dark : light;
  return (
    <ThemeContext.Provider value={{ isDark, toggle: () => setIsDark(d => !d), c }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
