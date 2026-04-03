'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ClearIcon from '@mui/icons-material/Clear';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { colors } from '@/theme/tokens';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
  voiceMuted: boolean;
  onToggleVoice: () => void;
}

export default function ChatInput({ onSend, disabled, voiceMuted, onToggleVoice }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setText('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  }, [text, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  };

  const toggleMic = () => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results).map((r) => r[0].transcript).join('');
      setText(transcript);
    };
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: 600, width: '100%' }}>
      <Tooltip title={voiceMuted ? 'Unmute voice' : 'Mute voice'}>
        <IconButton size="small" onClick={onToggleVoice} sx={{ color: 'text.secondary', mb: 0.5 }}>
          {voiceMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
        </IconButton>
      </Tooltip>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-end', border: 1, borderColor: 'divider', borderRadius: '12px', px: 1.5, py: 0.5, bgcolor: 'background.default', '&:focus-within': { borderColor: colors.primary.main } }}>
        <Box
          component="textarea" ref={textareaRef} value={text} onChange={handleInput} onKeyDown={handleKeyDown}
          placeholder='Try "design an agent workflow"' rows={1} disabled={disabled}
          sx={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: 1.5, bgcolor: 'transparent', color: 'text.primary', py: 1, '&::placeholder': { color: 'text.secondary', opacity: 0.6 } }}
        />
        {text && (
          <IconButton size="small" onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }} sx={{ color: 'text.secondary' }}>
            <ClearIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
      </Box>
      {speechSupported && (
        <Tooltip title={isListening ? 'Stop listening' : 'Voice input'}>
          <IconButton size="small" onClick={toggleMic} sx={{ color: isListening ? colors.primary.main : 'text.secondary', mb: 0.5, animation: isListening ? 'micPulse 1.5s ease-in-out infinite' : 'none', '@keyframes micPulse': { '0%, 100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.15)' } } }}>
            {isListening ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
        </Tooltip>
      )}
      <IconButton size="small" onClick={handleSubmit} disabled={!text.trim() || disabled}
        sx={{ bgcolor: colors.primary.main, color: '#fff', mb: 0.5, '&:hover': { bgcolor: colors.primary.dark }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' } }}>
        <SendIcon sx={{ fontSize: 18 }} />
      </IconButton>
      </Box>
    </Box>
  );
}
