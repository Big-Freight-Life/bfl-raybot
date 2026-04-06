'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import StopIcon from '@mui/icons-material/Stop';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import ClearIcon from '@mui/icons-material/Clear';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { keyframes } from '@emotion/react';
const micPulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.15); }
`;

// C6: Email verification is client-side only. The email gate in EmailGate.tsx
// validates email format and MX records before granting chat access, but there
// is no server-side token enforcement on API routes. A malicious client can
// bypass the gate and call /api/chat directly. Server-side enforcement should
// be added to the API route layer (outside this component's scope).

interface ChatInputProps {
  onSend: (message: string, source?: 'voice' | 'text') => void;
  disabled?: boolean;
  isProcessing?: boolean;
  onStop?: () => void;
  voiceMuted: boolean;
  onToggleVoice: () => void;
  digitalTwinMode?: boolean;
  onListeningChange?: (listening: boolean) => void;
  onToggleDigitalTwin?: () => void;
  onMicActivated?: () => void;
}

export default function ChatInput({ onSend, disabled, isProcessing, onStop, voiceMuted, onToggleVoice, digitalTwinMode, onListeningChange, onToggleDigitalTwin, onMicActivated }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  // I2: Track restart timeout and mounted state for cleanup
  const restartTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    setSpeechSupported(!!SR);
  }, []);

  // I2: Cleanup on unmount — stop recognition and clear restart timeout
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
      recognitionRef.current?.stop();
      recognitionRef.current = null;
    };
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed, 'text');
    setText('');
    if (textareaRef.current) { textareaRef.current.style.height = 'auto'; textareaRef.current.focus(); }
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

  const toggleMic = useCallback(() => {
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false); onListeningChange?.(false); return; }
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.continuous = digitalTwinMode || false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';
    let finalTranscript = '';
    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setText(finalTranscript + interim);
      // In digital twin mode, auto-send when we get a final result
      if (digitalTwinMode && finalTranscript.trim() && event.results[event.results.length - 1].isFinal) {
        const toSend = finalTranscript.trim();
        finalTranscript = '';
        setText('');
        onSend(toSend, 'voice');
      }
    };
    recognition.onend = () => {
      setIsListening(false);
      onListeningChange?.(false);
      // I2: In digital twin mode, restart listening after a pause (only if still mounted)
      if (digitalTwinMode && !disabled && mountedRef.current) {
        if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
        restartTimerRef.current = setTimeout(() => {
          if (!mountedRef.current) return;
          if (recognitionRef.current) {
            try { recognition.start(); setIsListening(true); onListeningChange?.(true); } catch { /* ignore */ }
          }
        }, 500);
      }
    };
    recognition.onerror = () => { setIsListening(false); onListeningChange?.(false); };
    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
    onListeningChange?.(true);
    onMicActivated?.();
  }, [isListening, digitalTwinMode, disabled, onSend, onListeningChange, onMicActivated]);

  // Auto-start mic in digital twin mode
  useEffect(() => {
    if (digitalTwinMode && speechSupported && !isListening) {
      toggleMic();
    }
  }, [digitalTwinMode]); // intentionally limited deps — only trigger on mode change

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper', px: 2, pt: 2, pb: 1 }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, maxWidth: 768, width: '100%' }}>
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', border: 1, borderColor: 'divider', borderRadius: '12px', px: 1.5, py: 0.5, bgcolor: 'background.default', '&:focus-within': { borderColor: 'primary.main' } }}>
        {speechSupported && (
          <Tooltip title={isListening ? 'Stop listening' : 'Dictate'}>
            <IconButton size="small" onClick={toggleMic} sx={{ color: isListening ? 'primary.main' : 'text.secondary', mr: 0.5, animation: isListening ? `${micPulse} 1.5s ease-in-out infinite` : 'none' }}>
              {isListening ? <MicOffIcon sx={{ fontSize: 20 }} /> : <MicIcon sx={{ fontSize: 20 }} />}
            </IconButton>
          </Tooltip>
        )}
        <Box
          component="textarea" ref={textareaRef} id="chat-input" name="message" value={text} onChange={handleInput} onKeyDown={handleKeyDown}
          placeholder='Try "design an agent workflow"' rows={1} disabled={disabled}
          sx={{ flex: 1, border: 'none', outline: 'none', resize: 'none', fontFamily: 'inherit', fontSize: '0.875rem', lineHeight: 1.5, bgcolor: 'transparent', color: 'text.primary', py: 1, '&::placeholder': { color: 'text.secondary', opacity: 0.6 } }}
        />
        {text && (
          <IconButton size="small" onClick={() => { setText(''); if (textareaRef.current) textareaRef.current.style.height = 'auto'; }} sx={{ color: 'text.secondary' }}>
            <ClearIcon sx={{ fontSize: 18 }} />
          </IconButton>
        )}
        <Tooltip title={voiceMuted ? 'Unmute voice' : 'Mute voice'}>
          <IconButton size="small" onClick={onToggleVoice} sx={{ color: voiceMuted ? 'text.secondary' : 'primary.main' }}>
            {voiceMuted ? <VolumeOffIcon sx={{ fontSize: 20 }} /> : <VolumeUpIcon sx={{ fontSize: 20 }} />}
          </IconButton>
        </Tooltip>
      </Box>
      {isProcessing ? (
        <Tooltip title="Stop generating">
          <IconButton size="small" onClick={onStop}
            sx={{ bgcolor: 'text.secondary', color: '#fff', mb: 0.5, '&:hover': { bgcolor: 'text.primary' } }}>
            <StopIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Tooltip>
      ) : text.trim() ? (
        <IconButton size="small" onClick={handleSubmit} disabled={disabled}
          sx={{ bgcolor: 'primary.main', color: '#fff', mb: 0.5, '&:hover': { bgcolor: 'primary.dark' }, '&.Mui-disabled': { bgcolor: 'action.disabledBackground', color: 'action.disabled' } }}>
          <SendIcon sx={{ fontSize: 18 }} />
        </IconButton>
      ) : null}
      </Box>
      <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', color: 'text.secondary', mt: 0.5, fontSize: '0.7rem' }}>
        Raybot can make mistakes. <Box component="a" href="https://bfl.design/contact" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', textDecoration: 'underline' }}>Contact us</Box> for important stuff.
      </Typography>
    </Box>
  );
}
