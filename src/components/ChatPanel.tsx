'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import LeadCaptureForm from './LeadCaptureForm';

export interface Message {
  role: 'user' | 'bot';
  content: string;
  isThinking?: boolean;
  source?: 'voice' | 'text';
}

interface ChatPanelProps {
  sessionId: string;
  onDiagramDetected?: (code: string) => void;
  digitalTwinMode?: boolean;
  onSpeakingChange?: (speaking: boolean) => void;
  onListeningChange?: (listening: boolean) => void;
  onToggleDigitalTwin?: () => void;
  onMicActivated?: () => void;
  onVoiceMutedChange?: (muted: boolean) => void;
  triggerMessage?: string | null;
  onTriggerHandled?: () => void;
  onMessagesChange?: (messages: Message[]) => void;
}

const STORAGE_KEY = 'raybot_history';
const MAX_MESSAGES = 50;

function loadHistory(): Message[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch { return []; }
}

function saveHistory(messages: Message[]) {
  try {
    const saveable = messages.filter((m) => !m.isThinking).slice(-MAX_MESSAGES);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(saveable));
  } catch { /* ignore */ }
}

function extractMermaid(text: string): string | null {
  const match = text.match(/```mermaid\n([\s\S]*?)```/);
  return match ? match[1].trim() : null;
}

function stripMermaidBlock(text: string): string {
  return text.replace(/```mermaid\n[\s\S]*?```/g, '').trim();
}

export default function ChatPanel({ sessionId, onDiagramDetected, digitalTwinMode, onSpeakingChange, onListeningChange, onToggleDigitalTwin, onMicActivated, onVoiceMutedChange, triggerMessage, onTriggerHandled, onMessagesChange }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const loadedRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;
    const history = loadHistory();
    if (history.length) setMessages(history);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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

  const playTTS = useCallback(async (text: string) => {
    if (voiceMuted && !digitalTwinMode) return;
    try {
      onSpeakingChange?.(true);
      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: stripMermaidBlock(text) }),
      });
      if (!res.ok) { onSpeakingChange?.(false); return; }
      const { audio } = await res.json();
      const audioBlob = Uint8Array.from(atob(audio), (c) => c.charCodeAt(0));
      const blob = new Blob([audioBlob], { type: 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      if (audioRef.current) audioRef.current.pause();
      const player = new Audio(url);
      audioRef.current = player;
      player.onended = () => {
        URL.revokeObjectURL(url);
        onSpeakingChange?.(false);
      };
      player.onerror = () => {
        URL.revokeObjectURL(url);
        onSpeakingChange?.(false);
      };
      player.play();
    } catch { onSpeakingChange?.(false); }
  }, [voiceMuted, digitalTwinMode, onSpeakingChange]);

  const stopResponse = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
  }, []);

  const sendMessage = useCallback(async (text: string, source: 'voice' | 'text' = 'text') => {
    const userMsg: Message = { role: 'user', content: text, source };
    const thinkingMsg: Message = { role: 'bot', content: '', isThinking: true };
    setMessages((prev) => [...prev, userMsg, thinkingMsg]);
    setIsProcessing(true);

    const apiMessages = [...messages.filter((m) => !m.isThinking), userMsg].map((m) => ({
      role: m.role === 'user' ? 'user' as const : 'model' as const,
      content: m.content,
    }));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages, sessionId }),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response stream');

      const decoder = new TextDecoder();
      let accumulated = '';

      // Replace thinking msg with streaming bot msg
      setMessages((prev) => {
        const updated = prev.filter((m) => !m.isThinking);
        return [...updated, { role: 'bot' as const, content: '' }];
      });

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        accumulated += decoder.decode(value, { stream: true });
        const current = accumulated;
        setMessages((prev) => {
          const updated = [...prev];
          const last = updated[updated.length - 1];
          if (last?.role === 'bot') {
            updated[updated.length - 1] = { ...last, content: current };
          }
          return updated;
        });
      }

      // Finalize
      const finalText = accumulated;
      setMessages((prev) => {
        const updated = [...prev];
        const last = updated[updated.length - 1];
        if (last?.role === 'bot') {
          updated[updated.length - 1] = { role: 'bot', content: finalText };
        }
        saveHistory(updated);
        return updated;
      });

      const mermaidCode = extractMermaid(finalText);
      if (mermaidCode && onDiagramDetected) onDiagramDetected(mermaidCode);

      if (/send me an email|book a call/i.test(finalText)) setShowLeadForm(true);
      playTTS(finalText);
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        // User stopped — keep whatever was streamed
        setMessages((prev) => {
          const updated = [...prev].filter((m) => !m.isThinking);
          saveHistory(updated);
          return updated;
        });
      } else {
        setMessages((prev) => {
          const updated = prev.filter((m) => !m.isThinking);
          return [...updated, { role: 'bot', content: (error as Error).message || 'Something went wrong.' }];
        });
      }
    } finally {
      setIsProcessing(false);
      abortRef.current = null;
    }
  }, [messages, sessionId, onDiagramDetected, playTTS]);

  // Fire pending trigger now that sendMessage is available
  useEffect(() => {
    if (pendingTrigger && !isProcessing) {
      sendMessage(pendingTrigger, 'text');
      setPendingTrigger(null);
    }
  }, [pendingTrigger, isProcessing, sendMessage]);

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
        {messages.map((msg, i) => (
          <ChatMessage
            key={i} role={msg.role} content={msg.content}
            isThinking={msg.isThinking} index={i}
            source={msg.source}
          />
        ))}
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
          voiceMuted={voiceMuted}
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
