'use client';

import { Box, Typography, IconButton, Tooltip } from '@mui/material';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import PsychologyIcon from '@mui/icons-material/Psychology';
import ChatIcon from '@mui/icons-material/Chat';
import { colors } from '@/theme/tokens';

interface AvatarStageProps {
  isSpeaking: boolean;
  isListening: boolean;
  voiceMuted: boolean;
  onToggleVoice: () => void;
  onToggleMic: () => void;
  onToggleDigitalTwin: () => void;
  micActive: boolean;
}

export default function AvatarStage({ isSpeaking, isListening, voiceMuted, onToggleVoice, onToggleMic, onToggleDigitalTwin, micActive }: AvatarStageProps) {
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

      {/* Toolbar */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 24,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 1,
          p: 1,
          borderRadius: '16px',
          bgcolor: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Tooltip title={voiceMuted ? 'Unmute voice' : 'Mute voice'}>
          <IconButton size="small" onClick={onToggleVoice} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            {voiceMuted ? <VolumeOffIcon sx={{ fontSize: 22 }} /> : <VolumeUpIcon sx={{ fontSize: 22 }} />}
          </IconButton>
        </Tooltip>
        <Tooltip title={micActive ? 'Mute mic' : 'Unmute mic'}>
          <IconButton
            size="small"
            onClick={onToggleMic}
            sx={{
              color: micActive ? colors.primary.main : 'rgba(255,255,255,0.7)',
              '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' },
              animation: micActive ? 'micGlow 2s ease-in-out infinite' : 'none',
              '@keyframes micGlow': {
                '0%, 100%': { boxShadow: 'none' },
                '50%': { boxShadow: '0 0 12px rgba(20,184,166,0.3)' },
              },
            }}
          >
            {micActive ? <MicIcon sx={{ fontSize: 22 }} /> : <MicOffIcon sx={{ fontSize: 22 }} />}
          </IconButton>
        </Tooltip>
        <Tooltip title="Switch to chat">
          <IconButton size="small" onClick={onToggleDigitalTwin} sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' } }}>
            <ChatIcon sx={{ fontSize: 22 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}
