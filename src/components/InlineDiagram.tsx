'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

mermaid.initialize({
  startOnLoad: false,
  theme: 'neutral',
  securityLevel: 'strict',
  suppressErrorRendering: true,
});

interface InlineDiagramProps {
  code: string;
}

// Note: innerHTML usage below is safe because DOMPurify.sanitize() strips all
// dangerous content from the Mermaid SVG output before insertion.
export default function InlineDiagram({ code }: InlineDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  const renderDiagram = useCallback(async () => {
    if (!code || !containerRef.current) return;
    setError(false);
    const id = `mermaid-inline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const { svg } = await mermaid.render(id, code);
      const clean = DOMPurify.sanitize(svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
        ADD_TAGS: ['foreignObject'],
      });
      if (containerRef.current) {
        containerRef.current.textContent = '';
        const wrapper = document.createElement('div');
        wrapper.innerHTML = clean; // Safe: sanitized by DOMPurify above
        containerRef.current.appendChild(wrapper);
      }
    } catch {
      setError(true);
    }
  }, [code]);

  useEffect(() => { renderDiagram(); }, [renderDiagram]);

  if (error) {
    return <Typography variant="caption" color="error">Could not render diagram.</Typography>;
  }

  return (
    <Box
      ref={containerRef}
      sx={{
        my: 1.5,
        p: 2,
        bgcolor: '#fff',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        '& svg': { maxWidth: '100%', height: 'auto' },
      }}
    />
  );
}
