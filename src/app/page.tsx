'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import ShareIcon from '@mui/icons-material/Share';
import PsychologyIcon from '@mui/icons-material/Psychology';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import AvatarStage from '@/components/AvatarStage';
import EmailGate from '@/components/EmailGate';
import CaseStudyPanel from '@/components/CaseStudyPanel';
import { caseStudies, aboutRay } from '@/lib/case-studies';
import { getChatList, saveChat, loadChat, generateTitle, type ChatSummary } from '@/lib/chat-history';
import { STORAGE_KEY_USER_EMAIL, STORAGE_KEY_HISTORY, STORAGE_KEY_SESSION_ID } from '@/lib/constants';
import { generateSessionId } from '@/lib/session-utils';
import type { Message } from '@/types/chat';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [digitalTwinMode, setDigitalTwinMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMicToast, setShowMicToast] = useState(false);
  const [voiceMuted, setVoiceMuted] = useState(true);
  const [micActive, setMicActive] = useState(false);
  const [triggerMessage, setTriggerMessage] = useState<string | null>(null);
  const [triggerCaseStudy, setTriggerCaseStudy] = useState<string | null>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const [activeNavItem, setActiveNavItem] = useState<string | null>(null);
  const [visitedHighlights, setVisitedHighlights] = useState<Set<string>>(new Set());
  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loadedMessages, setLoadedMessages] = useState<Message[] | null>(null);
  const [chatKey, setChatKey] = useState(0); // forces ChatPanel remount
  const [sessionId, setSessionId] = useState('');
  const [sessionTimestamp, setSessionTimestamp] = useState<number>(Date.now());
  const messagesRef = useRef<Message[]>([]);

  useEffect(() => {
    const email = sessionStorage.getItem(STORAGE_KEY_USER_EMAIL);
    if (email) {
      setVerified(true);
      setUserEmail(email);
    } else {
      setVerified(false);
    }
    setChatList(getChatList());
    // Always start with a fresh chat on initial load
    sessionStorage.removeItem(STORAGE_KEY_HISTORY);
    const sid = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY_SESSION_ID, sid);
    setSessionId(sid);
    setActiveChatId(sid);
  }, []);

  const handleVerified = useCallback((email: string) => {
    setVerified(true);
    setUserEmail(email);
  }, []);

  const toggleDigitalTwin = useCallback(() => {
    if (!digitalTwinMode) {
      setSidebarOpen(false);
      setActiveCaseStudy(null);
      setDigitalTwinMode(true);
    } else {
      setSidebarOpen(true);
      setDigitalTwinMode(false);
      setMicActive(false);
    }
  }, [digitalTwinMode]);

  const handleMicActivated = useCallback(() => {
    setShowMicToast(true);
    setMicActive(true);
  }, []);

  const toggleMicFromToolbar = useCallback(() => {
    setMicActive((prev) => !prev);
  }, []);

  const handleNavigate = useCallback((action: string) => {
    if (action.startsWith('case-study:')) {
      const key = action.replace('case-study:', '');
      if (key === activeCaseStudy) return;
      const study = caseStudies.find((s) => s.key === key);
      if (!study) return;
      // Start a new chat for the case study
      handleNewChat();
      setActiveCaseStudy(key);
      setActiveNavItem(action);
      setVisitedHighlights(new Set());
      setTriggerCaseStudy(key);
      return;
    }

    if (action === 'about-ray' || action === 'process' || action === 'contact') {
      if (activeCaseStudy === action) return;
      // Start a new chat and trigger the case study, same as case studies
      handleNewChat();
      setActiveCaseStudy(action);
      setActiveNavItem(action);
      setVisitedHighlights(new Set());
      setTriggerCaseStudy(action);
      return;
    }

    setActiveCaseStudy(null);
    setActiveNavItem(action);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCaseStudy]);

  const handleHighlightClick = useCallback((prompt: string) => {
    setTriggerMessage(prompt);
  }, []);

  const handleHighlightVisit = useCallback((key: string) => {
    setVisitedHighlights((prev) => new Set(prev).add(key));
  }, []);

  const saveCurrentChat = useCallback(() => {
    const currentMessages = messagesRef.current;
    if (!currentMessages.length || !sessionId) return;
    // Only save chats that have at least one user message
    const hasUserMessage = currentMessages.some((m) => m.role === 'user');
    if (!hasUserMessage) return;
    saveChat({
      id: sessionId,
      title: generateTitle(currentMessages),
      timestamp: Date.now(),
      messages: currentMessages,
    });
    setChatList(getChatList());
  }, [sessionId]);

  const handleNewChat = useCallback(() => {
    saveCurrentChat();
    sessionStorage.removeItem(STORAGE_KEY_HISTORY);
    const newId = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY_SESSION_ID, newId);
    setSessionId(newId);
    setActiveChatId(newId);
    setSessionTimestamp(Date.now());
    messagesRef.current = [];
    setActiveCaseStudy(null);
    setActiveNavItem(null);
    setLoadedMessages(null);
    setChatKey((k) => k + 1);
    setChatList(getChatList());
  }, [saveCurrentChat]);

  const handleLoadChat = useCallback((chatId: string) => {
    if (chatId === activeChatId) return;
    saveCurrentChat();
    const chat = loadChat(chatId);
    if (!chat) return;
    setActiveChatId(chatId);
    setSessionId(chatId);
    setSessionTimestamp(chat.timestamp);
    setActiveCaseStudy(null);
    setActiveNavItem(null);
    // Load the chat into sessionStorage and remount ChatPanel
    sessionStorage.setItem(STORAGE_KEY_HISTORY, JSON.stringify(chat.messages));
    sessionStorage.setItem(STORAGE_KEY_SESSION_ID, chatId);
    messagesRef.current = chat.messages;
    setLoadedMessages(chat.messages);
    setChatKey((k) => k + 1);
  }, [activeChatId, saveCurrentChat]);

  // Update messages ref and auto-save when messages change
  const handleMessagesChange = useCallback((msgs: Message[]) => {
    messagesRef.current = msgs;
    saveCurrentChat();
  }, [saveCurrentChat]);

  const shareTranscript = useCallback(() => {
    try {
      const currentMessages = messagesRef.current;
      if (!currentMessages.length) return;
      const text = currentMessages
        .map((m) => {
          const label = m.role === 'user' ? 'You' : 'Raybot';
          const via = m.source ? ` [${m.source}]` : '';
          return `${label}${via}: ${m.content}`;
        })
        .join('\n\n');
      const subject = `Raybot Transcript — ${new Date().toLocaleDateString()}`;
      const email = sessionStorage.getItem(STORAGE_KEY_USER_EMAIL) || '';
      window.open(`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(text)}`);
    } catch { /* ignore */ }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {verified === false && <EmailGate onVerified={handleVerified} />}

      <IconSidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNavigate={handleNavigate}
        onNewChat={handleNewChat}
        onLoadChat={handleLoadChat}
        activeItem={activeNavItem}
        activeChatId={activeChatId}
        chatList={chatList}
        isNewChatActive={!activeNavItem && !chatList.some((c) => c.id === activeChatId)}
      />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: 49, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
            <Box component="span" sx={{ color: 'primary.main' }}>ray</Box>bot
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title={digitalTwinMode ? 'Switch to chat' : 'Digital Twin'}>
              <IconButton
                size="small"
                onClick={toggleDigitalTwin}
                sx={{
                  color: digitalTwinMode ? 'primary.main' : 'text.secondary',
                  bgcolor: digitalTwinMode ? 'action.selected' : 'transparent',
                }}
              >
                <PsychologyIcon sx={{ fontSize: 22 }} />
              </IconButton>
            </Tooltip>
            <Tooltip title="Email transcript">
              <IconButton size="small" onClick={shareTranscript} sx={{ color: 'text.secondary' }}>
                <ShareIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Button
              component="a"
              href="https://bfl.design"
              target="_blank"
              rel="noopener noreferrer"
              size="small"
              endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ textTransform: 'none', color: 'text.secondary', fontSize: '0.8125rem' }}
            >
              bfl.design
            </Button>
          </Box>
        </Box>

        {/* Main content area */}
        <Box sx={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Avatar stage */}
          <Box
            sx={{
              flex: digitalTwinMode ? 1 : 0,
              width: digitalTwinMode ? 'auto' : 0,
              opacity: digitalTwinMode ? 1 : 0,
              transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
              overflow: 'hidden',
              display: 'flex',
            }}
          >
            <AvatarStage
              isSpeaking={isSpeaking}
              isListening={isListening}
              voiceMuted={voiceMuted}
              onToggleVoice={() => setVoiceMuted(!voiceMuted)}
              onToggleMic={toggleMicFromToolbar}
              onToggleDigitalTwin={toggleDigitalTwin}
              micActive={micActive}
            />
          </Box>

          {/* Chat panel */}
          <Box
            sx={{
              flex: digitalTwinMode ? 'none' : 1,
              width: digitalTwinMode ? 320 : 'auto',
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              borderLeft: digitalTwinMode ? 1 : 0,
              borderColor: 'divider',
              transition: 'flex 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-left 0.4s ease',
              overflow: 'hidden',
            }}
          >
            <ChatPanel
              key={chatKey}
              sessionId={sessionId}
              sessionTimestamp={sessionTimestamp}
              digitalTwinMode={digitalTwinMode}
              onSpeakingChange={setIsSpeaking}
              onListeningChange={setIsListening}
              onToggleDigitalTwin={toggleDigitalTwin}
              onMicActivated={handleMicActivated}
              triggerMessage={triggerMessage}
              triggerCaseStudy={triggerCaseStudy}
              onTriggerHandled={() => { setTriggerMessage(null); setTriggerCaseStudy(null); }}
              onMessagesChange={handleMessagesChange}
            />
          </Box>

          {(() => {
            const activeStudy = activeCaseStudy === 'about-ray'
              ? aboutRay
              : activeCaseStudy
                ? caseStudies.find((s) => s.key === activeCaseStudy)
                : null;
            return activeStudy ? (
              <CaseStudyPanel
                study={activeStudy}
                variant={activeCaseStudy === 'about-ray' ? 'tabs' : 'default'}
                onHighlightClick={(prompt) => {
                  handleHighlightClick(prompt);
                  const highlight = activeStudy.highlights.find((h) =>
                    prompt.includes(h.title.toLowerCase())
                  );
                  if (highlight) handleHighlightVisit(highlight.key);
                }}
                onClose={() => setActiveCaseStudy(null)}
                visitedHighlights={visitedHighlights}
              />
            ) : null;
          })()}

        </Box>
      </Box>

      {/* Mic toast */}
      <Snackbar
        open={showMicToast}
        autoHideDuration={5000}
        onClose={() => setShowMicToast(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setShowMicToast(false)} severity="info" variant="filled" sx={{ bgcolor: 'primary.main' }}>
          Microphone is on. You can also type your messages.
        </Alert>
      </Snackbar>
    </Box>
  );
}
