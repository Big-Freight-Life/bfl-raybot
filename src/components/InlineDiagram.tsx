'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import mermaid from 'mermaid';
import DOMPurify from 'dompurify';

// M1: Singleton guard — only initialize mermaid once
let mermaidInitialized = false;

interface InlineDiagramProps {
  code: string;
}

// Security note: The innerHTML assignment below is intentional and safe.
// DOMPurify.sanitize() strips all dangerous content from the Mermaid SVG
// output before DOM insertion. The foreignObject tag has been removed from
// the allowlist (C4) to prevent arbitrary HTML inside SVG.
export default function InlineDiagram({ code }: InlineDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  const renderDiagram = useCallback(async () => {
    if (!code || !containerRef.current) return;

    // M1: Singleton mermaid initialization
    if (!mermaidInitialized) {
      mermaid.initialize({ startOnLoad: false, theme: 'dark' });
      mermaidInitialized = true;
    }

    setError(false);
    const id = `mermaid-inline-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    try {
      const { svg } = await mermaid.render(id, code);
      // C4: Removed ADD_TAGS: ['foreignObject'] — it allows arbitrary HTML inside SVG
      const clean = DOMPurify.sanitize(svg, {
        USE_PROFILES: { svg: true, svgFilters: true },
      });
      if (containerRef.current) {
        containerRef.current.textContent = '';
        const wrapper = document.createElement('div');
        // Safe: content is sanitized by DOMPurify above
        wrapper.innerHTML = clean;
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
