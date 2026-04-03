'use client';

import { useState } from 'react';
import { Box } from '@mui/material';
import Header from '@/components/Header';
import ChatPanel from '@/components/ChatPanel';
import DiagramSidebar from '@/components/DiagramSidebar';

export default function Home() {
  const [mermaidCode, setMermaidCode] = useState<string | null>(null);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <ChatPanel onDiagramDetected={setMermaidCode} />
        </Box>
        <Box sx={{ display: { xs: 'none', md: 'flex' }, width: 420, flexShrink: 0 }}>
          <DiagramSidebar mermaidCode={mermaidCode} />
        </Box>
      </Box>
    </Box>
  );
}
