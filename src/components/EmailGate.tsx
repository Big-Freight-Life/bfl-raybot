'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
interface EmailGateProps {
  onVerified: (email: string) => void;
}

export default function EmailGate({ onVerified }: EmailGateProps) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return; }

    setError('');
    setChecking(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const text = await res.text();
      let data: { error?: string };
      try { data = JSON.parse(text); } catch { throw new Error('Server error — please try again'); }
      if (!res.ok) throw new Error(data.error || 'Validation failed');

      sessionStorage.setItem('raybot_user_email', email);
      onVerified(email);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setChecking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit(); }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: 1400,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'rgba(0,0,0,0.5)',
        backdropFilter: 'blur(4px)',
      }}
    >
      <Paper
        elevation={8}
        sx={{
          width: '100%',
          maxWidth: 400,
          mx: 2,
          p: 4,
          borderRadius: '16px',
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontFamily: "'DM Sans', sans-serif", fontWeight: 700, letterSpacing: '-0.02em', mb: 0.5 }}>
          <Box component="span" sx={{ color: 'secondary.main' }}>ray</Box>bot
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Enter your email to start chatting with Raybot.
        </Typography>

        <TextField
          fullWidth
          size="small"
          id="email-gate"
          name="email"
          autoComplete="email"
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(''); }}
          onKeyDown={handleKeyDown}
          error={!!error}
          helperText={error}
          sx={{ mb: 2.5 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={checking}
          sx={{
            textTransform: 'none',
            bgcolor: 'primary.main',
            py: 1.25,
            '&:hover': { bgcolor: 'primary.dark' },
          }}
        >
          {checking ? 'Checking...' : 'Start Chatting'}
        </Button>

        <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary', lineHeight: 1.5 }}>
          By continuing, you agree to our{' '}
          <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', textDecoration: 'underline' }}>Terms</Box>
          {' '}and{' '}
          <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', textDecoration: 'underline' }}>Privacy Policy</Box>.
          {' '}Conversations are logged and automatically deleted after 30 days.
        </Typography>
      </Paper>
    </Box>
  );
}
