'use client';

import { Box, Typography } from '@mui/material';
import { keyframes } from '@emotion/react';

// M3: Extract keyframes to module level to prevent duplicate style injection
const avatarPulse = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.1); opacity: 0.2; }
`;

const avatarSpeak = keyframes`
  0%, 100% { transform: scale(1); opacity: 0.4; }
  50% { transform: scale(1.15); opacity: 0.1; }
`;

const soundBar = keyframes`
  0%, 100% { height: 8px; }
  50% { height: var(--bar-height); }
`;

// I5: Fixed bar heights instead of Math.random()
const BAR_HEIGHTS = [32, 38, 28, 36, 30];

interface DigitalTwinAvatarProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export default function DigitalTwinAvatar({ isSpeaking, isListening }: DigitalTwinAvatarProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
        gap: 2,
      }}
    >
      {/* Avatar ring */}
      <Box
        sx={{
          position: 'relative',
          width: 120,
          height: 120,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Pulsing ring when listening */}
        {isListening && (
          <Box
            sx={{
              position: 'absolute',
              inset: -8,
              borderRadius: '50%',
              border: '2px solid',
              borderColor: '#D4875A',
              animation: `${avatarPulse} 2s ease-in-out infinite`,
            }}
          />
        )}
        {/* Speaking wave ring */}
        {isSpeaking && (
          <Box
            sx={{
              position: 'absolute',
              inset: -12,
              borderRadius: '50%',
              border: '3px solid',
              borderColor: '#C2703E',
              animation: `${avatarSpeak} 0.8s ease-in-out infinite`,
            }}
          />
        )}
        {/* Avatar circle */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #C2703E, #D4875A)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSpeaking ? '0 0 30px rgba(194,112,62,0.3)' : '0 0 15px rgba(194,112,62,0.15)',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          {/* Sound wave bars when speaking */}
          {isSpeaking ? (
            <Box sx={{ display: 'flex', gap: '3px', alignItems: 'center', height: 40 }}>
              {[0, 1, 2, 3, 4].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 4,
                    bgcolor: '#fff',
                    borderRadius: 2,
                    '--bar-height': `${BAR_HEIGHTS[i]}px`,
                    animation: `${soundBar} 0.8s ease-in-out infinite`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: '#fff', fontSize: '2.5rem', fontWeight: 700 }}>R</Typography>
          )}
        </Box>
      </Box>

      {/* Status text */}
      <Typography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.75rem' }}>
        {isSpeaking ? 'Speaking...' : isListening ? 'Listening...' : 'Ready'}
      </Typography>
    </Box>
  );
}
