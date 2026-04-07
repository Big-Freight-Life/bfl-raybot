'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import IosShareIcon from '@mui/icons-material/IosShare';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { AW_DIMENSIONS, RAY_PROFILE, AW_STORAGE_KEY, computeResult, encodeScores, decodeScores } from '@/lib/aw-score';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';

/* ─── About Ray ─── */

export function AboutRayPresentation() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Profile header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
        <Box sx={{ width: 88, height: 88, flexShrink: 0 }} aria-label="HTML5 badge">
          <svg viewBox="0 0 64 72" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            {/* Shield outer */}
            <path d="M2 0 L62 0 L56.6 60.6 L32 72 L7.4 60.6 Z" fill="#e34f26" />
            <path d="M32 4 L32 67.6 L52.2 58.2 L56.8 4 Z" fill="#ef652a" />
            {/* Letter "5" */}
            <text
              x="32"
              y="44"
              textAnchor="middle"
              fontFamily="-apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif"
              fontSize="32"
              fontWeight="700"
              fill="#ffffff"
            >
              5
            </text>
            {/* Bottom checker band */}
            <rect x="8" y="50" width="48" height="6" fill="#ebebeb" />
            <rect x="32" y="50" width="24" height="6" fill="#ffffff" />
            <rect x="8" y="56" width="48" height="4" fill="#1f6feb" />
            <rect x="32" y="56" width="24" height="4" fill="#3b82f6" />
          </svg>
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary' }}>
            Ray Butler
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', color: 'primary.main', fontWeight: 500, mt: 0.25 }}>
            Designer · Builder · Founder
          </Typography>
          <Typography sx={{ fontSize: '0.8125rem', color: 'text.secondary', mt: 0.25 }}>
            Big Freight Life
          </Typography>
        </Box>
      </Box>

      {/* Bio */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
          Ray works at the intersection of experience design, engineering, and system architecture — focusing on how systems behave, not just how they appear.
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
          His work centers on Applied AI Architecture: structuring systems so AI operates clearly, predictably, and within real-world conditions.
        </Typography>
        <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
          He brings clarity to systems that were never designed to support the complexity they carry.
        </Typography>
      </Box>

      {/* Focus areas */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1, fontSize: '0.6875rem' }}
        >
          Focus Areas
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.75 }}>
          {[
            'Applied AI Architecture',
            'Experience Design',
            'Service Design',
            'Enterprise SaaS',
            'Healthcare Workflows',
            'Finance & AP Automation',
            'Government Systems',
            'Workflow Modeling',
          ].map((tag) => (
            <Box
              key={tag}
              sx={{
                px: 1.25,
                py: 0.5,
                borderRadius: '999px',
                bgcolor: 'action.hover',
                fontSize: '0.75rem',
                color: 'text.secondary',
                border: 1,
                borderColor: 'divider',
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>
      </Box>

      {/* CTAs */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        <Button
          component="a"
          href="https://www.linkedin.com/in/braybutler/"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          startIcon={<LinkedInIcon />}
          endIcon={<OpenInNewIcon sx={{ fontSize: '14px !important' }} />}
          sx={{
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(17,118,128,0.04)' },
          }}
        >
          Connect on LinkedIn
        </Button>
        <Button
          component="a"
          href="mailto:hello@bflux.co"
          variant="outlined"
          startIcon={<EmailOutlinedIcon />}
          sx={{
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(17,118,128,0.04)' },
          }}
        >
          Email Ray
        </Button>
      </Box>

      {/* Project history */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1.5, fontSize: '0.6875rem' }}
        >
          Project History
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
          {[
            {
              company: 'Big Freight Life',
              project: 'Big Freight Life',
              role: 'Founder · Applied AI Architect',
              date: 'Present',
              description:
                'Currently building Big Freight Life — applied AI architecture for enterprise systems.',
              outcomes: [],
              initial: 'B',
              color: '#0d4f56',
            },
            {
              company: 'Hyland Software',
              project: 'Hyland OnBase Integration',
              role: 'Lead Design Technologist',
              date: '2024',
              description:
                'Federated integration layer that made OnBase the source of truth for millions of documents across ERP, HR, and finance systems — replacing fragile point-to-point integrations with a canonical schema and AI-assisted metadata extraction.',
              outcomes: [
                'Document processing latency: hours → minutes',
                'Integration maintenance cost down ~60%',
                'Audit queries: days → seconds',
              ],
              initial: 'H',
              color: '#0e5f67',
            },
            {
              company: 'Hyland Software',
              project: 'Hyland for Workday',
              role: 'Design Technologist',
              date: '2023',
              description:
                'Bidirectional sync layer bringing Hyland documents into Workday workflows for HR, finance, and approval routing — surfacing supporting documents directly inside the Workday UI to eliminate context switching.',
              outcomes: [
                'HR case resolution time cut nearly in half',
                'Finance approval cycles: days → hours',
                'Eliminated context switching for Workday users',
              ],
              initial: 'H',
              color: '#117680',
            },
            {
              company: 'Enterprise Client',
              project: 'Salesforce Migration',
              role: 'Solutions Architect',
              date: '2022',
              description:
                'Three-phase migration pipeline moving years of legacy CRM customization, undocumented workflows, and inconsistent data into Salesforce with zero downtime and 99.9% data integrity.',
              outcomes: [
                'Zero-downtime cutover',
                '99.9% data integrity across validated fields',
                'Legacy maintenance burden eliminated',
              ],
              initial: 'S',
              color: '#1a9aa6',
            },
          ].map((item, i, arr) => {
            const isLast = i === arr.length - 1;
            return (
              <Box key={i} sx={{ display: 'flex', gap: 1.75 }}>
                {/* Company logo placeholder */}
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: '8px',
                    bgcolor: item.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.125rem',
                    fontWeight: 700,
                    flexShrink: 0,
                  }}
                >
                  {item.initial}
                </Box>
                {/* Details */}
                <Box sx={{ flex: 1, minWidth: 0, borderBottom: isLast ? 0 : 1, borderColor: 'divider', pb: isLast ? 0 : 2, mb: isLast ? 0 : 2 }}>
                  <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                    {item.project}
                  </Typography>
                  <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', mt: 0.25 }}>
                    {item.role} · {item.company}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                    {item.date}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65, mt: 1 }}>
                    {item.description}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.4, mt: 1 }}>
                    {item.outcomes.map((outcome) => (
                      <Box key={outcome} sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.75 }}>
                        <Box
                          sx={{
                            width: 4,
                            height: 4,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            mt: '8px',
                            flexShrink: 0,
                          }}
                        />
                        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.5, fontSize: '0.8125rem' }}>
                          {outcome}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Box>
    </Box>
  );
}

