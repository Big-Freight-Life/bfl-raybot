'use client';

import { createTheme } from '@mui/material/styles';
import { colors, darkColors, typography } from './tokens';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: colors.primary.main, dark: colors.primary.dark, light: colors.primary.light, contrastText: '#fff' },
    background: { default: '#ffffff', paper: '#ffffff' },
    text: { primary: colors.gray[900], secondary: colors.gray[600] },
    divider: colors.gray[200],
  },
  typography: { fontFamily: typography.fontFamily },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: { color: '#ffffff', '&:hover': { color: '#ffffff' } },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: darkColors.primary.main, dark: darkColors.primary.dark, light: darkColors.primary.light, contrastText: '#fff' },
    background: { default: '#0a0a0a', paper: '#141414' },
    text: { primary: '#e5e5e5', secondary: '#a3a3a3' },
    divider: '#2a2a2a',
  },
  typography: { fontFamily: typography.fontFamily },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: { color: '#ffffff', '&:hover': { color: '#ffffff' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});
