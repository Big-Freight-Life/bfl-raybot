'use client';

import { useRef, useEffect } from 'react';
import { Box, useTheme } from '@mui/material';

interface VoiceWaveBorderProps {
  isSpeaking: boolean;
  width: number;
  height: number;
}

export default function VoiceWaveBorder({ isSpeaking, width, height }: VoiceWaveBorderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const amplitudeRef = useRef(0);
  const theme = useTheme();
  const color = theme.palette.primary.main;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const radius = 12;
    const targetAmplitude = isSpeaking ? 1 : 0;

    const draw = () => {
      // Smooth amplitude transition
      amplitudeRef.current += (targetAmplitude - amplitudeRef.current) * 0.08;
      const amp = amplitudeRef.current;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.beginPath();

      const time = Date.now() / 1000;
      const maxWave = 4; // max wave height in px
      const segments = 80;

      // Draw rounded rect with wave on top and bottom edges
      // Start at top-left after corner
      ctx.moveTo(radius, 0 + waveY(0, radius, width - radius, time, amp, maxWave, true));

      // Top edge — wave
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = radius + t * (width - 2 * radius);
        const y = waveY(x, radius, width - radius, time, amp, maxWave, true);
        ctx.lineTo(x, y);
      }

      // Top-right corner
      ctx.arcTo(width, 0, width, radius, radius);

      // Right edge — straight
      ctx.lineTo(width, height - radius);

      // Bottom-right corner
      ctx.arcTo(width, height, width - radius, height, radius);

      // Bottom edge — wave (reversed)
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = width - radius - t * (width - 2 * radius);
        const y = height + waveY(x, radius, width - radius, time, amp, maxWave, false);
        ctx.lineTo(x, y);
      }

      // Bottom-left corner
      ctx.arcTo(0, height, 0, height - radius, radius);

      // Left edge — straight
      ctx.lineTo(0, radius);

      // Top-left corner
      ctx.arcTo(0, 0, radius, 0, radius);

      ctx.stroke();

      animRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animRef.current);
  }, [isSpeaking, width, height, color]);

  return (
    <Box
      sx={{
        position: 'absolute',
        inset: -1, // overlap the border
        pointerEvents: 'none',
        zIndex: 1,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: width, height: height, display: 'block' }}
      />
    </Box>
  );
}

// Generate wave displacement for a point along an edge
function waveY(
  x: number,
  startX: number,
  endX: number,
  time: number,
  amplitude: number,
  maxWave: number,
  isTop: boolean,
): number {
  if (amplitude < 0.01) return 0;

  const range = endX - startX;
  const normalizedX = (x - startX) / range;

  // Fade in/out at edges so wave doesn't distort corners
  const edgeFade = Math.sin(normalizedX * Math.PI);

  // Multiple sine waves at different frequencies for organic feel
  const wave =
    Math.sin(normalizedX * 12 + time * 5) * 0.5 +
    Math.sin(normalizedX * 18 - time * 3.5) * 0.3 +
    Math.sin(normalizedX * 8 + time * 7) * 0.2;

  const displacement = wave * maxWave * amplitude * edgeFade;
  return isTop ? -displacement : displacement;
}
