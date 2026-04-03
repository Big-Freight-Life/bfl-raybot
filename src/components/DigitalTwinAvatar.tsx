'use client';

import { Box, Typography } from '@mui/material';

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
              borderColor: '#14B8A6',
              animation: 'avatarPulse 2s ease-in-out infinite',
              '@keyframes avatarPulse': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
                '50%': { transform: 'scale(1.1)', opacity: 0.2 },
              },
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
              borderColor: '#117680',
              animation: 'avatarSpeak 0.8s ease-in-out infinite',
              '@keyframes avatarSpeak': {
                '0%, 100%': { transform: 'scale(1)', opacity: 0.4 },
                '50%': { transform: 'scale(1.15)', opacity: 0.1 },
              },
            }}
          />
        )}
        {/* Avatar circle */}
        <Box
          sx={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #117680, #14B8A6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: isSpeaking ? '0 0 30px rgba(20,184,166,0.3)' : '0 0 15px rgba(20,184,166,0.15)',
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
                    animation: 'soundBar 0.8s ease-in-out infinite',
                    animationDelay: `${i * 0.1}s`,
                    '@keyframes soundBar': {
                      '0%, 100%': { height: 8 },
                      '50%': { height: 28 + Math.random() * 12 },
                    },
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
