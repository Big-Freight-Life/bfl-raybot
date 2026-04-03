'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import AvatarStage from '@/components/AvatarStage';
import EmailGate from '@/components/EmailGate';

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [verified, setVerified] = useState<boolean | null>(null);
  const [userEmail, setUserEmail] = useState('');
  const [digitalTwinMode, setDigitalTwinMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [showMicToast, setShowMicToast] = useState(false);

  useEffect(() => {
    const email = sessionStorage.getItem('raybot_user_email');
    if (email) {
      setVerified(true);
      setUserEmail(email);
    } else {
      setVerified(false);
    }
  }, []);

  const handleVerified = useCallback((email: string) => {
    setVerified(true);
    setUserEmail(email);
  }, []);

  const toggleDigitalTwin = useCallback(() => {
    if (!digitalTwinMode) {
      setSidebarOpen(false);
      setDigitalTwinMode(true);
    } else {
      setSidebarOpen(true);
      setDigitalTwinMode(false);
    }
  }, [digitalTwinMode]);

  const handleMicActivated = useCallback(() => {
    setShowMicToast(true);
  }, []);

  const downloadTranscript = useCallback(() => {
    try {
      const raw = sessionStorage.getItem('raybot_history');
      if (!raw) return;
      const messages = JSON.parse(raw) as { role: string; content: string; source?: string }[];
      const text = messages
        .map((m) => {
          const label = m.role === 'user' ? 'You' : 'Raybot';
          const via = m.source ? ` [${m.source}]` : '';
          return `${label}${via}: ${m.content}`;
        })
        .join('\n\n');
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `raybot-transcript-${new Date().toISOString().slice(0, 10)}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch { /* ignore */ }
  }, []);

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {verified === false && <EmailGate onVerified={handleVerified} />}

      <IconSidebar open={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        {/* Top bar */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', px: 2, height: 49, borderBottom: 1, borderColor: 'divider', flexShrink: 0 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.25rem' }}>
            <Box component="span" sx={{ color: '#117680' }}>ray</Box>bot
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Tooltip title="Download transcript">
              <IconButton size="small" onClick={downloadTranscript} sx={{ color: 'text.secondary' }}>
                <DownloadIcon sx={{ fontSize: 18 }} />
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
          {/* Avatar stage — expands to fill when digital twin mode is active */}
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
            <AvatarStage isSpeaking={isSpeaking} isListening={isListening} />
          </Box>

          {/* Chat panel — full width normally, narrow transcript strip in digital twin mode */}
          <Box
            sx={{
              width: digitalTwinMode ? 320 : '100%',
              flexShrink: 0,
              display: 'flex',
              flexDirection: 'column',
              minWidth: 0,
              borderLeft: digitalTwinMode ? 1 : 0,
              borderColor: 'divider',
              transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-left 0.4s ease',
              overflow: 'hidden',
            }}
          >
            <ChatPanel
              digitalTwinMode={digitalTwinMode}
              onSpeakingChange={setIsSpeaking}
              onListeningChange={setIsListening}
              onToggleDigitalTwin={toggleDigitalTwin}
              onMicActivated={handleMicActivated}
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
        <Alert onClose={() => setShowMicToast(false)} severity="info" variant="filled" sx={{ bgcolor: '#117680' }}>
          Microphone is on. You can also type your messages.
        </Alert>
      </Snackbar>
    </Box>
  );
}
