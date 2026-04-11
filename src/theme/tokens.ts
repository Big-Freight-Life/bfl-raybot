export const colors = {
  primary: { main: '#007AFF', dark: '#0062CC', light: '#3395FF' },
  accent: { main: '#C2703E', dark: '#A35C30', light: '#D4875A' },
  gray: {
    50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
    400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
    800: '#1f2937', 900: '#111827',
  },
  chat: {
    userBubble: 'rgba(0, 122, 255, 0.06)',
    userText: '#111827',
    userTextDark: '#e5e5e5',
    botBubble: '#f3f4f6',
    botText: '#111827',
  },
} as const;

export const darkColors = {
  primary: { main: '#0A84FF', dark: '#007AFF', light: '#409CFF' },
  accent: { main: '#D4875A', dark: '#C2703E', light: '#E8A97A' },
  chat: {
    userBubble: 'rgba(10, 132, 255, 0.12)',
    botBubble: '#1a1a1a',
    botText: '#e5e5e5',
  },
  gray: {
    50: '#1e1e1e', 100: '#2a2a2a', 200: '#333333', 300: '#444444',
    400: '#666666', 500: '#888888', 600: '#aaaaaa', 700: '#cccccc',
    800: '#dddddd', 900: '#e5e5e5',
  },
} as const;

export const typography = {
  fontFamily: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  monoFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
} as const;
