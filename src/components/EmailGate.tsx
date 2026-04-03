'use client';

import { useState } from 'react';
import { Box, Typography, TextField, Button, Paper } from '@mui/material';
import { colors } from '@/theme/tokens';

interface EmailGateProps {
  onVerified: (email: string, name: string) => void;
}

export default function EmailGate({ onVerified }: EmailGateProps) {
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const handleSendCode = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError('Enter a valid email address'); return; }

    setError('');
    setSending(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to send code');
      }
      setStep('verify');
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!code.trim()) { setError('Enter the verification code'); return; }

    setError('');
    setSending(true);

    try {
      const res = await fetch('/api/verify-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: code.trim() }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Invalid code');
      }
      // Store verified email in session
      sessionStorage.setItem('raybot_user_email', email);
      sessionStorage.setItem('raybot_user_name', name);
      onVerified(email, name);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (step === 'form') handleSendCode();
      else handleVerify();
    }
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
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 0.5 }}>
          <Box component="span" sx={{ color: colors.primary.main }}>ray</Box>bot
        </Typography>

        {step === 'form' ? (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Enter your email to start chatting with Ray.
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
              sx={{ mb: 1.5 }}
            />
            <TextField
              fullWidth
              size="small"
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
              onClick={handleSendCode}
              disabled={sending}
              sx={{
                textTransform: 'none',
                bgcolor: colors.primary.main,
                py: 1.25,
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {sending ? 'Sending code...' : 'Continue'}
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              We sent a 6-digit code to
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 3 }}>
              {email}
            </Typography>
            <TextField
              fullWidth
              size="small"
              label="Verification code"
              value={code}
              onChange={(e) => { setCode(e.target.value.replace(/\D/g, '').slice(0, 6)); setError(''); }}
              onKeyDown={handleKeyDown}
              error={!!error}
              helperText={error}
              inputProps={{ maxLength: 6, style: { letterSpacing: '0.3em', textAlign: 'center', fontSize: '1.25rem' } }}
              sx={{ mb: 2.5 }}
            />
            <Button
              fullWidth
              variant="contained"
              onClick={handleVerify}
              disabled={sending || code.length < 6}
              sx={{
                textTransform: 'none',
                bgcolor: colors.primary.main,
                py: 1.25,
                mb: 1.5,
                '&:hover': { bgcolor: colors.primary.dark },
              }}
            >
              {sending ? 'Verifying...' : 'Verify'}
            </Button>
            <Button
              size="small"
              onClick={() => { setStep('form'); setCode(''); setError(''); }}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Use a different email
            </Button>
          </>
        )}

        <Typography variant="caption" sx={{ display: 'block', mt: 3, color: 'text.secondary' }}>
          By continuing, you agree to our{' '}
          <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', textDecoration: 'underline' }}>Terms</Box>
          {' '}and{' '}
          <Box component="a" href="https://bfl.design/legal" target="_blank" rel="noopener noreferrer" sx={{ color: 'text.secondary', textDecoration: 'underline' }}>Privacy Policy</Box>.
        </Typography>
      </Paper>
    </Box>
  );
}
