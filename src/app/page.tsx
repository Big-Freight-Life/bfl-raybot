'use client';

import { useState } from 'react';
import { Box, Typography } from '@mui/material';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import { colors } from '@/theme/tokens';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left icon sidebar */}
      <IconSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar with raybot title */}
        <Box sx={{ display: 'flex', alignItems: 'center', px: 2, height: 49, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
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
