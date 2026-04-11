'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Box, Typography, IconButton, Button, Tooltip, Snackbar, Alert, Menu, MenuItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import ShareIcon from '@mui/icons-material/Share';
import LogoutIcon from '@mui/icons-material/Logout';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditNoteIcon from '@mui/icons-material/EditNote';
import HubOutlinedIcon from '@mui/icons-material/HubOutlined';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import AvatarStage from '@/components/AvatarStage';
import EmailGate from '@/components/EmailGate';
import { AboutRayPresentation, ProcessPresentation, AWScorePresentation, ToolboxPresentation, MethodologiesPresentation, ResumePresentation } from '@/components/InfoPresentations';
import CaseStudyPresentation from '@/components/CaseStudyPresentation';
import { caseStudies } from '@/lib/case-studies';
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

  const [chatList, setChatList] = useState<ChatSummary[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [loadedMessages, setLoadedMessages] = useState<Message[] | null>(null);
  const [chatKey, setChatKey] = useState(0); // forces ChatPanel remount
  const [sessionId, setSessionId] = useState('');
  const [sessionTimestamp, setSessionTimestamp] = useState<number>(Date.now());
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);

  const messagesRef = useRef<Message[]>([]);

  const handleSignOut = useCallback(() => {
    setUserMenuAnchor(null);
    try {
      sessionStorage.clear();
    } catch {}
    window.location.reload();
  }, []);

  const handleClearHistory = useCallback(() => {
    setUserMenuAnchor(null);
    if (!window.confirm('Clear all chat history? This cannot be undone.')) return;
    try {
      Object.keys(localStorage)
        .filter((k) => k.startsWith('raybot_'))
        .forEach((k) => localStorage.removeItem(k));
    } catch {}
    window.location.reload();
  }, []);

  useEffect(() => {
    const email = sessionStorage.getItem(STORAGE_KEY_USER_EMAIL);
    if (email) {
      setVerified(true);
      setUserEmail(email);
    } else {
      setVerified(false);
    }
    setChatList(getChatList());
    // Always start with a fresh chat on initial load, defaulting to About Ray
    sessionStorage.removeItem(STORAGE_KEY_HISTORY);
    const sid = generateSessionId();
    sessionStorage.setItem(STORAGE_KEY_SESSION_ID, sid);
    setSessionId(sid);
    setActiveChatId(sid);
    setActiveCaseStudy('about-ray');
    setActiveNavItem('about-ray');
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
      return;
    }

    if (action === 'about-ray' || action === 'process' || action === 'aw-score' || action === 'toolbox' || action === 'methodologies' || action === 'resume') {
      if (activeCaseStudy === action) return;
      handleNewChat();
      setActiveCaseStudy(action);
      setActiveNavItem(action);
      return;
    }

    setActiveCaseStudy(null);
    setActiveNavItem(action);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCaseStudy]);

  useEffect(() => {
    const onNavigate = (e: Event) => {
      const detail = (e as CustomEvent<{ action: string }>).detail;
      if (detail?.action) handleNavigate(detail.action);
    };
    window.addEventListener('raybot:navigate', onNavigate);
    return () => window.removeEventListener('raybot:navigate', onNavigate);
  }, [handleNavigate]);


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
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '0.04em' }}>
            <Box component="span" sx={{ color: 'primary.main' }}>ray</Box>Butler
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="text"
              size="small"
              startIcon={<HubOutlinedIcon sx={{ fontSize: 18 }} />}
              onClick={toggleDigitalTwin}
              sx={{
                color: digitalTwinMode ? 'primary.main' : 'text.secondary',
                fontSize: '0.8125rem',
                fontWeight: 500,
                textTransform: 'none',
                px: 1.5,
                '&:hover': { color: 'primary.main', bgcolor: 'action.hover' },
              }}
            >
              Connect Agent
            </Button>
            <Tooltip title="Email transcript">
              <IconButton size="small" onClick={shareTranscript} sx={{ color: 'text.secondary' }}>
                <ShareIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Tooltip>
            <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
            <Tooltip title={userEmail || 'Account'}>
              <IconButton
                size="small"
                onClick={(e) => setUserMenuAnchor(e.currentTarget)}
                sx={{ p: 0.25 }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'background.paper',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8125rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}
                >
                  {userEmail.trim().charAt(0) || '?'}
                </Box>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={() => setUserMenuAnchor(null)}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              slotProps={{ paper: { sx: { minWidth: 220 } } }}
            >
              {userEmail && (
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="caption" sx={{ color: 'text.disabled', display: 'block' }}>
                    Signed in as
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.primary', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {userEmail}
                  </Typography>
                </Box>
              )}
              {userEmail && <Divider />}
              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  // TODO: open template editor
                }}
              >
                <ListItemIcon>
                  <EditNoteIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Edit template</ListItemText>
              </MenuItem>
              <MenuItem
                onClick={() => {
                  setUserMenuAnchor(null);
                  // TODO: open connector picker
                }}
              >
                <ListItemIcon>
                  <HubOutlinedIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Select connectors</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleClearHistory}>
                <ListItemIcon>
                  <DeleteOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Clear chat history</ListItemText>
              </MenuItem>
              <MenuItem onClick={handleSignOut}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText>Sign out</ListItemText>
              </MenuItem>
            </Menu>
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

          {/* Center column — full page content */}
          <Box sx={{
            flex: digitalTwinMode ? 'none' : 1,
            width: digitalTwinMode ? 0 : 'auto',
            display: digitalTwinMode ? 'none' : 'flex',
            flexDirection: 'column',
            minWidth: 0,
            overflow: 'hidden',
          }}>
            <Box sx={{
              flex: 1,
              overflowY: 'auto',
              px: { xs: 2, md: 3 },
              pt: 2,
              pb: '80px',
              maxWidth: 768,
              mx: 'auto',
              width: '100%',
              scrollbarWidth: 'thin',
            }}>
              {activeCaseStudy === 'about-ray' ? (
                <AboutRayPresentation />
              ) : activeCaseStudy === 'process' ? (
                <ProcessPresentation />
              ) : activeCaseStudy === 'aw-score' ? (
                <AWScorePresentation />
              ) : activeCaseStudy === 'toolbox' ? (
                <ToolboxPresentation />
              ) : activeCaseStudy === 'methodologies' ? (
                <MethodologiesPresentation />
              ) : activeCaseStudy === 'resume' ? (
                <ResumePresentation />
              ) : (() => {
                const study = caseStudies.find((s) => s.key === activeCaseStudy);
                return study ? <CaseStudyPresentation study={study} /> : null;
              })()}
            </Box>
          </Box>

          {/* Right panel — chat */}
          <Box sx={{
            width: digitalTwinMode ? 320 : 360,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            borderLeft: 1,
            borderColor: 'divider',
            overflow: 'hidden',
            transition: digitalTwinMode ? 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)' : undefined,
          }}>
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
