'use client';

import { Box } from '@mui/material';
import { keyframes } from '@emotion/react';

// M3: Extract keyframes to module level to prevent duplicate style injection
const thinkingBounce = keyframes`
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
`;

export default function ThinkingDots() {
  return (
    <Box sx={{ display: 'flex', gap: '4px', py: 1, px: 0.5 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            bgcolor: 'text.secondary',
            animation: `${thinkingBounce} 1.4s ease-in-out infinite`,
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </Box>
  );
}
