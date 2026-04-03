'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, Button, IconButton, Tooltip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import { colors } from '@/theme/tokens';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const downloadTranscript = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('raybot_history');
      if (!raw) return;
      const messages = JSON.parse(raw) as { role: string; content: string }[];
      const text = messages
        .map((m) => `${m.role === 'user' ? 'You' : 'Raybot'}: ${m.content}`)
        .join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raybot-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Left icon sidebar */}
      <IconSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar with raybot title */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: 49, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1rem' }}>
            <Box component="span" sx={{ color: colors.primary.main }}>ray</Box>bot
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Tooltip title="Download transcript">
              <IconButton size="small" onClick={downloadTranscript} sx={{ color: 'text.secondary' }}>
                <DownloadIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Button
              component="a"
              href="https://bfl.design"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8125rem' }}
            >
              bfl.design
            </Button>
          </Box>
        </Box>

        {/* Chat — full width */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <ChatPanel />
        </Box>
      </Box>
    </Box>
  );
}
