/**
 * Theme colors based on the CSS theme provided
 * Adapted for React Native with light and dark mode support
 */

import { Platform } from 'react-native';

// Light mode colors (from CSS :root)
export const Colors = {
  light: {
    background: '#D9D8D8',
    foreground: '#030213', // oklch(0.145 0 0) approximated
    card: '#ffffff',
    cardForeground: '#030213',
    primary: '#030213',
    primaryForeground: '#ffffff',
    secondary: '#f3f3f5', // oklch(0.95 0.0058 264.53) approximated
    secondaryForeground: '#030213',
    muted: '#ececf0',
    mutedForeground: '#717182',
    accent: '#e9ebef',
    accentForeground: '#030213',
    border: 'rgba(0, 0, 0, 0.1)',
    input: 'transparent',
    inputBackground: '#f3f3f5',
    // Custom colors for the app
    blue: {
      50: '#E6F4FE',
      100: '#A1CEDC',
      200: '#A1CEDC',
      500: '#0a7ea4',
      600: '#0a7ea4',
    },
    purple: {
      50: '#F1F0F1',
      100: '#F1F0F1',
      200: '#F1F0F1',
      500: '#F1F0F1',
      600: '#717182',
    },
    emerald: {
      50: '#e8f5e9',
      100: '#c8e6c9',
      200: '#a5d6a7',
      500: '#316B37',
      600: '#2e5f33',
    },
    gray: {
      50: '#f9fafb',
      100: '#f3f4f6',
      200: '#e5e7eb',
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
      600: '#4b5563',
      700: '#374151',
      800: '#1f2937',
    },
  },
  dark: {
    background: '#030213', // oklch(0.145 0 0) approximated
    foreground: '#fafafa', // oklch(0.985 0 0) approximated
    card: '#030213',
    cardForeground: '#fafafa',
    primary: '#fafafa',
    primaryForeground: '#030213',
    secondary: '#1a1a2e', // oklch(0.269 0 0) approximated
    secondaryForeground: '#fafafa',
    muted: '#1a1a2e',
    mutedForeground: '#9ca3af', // oklch(0.708 0 0) approximated
    accent: '#1a1a2e',
    accentForeground: '#fafafa',
    border: '#1a1a2e',
    input: '#1a1a2e',
    inputBackground: '#1a1a2e',
    // Custom colors for dark mode
    blue: {
      50: '#1e3a5f',
      100: '#2d4a6f',
      200: '#2d4a6f',
      500: '#60a5fa',
      600: '#3b82f6',
    },
    purple: {
      50: '#9ca3af',
      100: '#9ca3af',
      200: '#9ca3af',
      500: '#9ca3af',
      600: '#9ca3af',
    },
    emerald: {
      50: '#064e3b',
      100: '#065f46',
      200: '#065f46',
      500: '#10b981',
      600: '#059669',
    },
    gray: {
      50: '#1f2937',
      100: '#374151',
      200: '#4b5563',
      300: '#6b7280',
      400: '#9ca3af',
      500: '#d1d5db',
      600: '#e5e7eb',
      700: '#f3f4f6',
      800: '#f9fafb',
    },
  },
};

export const Fonts = Platform.select({
  ios: {
    sans: 'system',
    serif: 'serif',
    rounded: 'system',
    mono: 'monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Spacing and sizing constants
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BorderRadius = {
  sm: 8,
  md: 10,
  lg: 12,
  xl: 16,
  xxl: 20,
};

export const FontSizes = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
};

export const FontWeights = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};