/* ─── Resume (Experience tab on About Ray panel) ─── */

const resumeEntries = [
  {
    company: 'Big Freight Life',
    role: 'Founder · Applied AI Architect',
    date: '2024 — Present',
    location: 'Dallas, TX',
    bullets: [
      'Founded an applied AI architecture practice focused on enterprise systems where AI must operate clearly, predictably, and within real-world constraints.',
      'Engagements span workflow modeling, decision boundaries, data contracts, and integration architecture for Fortune 500 customers.',
    ],
  },
  {
    company: 'Hyland Software',
    role: 'Lead Design Technologist — OnBase Integration',
    date: '2023 — 2024',
    location: 'Remote',
    bullets: [
      'Led the federated integration layer that made Hyland OnBase the source of truth for millions of documents across ERP, HR, and finance systems.',
      'Replaced fragile point-to-point integrations with a canonical schema and AI-assisted metadata extraction.',
      'Reduced document processing latency from hours to minutes; cut integration maintenance cost ~60%; audit queries went from days to seconds.',
    ],
  },
  {
    company: 'Hyland Software',
    role: 'Design Technologist — Hyland for Workday',
    date: '2022 — 2023',
    location: 'Remote',
    bullets: [
      'Built the bidirectional sync layer bringing Hyland documents into Workday workflows for HR, finance, and approval routing.',
      'Surfaced supporting documents directly inside the Workday UI to eliminate context switching.',
      'Cut HR case resolution time nearly in half; finance approval cycles moved from days to hours.',
    ],
  },
  {
    company: 'Enterprise Client',
    role: 'Solutions Architect — Salesforce Migration',
    date: '2021 — 2022',
    location: 'Remote',
    bullets: [
      'Designed and shipped a three-phase migration pipeline moving years of legacy CRM customization, undocumented workflows, and inconsistent data into Salesforce.',
      'Delivered a zero-downtime cutover with 99.9% data integrity across validated fields.',
      'Eliminated the legacy maintenance burden that had blocked the customer for years.',
    ],
  },
];

