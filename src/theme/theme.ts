'use client';

import { createTheme } from '@mui/material/styles';
import { colors, typography } from './tokens';

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
    primary: { main: colors.primary.light, dark: colors.primary.main, light: colors.primary.light, contrastText: '#000' },
    background: { default: '#0a0a0a', paper: '#141414' },
    text: { primary: '#e5e5e5', secondary: '#a3a3a3' },
    divider: '#2a2a2a',
  },
  typography: { fontFamily: typography.fontFamily },
  components: {
    MuiButton: {
      styleOverrides: {
        containedPrimary: { color: '#000000', '&:hover': { color: '#000000' } },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
  },
});
