import { useEffect, useState } from 'react';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { useThemePreference } from '../app/context/themeContext';

export function useColorScheme() {
  const { theme } = useThemePreference();
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  const colorScheme = useRNColorScheme();

  if (hasHydrated) {
    return theme || colorScheme || 'light';
  }

  return 'light';
}
