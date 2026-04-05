'use client';

import { useState, useEffect, useCallback } from 'react';

type ThemeMode = 'light' | 'dark';

export function useThemeMode() {
  const [mode, setMode] = useState<ThemeMode>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme-mode') as ThemeMode | null;
    if (stored) {
      setMode(stored);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setMode('dark');
    }
    setMounted(true);
  }, []);

  const toggleMode = useCallback(() => {
    setMode((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', next);
      return next;
    });
  }, []);

  return { mode, toggleMode, mounted };
}
