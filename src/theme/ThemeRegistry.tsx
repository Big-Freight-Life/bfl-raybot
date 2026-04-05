'use client';

import { useMemo, type ReactNode } from 'react';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { useThemeMode } from '@/hooks/useThemeMode';
import { lightTheme, darkTheme } from './theme';

export default function ThemeRegistry({ children }: { children: ReactNode }) {
  const { mode, mounted } = useThemeMode();
  const theme = useMemo(() => (mode === 'dark' ? darkTheme : lightTheme), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ visibility: mounted ? 'visible' : 'hidden' }}>
        {children}
      </Box>
    </ThemeProvider>
  );
}
