'use client';

import { Box, Typography } from '@mui/material';
import { colors } from '@/theme/tokens';

interface AvatarStageProps {
  isSpeaking: boolean;
  isListening: boolean;
}

export default function AvatarStage({ isSpeaking, isListening }: AvatarStageProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: '#0a0a0a',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <Box
        sx={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${isSpeaking ? 'rgba(17,118,128,0.15)' : 'rgba(17,118,128,0.06)'} 0%, transparent 70%)`,
          transition: 'background 0.5s ease',
        }}
      />

      {/* Avatar placeholder — will be replaced with HeyGen */}
      <Box
        sx={{
          position: 'relative',
          width: 200,
          height: 200,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* Outer ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: -16,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: isListening ? 'rgba(20,184,166,0.5)' : 'rgba(255,255,255,0.08)',
            animation: isListening ? 'stageRingPulse 2s ease-in-out infinite' : 'none',
            transition: 'border-color 0.3s ease',
            '@keyframes stageRingPulse': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.5 },
              '50%': { transform: 'scale(1.08)', opacity: 0.2 },
            },
          }}
        />
        {/* Inner ring */}
        <Box
          sx={{
            position: 'absolute',
            inset: -6,
            borderRadius: '50%',
            border: '2px solid',
            borderColor: isSpeaking ? 'rgba(20,184,166,0.6)' : 'rgba(255,255,255,0.05)',
            animation: isSpeaking ? 'stageRingSpeak 1s ease-in-out infinite' : 'none',
            transition: 'border-color 0.3s ease',
            '@keyframes stageRingSpeak': {
              '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
              '50%': { transform: 'scale(1.05)', opacity: 0.3 },
            },
          }}
        />
        {/* Avatar circle */}
        <Box
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            background: 'linear-gradient(160deg, #1a1a1a 0%, #0d0d0d 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
        >
          {/* Sound wave visualization when speaking */}
          {isSpeaking ? (
            <Box sx={{ display: 'flex', gap: '4px', alignItems: 'center', height: 48 }}>
              {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                <Box
                  key={i}
                  sx={{
                    width: 3,
                    bgcolor: colors.primary.main,
                    borderRadius: 2,
                    animation: `waveBar 0.6s ease-in-out infinite`,
                    animationDelay: `${i * 0.08}s`,
                    '@keyframes waveBar': {
                      '0%, 100%': { height: 6 },
                      '50%': { height: 32 },
                    },
                  }}
                />
              ))}
            </Box>
          ) : (
            <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '3.5rem', fontWeight: 700, lineHeight: 1 }}>
              R
            </Typography>
          )}
        </Box>
      </Box>

      {/* Status */}
      <Typography
        variant="caption"
        sx={{
          color: 'rgba(255,255,255,0.4)',
          mt: 3,
          fontSize: '0.75rem',
          letterSpacing: '0.05em',
        }}
      >
        {isSpeaking ? 'Raybot is speaking...' : isListening ? 'Listening...' : 'HeyGen Avatar — Coming Soon'}
      </Typography>
    </Box>
  );
}
