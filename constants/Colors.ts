/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors2 = {
  light: {
    text: '#000000',
    subtext: '#555555',
    background: '#FFFFFF',
    card: '#F9F6F1',
    primary: '#E87E1C', // Burnt orange (brand color)
    tint: '#007AFF',
    icon: '#333333',
    tabIconDefault: '#CCCCCC',
    tabIconSelected: '#007AFF',
  },
  dark: {
    text: '#FFFFFF',
    subtext: '#BBBBBB',
    background: '#000000',
    card: '#1C1C1C',
    primary: '#E87E1C', // Keep it consistent in dark mode
    tint: '#0A84FF',
    icon: '#CCCCCC',
    tabIconDefault: '#333333',
    tabIconSelected: '#0A84FF',
  },
};

export const Colors = {
  light: {
    text: '#333333',               // Dark gray for readability
    background: '#F9F6F1',         // Very light beige background
    primary: '#E87E1C', // Burnt orange (brand color)
    tint: '#E87E1C',               // Burnt orange from the logo
    icon: '#7A6C5D',               // Muted brown-gray for icons
    tabIconDefault: '#C1B9B0',     // Soft neutral for inactive icons
    tabIconSelected: '#E87E1C',    // Burnt orange (highlighted icon)
    card: '#FFFFFF',               // Card background (clean white)
    border: '#E0DAD3',             // Light beige-gray for borders
  },
  dark: {
    text: '#F1EDE6',               // Light warm text
    background: '#2C1B14',         // Deep brown background
    tint: '#FF9C3F',               // Lighter orange for better contrast
    primary: '#E87E1C', // Keep it consistent in dark mode
    icon: '#D4C6B4',               // Warm light brown icons
    tabIconDefault: '#8A7E75',     // Subtle icon tone
    tabIconSelected: '#FF9C3F',    // Highlighted icon
    card: '#3A2A20',               // Darker brown card background
    border: '#4D3C32',             // Slightly lighter for border contrast
  },
};
