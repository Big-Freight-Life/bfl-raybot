'use client';

import { useState, useCallback, useEffect } from 'react';
import { Box, Typography, Button, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import DownloadIcon from '@mui/icons-material/Download';
import PersonIcon from '@mui/icons-material/Person';
import ChatIcon from '@mui/icons-material/Chat';
import IconSidebar from '@/components/IconSidebar';
import ChatPanel from '@/components/ChatPanel';
import DigitalTwinAvatar from '@/components/DigitalTwinAvatar';
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
      // Entering digital twin mode
      setSidebarOpen(false);
      setDigitalTwinMode(true);
      setShowMicToast(true);
    } else {
      // Exiting digital twin mode
      setSidebarOpen(true);
      setDigitalTwinMode(false);
    }
  }, [digitalTwinMode]);

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
            {/* Digital Twin toggle */}
            <Tooltip title={digitalTwinMode ? 'Switch to chat' : 'Digital Twin'}>
              <IconButton
                size="small"
                onClick={toggleDigitalTwin}
                sx={{
                  color: digitalTwinMode ? '#117680' : 'text.secondary',
                  bgcolor: digitalTwinMode ? 'rgba(17,118,128,0.08)' : 'transparent',
                  '&:hover': { bgcolor: digitalTwinMode ? 'rgba(17,118,128,0.12)' : 'action.hover' },
                }}
              >
                {digitalTwinMode ? <ChatIcon sx={{ fontSize: 20 }} /> : <PersonIcon sx={{ fontSize: 20 }} />}
              </IconButton>
            </Tooltip>
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

        {/* Avatar (digital twin mode) */}
        {digitalTwinMode && (
          <DigitalTwinAvatar isSpeaking={isSpeaking} isListening={isListening} />
        )}

        {/* Chat */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
          <ChatPanel
            digitalTwinMode={digitalTwinMode}
            onSpeakingChange={setIsSpeaking}
            onListeningChange={setIsListening}
          />
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
