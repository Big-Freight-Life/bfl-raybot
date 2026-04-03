'use client';

import { Box, Typography } from '@mui/material';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import { colors } from '@/theme/tokens';

export default function Home() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left icon sidebar */}
      <IconSidebar />

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar with raybot title */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            <Box component="span" sx={{ color: colors.primary.main }}>ray</Box>bot
          </Typography>
        </Box>

        {/* Chat — full width */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <ChatPanel />
        </Box>
      </Box>
    </Box>
  );
}
