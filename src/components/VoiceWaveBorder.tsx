'use client';

import { useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';

interface VoiceWaveLineProps {
  isSpeaking: boolean;
}

export default function VoiceWaveLine({ isSpeaking }: VoiceWaveLineProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<number>(0);
  const amplitudeRef = useRef(0);
  const theme = useTheme();
  const color = theme.palette.primary.main;

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const targetAmplitude = isSpeaking ? 1 : 0;

    const draw = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Smooth amplitude transition
      amplitudeRef.current += (targetAmplitude - amplitudeRef.current) * 0.06;
      const amp = amplitudeRef.current;

      const cy = h / 2;
      const time = Date.now() / 1000;
      const maxWave = 10;
      const segments = 120;

      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.beginPath();

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = t * w;

        // Fade at edges so wave tapers smoothly
        const fade = Math.sin(t * Math.PI);

        // Multi-frequency wave for organic feel
        const wave =
          Math.sin(t * 14 + time * 5) * 0.45 +
          Math.sin(t * 20 - time * 3.5) * 0.3 +
          Math.sin(t * 9 + time * 7) * 0.25;

        const y = cy + wave * maxWave * fade * amp;

        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }

      ctx.stroke();
      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [isSpeaking, color]);

  return (
    <Box
      ref={containerRef}
      sx={{
        position: 'absolute',
        left: 100,
        right: 100,
        top: 0,
        bottom: 0,
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </Box>
  );
}
