/**
 * ThemeContext.tsx
 *
 * Global theme system for the Family App.
 * Provides Light / Dark / System theme switching.
 *
 * Usage:
 *   const { theme, colors } = useTheme();
 *   colors.background, colors.card, colors.text, etc.
 */

import React, { createContext, useContext, useState } from 'react';
import { useColorScheme } from 'react-native';

// ─── Theme types ──────────────────────────────────────────────────────────────
export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  background:    string;
  card:          string;
  cardAlt:       string;
  text:          string;
  textSub:       string;
  textMuted:     string;
  border:        string;
  primary:       string;
  primaryLight:  string;
  accent:        string;
  success:       string;
  warning:       string;
  danger:        string;
  navBar:        string;
  navBorder:     string;
  statusBar:     'dark-content' | 'light-content';
}

// ─── Light palette ────────────────────────────────────────────────────────────
const LIGHT: ThemeColors = {
  background:   '#f8fafc',
  card:         '#ffffff',
  cardAlt:      '#f1f5f9',
  text:         '#0f172a',
  textSub:      '#475569',
  textMuted:    '#94a3b8',
  border:       '#e2e8f0',
  primary:      '#6C3AE3',
  primaryLight: '#ede9fe',
  accent:       '#0EA5E9',
  success:      '#22c55e',
  warning:      '#f59e0b',
  danger:       '#ef4444',
  navBar:       '#ffffff',
  navBorder:    '#f1f5f9',
  statusBar:    'dark-content',
};

// ─── Dark palette ─────────────────────────────────────────────────────────────
const DARK: ThemeColors = {
  background:   '#0f172a',
  card:         '#1e293b',
  cardAlt:      '#162032',
  text:         '#f1f5f9',
  textSub:      '#94a3b8',
  textMuted:    '#64748b',
  border:       '#334155',
  primary:      '#818cf8',
  primaryLight: '#312e81',
  accent:       '#38bdf8',
  success:      '#4ade80',
  warning:      '#fbbf24',
  danger:       '#f87171',
  navBar:       '#1e293b',
  navBorder:    '#334155',
  statusBar:    'light-content',
};

// ─── Context ──────────────────────────────────────────────────────────────────
interface ThemeContextType {
  mode:      ThemeMode;
  colors:    ThemeColors;
  setMode:   (m: ThemeMode) => void;
  isDark:    boolean;
}

const ThemeContext = createContext<ThemeContextType>({
  mode:    'system',
  colors:  LIGHT,
  setMode: () => {},
  isDark:  false,
});

// ─── Provider ─────────────────────────────────────────────────────────────────
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme(); // 'light' | 'dark' | null
  const [mode, setMode] = useState<ThemeMode>('system');

  const isDark =
    mode === 'dark' ||
    (mode === 'system' && systemScheme === 'dark');

  const colors = isDark ? DARK : LIGHT;

  return (
    <ThemeContext.Provider value={{ mode, colors, setMode, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export const useTheme = () => useContext(ThemeContext);
