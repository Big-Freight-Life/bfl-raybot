'use client';

import { useState, useRef, useEffect } from 'react';
import { Box, Chip, Divider, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LeadCaptureForm from './LeadCaptureForm';
import { useAudioPlayer } from '@/hooks/useAudioPlayer';
import { useChat } from '@/hooks/useChat';
import { useChatHistory } from '@/hooks/useChatHistory';

// Re-export Message from shared types for backward compatibility
export type { Message } from '@/types/chat';
import type { Message } from '@/types/chat';

interface ChatPanelProps {
  sessionId: string;
  sessionTimestamp?: number;
  onDiagramDetected?: (code: string) => void;
  digitalTwinMode?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
  onListeningChange?: (listening: boolean) => void;
  onToggleDigitalTwin?: () => void;
  onMicActivated?: () => void;
  onVoiceMutedChange?: (muted: boolean) => void;
  triggerMessage?: string | null;
  triggerCaseStudy?: string | null;
  onTriggerHandled?: () => void;
  onMessagesChange?: (messages: Message[]) => void;
}

export default function ChatPanel({ sessionId, sessionTimestamp, onDiagramDetected, digitalTwinMode, onSpeakingChange, onListeningChange, onToggleDigitalTwin, onMicActivated, onVoiceMutedChange, triggerMessage, triggerCaseStudy, onTriggerHandled, onMessagesChange }: ChatPanelProps) {
  const [voiceMuted, setVoiceMuted] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const loadedRef = useRef(false);

  const { loadHistory, saveHistory } = useChatHistory();

  const { playTTS, stopAudio, isSpeaking, audioRef } = useAudioPlayer({
    voiceMuted,
    digitalTwinMode,
    onSpeakingChange,
  });

  const { messages, setMessages, isProcessing, sendMessage, stopResponse, showLeadForm } = useChat({
    sessionId,
    onDiagramDetected,
    saveHistory,
    playTTS,
  });

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const history = loadHistory();
    if (history.length) setMessages(history);
  }, [loadHistory, setMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Report messages to parent whenever they change
  useEffect(() => {
    const saveable = messages.filter((m) => !m.isThinking);
    if (saveable.length > 0) {
      onMessagesChange?.(saveable);
    }
  }, [messages, onMessagesChange]);

  // Handle triggered messages from sidebar navigation
  const [pendingTrigger, setPendingTrigger] = useState<string | null>(null);
  useEffect(() => {
    if (triggerMessage) {
      setPendingTrigger(triggerMessage);
      onTriggerHandled?.();
    }
  }, [triggerMessage, onTriggerHandled]);

  // Fire pending trigger now that sendMessage is available
  useEffect(() => {
    if (pendingTrigger && !isProcessing) {
      sendMessage(pendingTrigger, 'text');
      setPendingTrigger(null);
    }
  }, [pendingTrigger, isProcessing, sendMessage]);

  // Handle preloaded case study — inject a bot message with caseStudyKey, no API call
  useEffect(() => {
    if (!triggerCaseStudy) return;
    setMessages((prev) => {
      // Don't duplicate if already at the end
      const last = prev[prev.length - 1];
      if (last?.caseStudyKey === triggerCaseStudy) return prev;
      const next: Message[] = [
        ...prev,
        { role: 'bot', content: '', caseStudyKey: triggerCaseStudy, timestamp: Date.now() },
      ];
      saveHistory(next);
      return next;
    });
    onTriggerHandled?.();
  }, [triggerCaseStudy, setMessages, saveHistory, onTriggerHandled]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box sx={{ flex: 1, overflowY: 'auto', py: 2, px: { xs: 2, md: 3 }, scrollbarWidth: 'thin', maxWidth: 768, mx: 'auto', width: '100%' }}>
        {messages.length === 0 && (
          <Box sx={{ textAlign: 'center', pt: 8, px: 3, color: 'text.secondary' }}>
            <ChatBubbleOutlineIcon sx={{ fontSize: 40, mb: 2, color: 'text.disabled' }} />
            <Typography variant="body1">
              Hey! I&#39;m Raybot. Ask me about system design, AI architecture, or how we work.
            </Typography>
          </Box>
        )}
        {messages.map((msg, i) => {
          // Determine if we need a date divider before this message
          const msgTs = msg.timestamp ?? sessionTimestamp;
          const prevTs = i > 0 ? (messages[i - 1].timestamp ?? sessionTimestamp) : null;
          const showDivider =
            msgTs != null &&
            (i === 0 || (prevTs != null && new Date(msgTs).toDateString() !== new Date(prevTs).toDateString()));
          return (
            <Box key={i}>
              {showDivider && (
                <Divider sx={{ my: 2 }}>
                  <Chip
                    label={new Date(msgTs!).toLocaleDateString(undefined, {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                    size="small"
                    sx={{ fontSize: '0.75rem', color: 'text.secondary', bgcolor: 'action.hover' }}
                  />
                </Divider>
              )}
              <ChatMessage
                role={msg.role} content={msg.content}
                isThinking={msg.isThinking} index={i}
                source={msg.source}
                caseStudyKey={msg.caseStudyKey}
              />
            </Box>
          );
        })}
        {showLeadForm && (
          <Box sx={{ px: 2, mb: 2, maxWidth: 400 }}>
            <LeadCaptureForm />
          </Box>
        )}
        <div ref={messagesEndRef} />
      </Box>
      {/* Disclaimer banner */}
      {showDisclaimer && !digitalTwinMode && (
        <Box sx={{ maxWidth: 768, mx: 'auto', width: '100%', px: { xs: 2, md: 3 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.5,
              p: 2,
              border: 1,
              borderColor: 'divider',
              borderRadius: '12px',
              bgcolor: 'background.paper',
              mb: 1,
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
                By messaging Raybot, an AI chatbot, you agree to our{' '}
                <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.primary', textDecoration: 'underline' }}>Terms</Box>
                {' '}and have read our{' '}
                <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.primary', textDecoration: 'underline' }}>Privacy Policy</Box>.
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
                Don&#39;t share sensitive info. Conversations are logged and automatically deleted after 30 days.
              </Typography>
            </Box>
            <IconButton size="small" onClick={() => setShowDisclaimer(false)} sx={{ color: 'text.secondary', mt: -0.5 }}>
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>
        </Box>
      )}
      {!digitalTwinMode && (
        <ChatInput
          onSend={sendMessage} disabled={isProcessing} isProcessing={isProcessing} onStop={stopResponse}
          voiceMuted={voiceMuted} isSpeaking={isSpeaking}
          onToggleVoice={() => { setVoiceMuted(!voiceMuted); if (audioRef.current && !voiceMuted) audioRef.current.pause(); }}
          digitalTwinMode={digitalTwinMode}
          onListeningChange={onListeningChange}
          onToggleDigitalTwin={onToggleDigitalTwin}
          onMicActivated={onMicActivated}
        />
      )}
    </Box>
  );
}
