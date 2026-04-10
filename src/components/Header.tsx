'use client';

import { AppBar, Toolbar, Typography, Button, Box, IconButton, Tooltip } from '@mui/material';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import { useThemeMode } from '@/hooks/useThemeMode';

export default function Header() {
  const { mode, toggleMode } = useThemeMode();

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>
          <Box component="span" sx={{ color: 'primary.main' }}>ray</Box>butler
        </Typography>
        <Tooltip title={mode === 'light' ? 'Dark mode' : 'Light mode'}>
          <IconButton size="small" onClick={toggleMode} sx={{ color: 'text.secondary', mr: 1 }}>
            {mode === 'light' ? <DarkModeIcon sx={{ fontSize: 20 }} /> : <LightModeIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
        <Button
          component="a"
          href="https://bfl.design"
          target="_blank"
          rel="noopener noreferrer"
          size="small"
          sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8125rem' }}
        >
          bfl.design
        </Button>
      </Toolbar>
    </AppBar>
  );
}
