export const colors = {
  primary: { main: '#14B8A6', dark: '#0D9488', light: '#2DD4BF' },
  gray: {
    50: '#f9fafb', 100: '#f3f4f6', 200: '#e5e7eb', 300: '#d1d5db',
    400: '#9ca3af', 500: '#6b7280', 600: '#4b5563', 700: '#374151',
    800: '#1f2937', 900: '#111827',
  },
  chat: {
    userBubble: 'rgba(17, 118, 128, 0.15)',
    userText: '#111827',
    userTextDark: '#e5e5e5',
    botBubble: '#f3f4f6',
    botText: '#111827',
  },
} as const;

export const typography = {
  fontFamily: "'Poppins', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  monoFamily: "'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace",
} as const;
