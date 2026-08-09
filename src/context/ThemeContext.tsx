'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeMode, ColorAccentMode } from '../types/theme';
import { getStorageItem, setStorageItem } from '../lib/storage';

interface ThemeContextType {
  theme: ThemeMode;
  colorMode: ColorAccentMode;
  setTheme: (theme: ThemeMode) => void;
  setColorMode: (colorMode: ColorAccentMode) => void;
}

const THEME_STORAGE_KEY = 'ablespace_theme';
const COLOR_MODE_STORAGE_KEY = 'ablespace_color_mode';

const COLOR_MAP: Record<ColorAccentMode, { primary: string; hover: string; lightBg: string; text: string }> = {
  amber: { primary: '#f59e0b', hover: '#d97706', lightBg: 'rgba(245, 158, 11, 0.15)', text: '#b45309' },
  blue: { primary: '#3b82f6', hover: '#2563eb', lightBg: 'rgba(59, 130, 246, 0.15)', text: '#1d4ed8' },
  pink: { primary: '#ec4899', hover: '#db2777', lightBg: 'rgba(236, 72, 153, 0.15)', text: '#be185d' },
  rose: { primary: '#f43f5e', hover: '#e11d48', lightBg: 'rgba(244, 63, 94, 0.15)', text: '#be123c' },
  emerald: { primary: '#10b981', hover: '#059669', lightBg: 'rgba(16, 185, 129, 0.15)', text: '#047857' },
  black: { primary: '#18181b', hover: '#09090b', lightBg: 'rgba(24, 24, 27, 0.12)', text: '#18181b' },
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');
  const [colorMode, setColorModeState] = useState<ColorAccentMode>('black');

  useEffect(() => {
    const savedTheme = getStorageItem<ThemeMode>(THEME_STORAGE_KEY, 'light');
    const savedColorMode = getStorageItem<ColorAccentMode>(COLOR_MODE_STORAGE_KEY, 'black');
    
    setThemeState(savedTheme);
    setColorModeState(savedColorMode);
    
    applyThemeAndColor(savedTheme, savedColorMode);
  }, []);

  const applyThemeAndColor = (t: ThemeMode, c: ColorAccentMode) => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;

    // Apply dark class
    if (t === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Set accent color CSS variables
    const palette = COLOR_MAP[c] || COLOR_MAP.black;
    root.style.setProperty('--accent-primary', palette.primary);
    root.style.setProperty('--accent-hover', palette.hover);
    root.style.setProperty('--accent-light-bg', palette.lightBg);
    root.style.setProperty('--accent-text', palette.text);
    root.setAttribute('data-color-mode', c);
  };

  const setTheme = (newTheme: ThemeMode) => {
    setThemeState(newTheme);
    setStorageItem(THEME_STORAGE_KEY, newTheme);
    applyThemeAndColor(newTheme, colorMode);
  };

  const setColorMode = (newColorMode: ColorAccentMode) => {
    setColorModeState(newColorMode);
    setStorageItem(COLOR_MODE_STORAGE_KEY, newColorMode);
    applyThemeAndColor(theme, newColorMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, colorMode, setTheme, setColorMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