const resumeSkills = [
  { label: 'Frontend', items: 'React, Next.js, TypeScript, MUI, Tailwind' },
  { label: 'AI / ML', items: 'Gemini, Claude, OpenAI, LangChain, prompt engineering, RAG' },
  { label: 'Cloud', items: 'Vercel, AWS, Google Cloud' },
  { label: 'Data', items: 'PostgreSQL, Redis, Vercel KV, Upstash' },
  { label: 'Design', items: 'Figma, system design, workflow modeling' },
  { label: 'Integration', items: 'Salesforce, Hyland OnBase, Workday, Mermaid.js' },
];

export function ResumePresentation() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Sticky Download button */}
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 2,
          bgcolor: 'background.paper',
          py: 1,
          mt: -1,
          mx: -2.5,
          px: 2.5,
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <Button
          component="a"
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          variant="outlined"
          size="small"
          fullWidth
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{
            textTransform: 'none',
            borderColor: 'primary.main',
            color: 'primary.main',
            fontSize: '0.75rem',
            '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(17,118,128,0.04)' },
          }}
        >
          Download PDF
        </Button>
      </Box>

      {/* Experience */}
      <Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {resumeEntries.map((entry, i) => (
            <Box
              key={i}
              sx={{
                pb: i === resumeEntries.length - 1 ? 0 : 2,
                borderBottom: i === resumeEntries.length - 1 ? 0 : 1,
                borderColor: 'divider',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 1 }}>
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: 'text.primary', lineHeight: 1.3 }}>
                  {entry.role}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary', flexShrink: 0 }}>
                  {entry.date}
                </Typography>
              </Box>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', mt: 0.25 }}>
                {entry.company} · {entry.location}
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mt: 1 }}>
                {entry.bullets.map((b) => (
                  <Box key={b} sx={{ display: 'flex', gap: 0.75, alignItems: 'flex-start' }}>
                    <Box
                      sx={{
                        width: 4,
                        height: 4,
                        borderRadius: '50%',
                        bgcolor: 'primary.main',
                        mt: '7px',
                        flexShrink: 0,
                      }}
                    />
                    <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.55, fontSize: '0.75rem' }}>
                      {b}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Skills */}
      <Box>
        <Typography
          variant="caption"
          sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1, fontSize: '0.6875rem' }}
        >
          Skills
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75 }}>
          {resumeSkills.map((s) => (
            <Box key={s.label} sx={{ display: 'flex', gap: 1 }}>
              <Typography sx={{ fontSize: '0.75rem', fontWeight: 600, color: 'text.primary', minWidth: 88, flexShrink: 0 }}>
                {s.label}
              </Typography>
              <Typography sx={{ fontSize: '0.75rem', color: 'text.secondary', lineHeight: 1.5 }}>
                {s.items}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>

    </Box>
  );
}

/* ─── Process ─── */

const processSteps = [
  {
    icon: SearchOutlinedIcon,
    label: 'Step 01',
    title: 'Diagnose',
    description:
      'Map what is actually happening — where decisions are made, how data flows, where ownership is unclear. Most failed implementations are misalignment problems, not technology problems.',
  },
  {
    icon: DesignServicesOutlinedIcon,
    label: 'Step 02',
    title: 'Design',
    description:
      'Model how the system should think before drawing how it should look. Workflow modeling, decision boundaries, data contracts, and integration points — a shared model engineering, product, and operations can all reason about.',
  },
  {
    icon: BuildOutlinedIcon,
    label: 'Step 03',
    title: 'Build',
    description:
      'Ship in tight, demonstrable increments alongside in-house teams. Reference implementations, AI-assisted development, and documentation that lives with the code.',
  },
  {
    icon: HandshakeOutlinedIcon,
    label: 'Step 04',
    title: 'Hand Off',
    description:
      'End with the client team in control. Architecture decision records, runbooks, training on the structural model, and a clear escalation path. The goal is autonomy, not dependency.',
  },
];

export function ProcessPresentation() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Box>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary', mb: 1 }}>
          The Process
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          How Big Freight Life works with clients — from diagnosis to hand off.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
        {processSteps.map((step, i) => {
          const Icon = step.icon;
          const isLast = i === processSteps.length - 1;
          return (
            <Box key={step.title} sx={{ position: 'relative', display: 'flex', gap: 2 }}>
              {/* Icon column with connecting line */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                <Box
                  sx={{
                    width: 40,
                    height: 40,
                    borderRadius: '10px',
                    bgcolor: 'primary.main',
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon sx={{ fontSize: 22 }} />
                </Box>
                {!isLast && (
                  <Box
                    sx={{
                      width: 2,
                      flex: 1,
                      bgcolor: 'divider',
                      mt: 0.5,
                      mb: 0.5,
                      minHeight: 16,
                    }}
                  />
                )}
              </Box>
              {/* Content */}
              <Box sx={{ flex: 1, pb: isLast ? 0 : 1.5, minWidth: 0 }}>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'primary.main',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    fontSize: '0.6875rem',
                    display: 'block',
                  }}
                >
                  {step.label}
                </Typography>
                <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary', mt: 0.25, mb: 0.5 }}>
                  {step.title}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.65 }}>
                  {step.description}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

/* ─── AW Score (Augmented Worker) ─── */

export function AWScorePresentation() {
  const [scores, setScores] = useState<Record<string, number>>(() =>
    Object.fromEntries(AW_DIMENSIONS.map((d) => [d.key, 0]))
  );
  const [submitted, setSubmitted] = useState(false);
  const [toast, setToast] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });
  const [emailing, setEmailing] = useState(false);

  // Hydrate from URL or localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    const fromUrl = url.searchParams.get('aw');
    if (fromUrl) {
      const decoded = decodeScores(fromUrl);
      if (decoded) {
        setScores(decoded);
        setSubmitted(true);
        return;
      }
    }
    try {
      const saved = localStorage.getItem(AW_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { scores: Record<string, number>; submitted: boolean };
        if (parsed?.scores) {
          setScores(parsed.scores);
          setSubmitted(Boolean(parsed.submitted));
        }
      }
    } catch {}
  }, []);

  const result = useMemo(() => computeResult(scores), [scores]);
  const allAnswered = AW_DIMENSIONS.every((d) => scores[d.key] > 0);

  const handleSubmit = () => {
    setSubmitted(true);
    try {
      localStorage.setItem(AW_STORAGE_KEY, JSON.stringify({ scores, submitted: true, ts: Date.now() }));
    } catch {}
    // Update URL with encoded score so it’s shareable
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('aw', encodeScores(scores));
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  const handleReset = () => {
    setSubmitted(false);
    setScores(Object.fromEntries(AW_DIMENSIONS.map((d) => [d.key, 0])));
    try {
      localStorage.removeItem(AW_STORAGE_KEY);
      const url = new URL(window.location.href);
      url.searchParams.delete('aw');
      window.history.replaceState({}, '', url.toString());
    } catch {}
  };

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('aw', encodeScores(scores));
      await navigator.clipboard.writeText(url.toString());
      setToast({ open: true, message: 'Shareable link copied to clipboard', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Could not copy link', severity: 'error' });
    }
  };

  const handleEmail = async () => {
    setEmailing(true);
    try {
      const userEmail =
        typeof window !== 'undefined' ? sessionStorage.getItem('raybot_user_email') ?? '' : '';
      const message = [
        `AW Score: ${result.average.toFixed(1)} — Level ${result.level.level} (${result.level.label})`,
        '',
        ...AW_DIMENSIONS.map((d) => `${d.label}: ${scores[d.key]} (Ray ${RAY_PROFILE[d.key]})`),
        '',
        `Weakest dimension: ${result.weakest.label}`,
        `Next step: ${result.level.next}`,
      ].join('\n');
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'AW Score Result',
          email: userEmail || 'anonymous@bfl.design',
          message,
          source: 'aw-score',
        }),
      });
      if (!res.ok) throw new Error('Failed');
      setToast({ open: true, message: 'Score sent — Ray will see it', severity: 'success' });
    } catch {
      setToast({ open: true, message: 'Could not send. Try again later.', severity: 'error' });
    } finally {
      setEmailing(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* Header */}
      <Box>
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary', mb: 0.5 }}>
          The AW Score
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          A self-assessment of how augmented you actually are — not how much you know about AI, but how
          deeply it has rewired your work. Six dimensions, six levels. Ray scores {result.average === 0 ? '—' : ''}
          <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>
            {' '}
            Level 5 — Augmented
          </Box>
          .
        </Typography>
      </Box>

      {/* Result card (after submission) */}
      {submitted && (
        <Box
          sx={{
            p: 2.5,
            borderRadius: '12px',
            border: 1,
            borderColor: 'primary.main',
            bgcolor: 'rgba(17,118,128,0.06)',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1 }}>
            <Box>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                Your Score
              </Typography>
              <Typography sx={{ fontSize: '1.75rem', fontWeight: 700, color: 'primary.main', lineHeight: 1.1 }}>
                {result.average.toFixed(1)}
                <Box component="span" sx={{ fontSize: '0.875rem', color: 'text.secondary', fontWeight: 500 }}>
                  {' '}/ 5.0
                </Box>
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem' }}>
                Level {result.level.level}
              </Typography>
              <Typography sx={{ fontSize: '1.125rem', fontWeight: 600, color: 'text.primary' }}>
                {result.level.label}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.65, mt: 0.5 }}>
            {result.level.description}
          </Typography>
          <Box sx={{ mt: 1, p: 1.5, bgcolor: 'background.paper', borderRadius: '8px', border: 1, borderColor: 'divider' }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}>
              Next step — focus on {result.weakest.label}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6, fontSize: '0.8125rem' }}>
              {result.level.next}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Dimension scoring */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {AW_DIMENSIONS.map((d) => {
          const value = scores[d.key];
          const rayValue = RAY_PROFILE[d.key];
          return (
            <Box key={d.key}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 1, mb: 0.25 }}>
                <Typography sx={{ fontSize: '0.9375rem', fontWeight: 600, color: 'text.primary' }}>
                  {d.label}
                </Typography>
                <Typography sx={{ fontSize: '0.6875rem', color: 'text.secondary' }}>
                  Ray scores {rayValue}
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.8125rem', lineHeight: 1.5, mb: 1 }}>
                {d.question}
              </Typography>
              {/* 0..5 buttons */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {[0, 1, 2, 3, 4, 5].map((n) => {
                  const selected = value === n;
                  const isRay = rayValue === n;
                  return (
                    <Box
                      key={n}
                      component="button"
                      onClick={() => setScores((prev) => ({ ...prev, [d.key]: n }))}
                      sx={{
                        flex: 1,
                        py: 1,
                        borderRadius: '8px',
                        border: 1,
                        borderColor: selected ? 'primary.main' : 'divider',
                        bgcolor: selected ? 'primary.main' : 'transparent',
                        color: selected ? '#fff' : 'text.secondary',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        position: 'relative',
                        fontFamily: 'inherit',
                        transition: 'all 0.15s ease',
                        '&:hover': {
                          borderColor: 'primary.main',
                          color: selected ? '#fff' : 'primary.main',
                        },
                      }}
                    >
                      {n}
                      {isRay && (
                        <Box
                          sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            border: 2,
                            borderColor: 'background.paper',
                          }}
                        />
                      )}
                    </Box>
                  );
                })}
              </Box>
              {value > 0 && (
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '0.75rem', lineHeight: 1.5, mt: 0.75, fontStyle: 'italic' }}>
                  {d.levelLabels[value - 1]}
                </Typography>
              )}
            </Box>
          );
        })}
      </Box>

      {/* Actions */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
        {!submitted ? (
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
            variant="contained"
            startIcon={<CheckCircleIcon />}
            sx={{
              textTransform: 'none',
              bgcolor: 'primary.main',
              color: '#fff',
              boxShadow: 'none',
              '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
            }}
          >
            Score me
          </Button>
        ) : (
          <>
            <Button
              onClick={handleEmail}
              disabled={emailing}
              variant="contained"
              startIcon={<EmailOutlinedIcon />}
              sx={{
                textTransform: 'none',
                bgcolor: 'primary.main',
                color: '#fff',
                boxShadow: 'none',
                '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
              }}
            >
              {emailing ? 'Sending…' : 'Email my score'}
            </Button>
            <Button
              onClick={handleShare}
              variant="outlined"
              startIcon={<IosShareIcon />}
              sx={{
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                '&:hover': { borderColor: 'primary.dark', bgcolor: 'rgba(17,118,128,0.04)' },
              }}
            >
              Share link
            </Button>
            <Button
              onClick={handleReset}
              variant="text"
              startIcon={<RestartAltIcon />}
              sx={{ textTransform: 'none', color: 'text.secondary' }}
            >
              Reset
            </Button>
          </>
        )}
      </Box>

      <Snackbar
        open={toast.open}
        autoHideDuration={3000}
        onClose={() => setToast((t) => ({ ...t, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={toast.severity} variant="filled" sx={{ fontSize: '0.8125rem' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
