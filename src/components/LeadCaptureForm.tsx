'use client';

import { useState } from 'react';
import { Box, TextField, Button, Typography, Alert } from '@mui/material';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { colors } from '@/theme/tokens';

export default function LeadCaptureForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const calendarUrl = process.env.NEXT_PUBLIC_CALENDAR_URL || '#';

  const handleSubmit = async () => {
    if (!email.trim()) { setError('Email is required'); return; }
    // M10: Validate email format before making the API call
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }
    setError('');
    setSending(true);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) throw new Error('Failed');
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  };

  if (sent) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" sx={{ mb: 1 }}>Message sent!</Typography>
        <Typography variant="body2" color="text.secondary">Ray will get back to you soon.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, border: 1, borderColor: 'divider', borderRadius: 2, bgcolor: 'background.paper' }}>
      <Typography variant="subtitle2" sx={{ mb: 2 }}>Let&#39;s connect you with Ray</Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <TextField fullWidth size="small" label="Name" value={name} onChange={(e) => setName(e.target.value)} sx={{ mb: 1.5 }} />
      <TextField fullWidth size="small" label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} sx={{ mb: 1.5 }} />
      <TextField fullWidth size="small" label="Message (optional)" multiline rows={2} value={message} onChange={(e) => setMessage(e.target.value)} sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', gap: 1.5 }}>
        <Button variant="contained" startIcon={<EmailIcon />} onClick={handleSubmit} disabled={sending}
          sx={{ flex: 1, textTransform: 'none', bgcolor: colors.primary.main, '&:hover': { bgcolor: colors.primary.dark } }}>
          {sending ? 'Sending...' : 'Send Email'}
        </Button>
        <Button variant="outlined" startIcon={<CalendarMonthIcon />} component="a" href={calendarUrl} target="_blank" rel="noopener noreferrer"
          sx={{ flex: 1, textTransform: 'none', borderColor: colors.primary.main, color: colors.primary.main }}>
          Book a Call
        </Button>
      </Box>
    </Box>
  );
}
