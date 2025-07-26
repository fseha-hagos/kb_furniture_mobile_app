import { useColorScheme as useSystemColorScheme } from 'react-native';
import { useThemePreference } from '../app/context/themeContext';

export function useColorScheme() {
  const { theme } = useThemePreference();
  return theme || useSystemColorScheme() || 'light';
}
