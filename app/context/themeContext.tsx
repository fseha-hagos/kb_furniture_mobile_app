import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export type ThemePreference = 'light' | 'dark' | 'system';

interface ThemeContextProps {
  theme: 'light' | 'dark';
  preference: ThemePreference;
  setPreference: (pref: ThemePreference) => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const THEME_KEY = 'theme-preference';

function getSystemColorScheme(): 'light' | 'dark' {
  // Use window.matchMedia for web, or fallback to light
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  // For React Native, you would use Appearance.getColorScheme(), but this is a web fallback
  return 'light';
}

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [preference, setPreferenceState] = useState<ThemePreference>('system');
  const [theme, setTheme] = useState<'light' | 'dark'>(getSystemColorScheme());

  useEffect(() => {
    AsyncStorage.getItem(THEME_KEY).then((stored) => {
      if (stored === 'light' || stored === 'dark' || stored === 'system') {
        setPreferenceState(stored);
      }
    });
  }, []);

  useEffect(() => {
    if (preference === 'system') {
      setTheme(getSystemColorScheme());
    } else {
      setTheme(preference);
    }
    AsyncStorage.setItem(THEME_KEY, preference);
  }, [preference]);

  // Listen to system changes if preference is 'system'
  useEffect(() => {
    if (preference !== 'system') return;
    if (typeof window !== 'undefined' && window.matchMedia) {
      const mql = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => {
        setTheme(e.matches ? 'dark' : 'light');
      };
      mql.addEventListener('change', handler);
      return () => mql.removeEventListener('change', handler);
    }
  }, [preference]);

  const setPreference = (pref: ThemePreference) => {
    setPreferenceState(pref);
  };

  return (
    <ThemeContext.Provider value={{ theme, preference, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemePreference = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemePreference must be used within ThemeProvider');
  return ctx;
};

export default ThemeProvider; 