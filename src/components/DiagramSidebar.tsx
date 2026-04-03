'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'strict' });

interface DiagramSidebarProps {
  mermaidCode: string | null;
}

export default function DiagramSidebar({ mermaidCode }: DiagramSidebarProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [error, setError] = useState(false);

  const renderDiagram = useCallback(async () => {
    if (!mermaidCode || !containerRef.current) return;
    setError(false);
    const id = `mermaid-${Date.now()}`;
    try {
      const { svg } = await mermaid.render(id, mermaidCode);
      // Sanitize SVG output with DOMPurify before inserting into DOM
      const clean = DOMPurify.sanitize(svg, { USE_PROFILES: { svg: true, svgFilters: true } });
      if (containerRef.current) {
        containerRef.current.textContent = '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = clean;
        containerRef.current.appendChild(wrapper);
      }
    } catch {
      setError(true);
    }
  }, [mermaidCode]);

  useEffect(() => { renderDiagram(); }, [renderDiagram]);

  return (
    <Box sx={{
      height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default',
      borderLeft: { md: 1 }, borderColor: 'divider',
      position: fullscreen ? 'fixed' : 'relative', inset: fullscreen ? 0 : 'auto', zIndex: fullscreen ? 1300 : 'auto',
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="caption" sx={{ fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', color: 'text.secondary' }}>
          Diagram
        </Typography>
        {mermaidCode && (
          <Tooltip title={fullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
            <IconButton size="small" onClick={() => setFullscreen(!fullscreen)} sx={{ color: 'text.secondary' }}>
              {fullscreen ? <FullscreenExitIcon sx={{ fontSize: 18 }} /> : <FullscreenIcon sx={{ fontSize: 18 }} />}
            </IconButton>
          </Tooltip>
        )}
      </Box>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', p: 3, overflow: 'auto' }}>
        {!mermaidCode && !error && (
          <Box sx={{ textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="body2" sx={{ mb: 1 }}>No diagram yet</Typography>
            <Typography variant="caption">Ask about a workflow or system and a diagram will appear here.</Typography>
          </Box>
        )}
        {error && <Typography variant="body2" color="error">Could not render diagram.</Typography>}
        <Box ref={containerRef} sx={{ '& svg': { maxWidth: '100%', height: 'auto' }, display: mermaidCode && !error ? 'block' : 'none' }} />
      </Box>
    </Box>
  );
}
