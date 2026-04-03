'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { colors } from '@/theme/tokens';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{ bgcolor: 'background.paper', color: 'text.primary', borderBottom: 1, borderColor: 'divider' }}
    >
      <Toolbar sx={{ minHeight: 56, px: { xs: 2, md: 3 } }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem', flex: 1 }}>
          <Box component="span" sx={{ color: colors.primary.main }}>ray</Box>bot
        </Typography>
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
