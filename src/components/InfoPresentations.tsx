'use client';

import { Box, Typography, Button } from '@mui/material';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import FileDownloadOutlinedIcon from '@mui/icons-material/FileDownloadOutlined';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
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
        <Box
          sx={{
            width: 88,
            height: 88,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #117680 0%, #2dd4bf 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontSize: '2rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          RB
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

      {/* Currently */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          px: 1.5,
          py: 1,
          borderRadius: '999px',
          bgcolor: 'rgba(45,212,191,0.08)',
          border: 1,
          borderColor: 'rgba(45,212,191,0.25)',
          alignSelf: 'flex-start',
        }}
      >
        <FiberManualRecordIcon sx={{ fontSize: 10, color: 'primary.main' }} />
        <Typography variant="caption" sx={{ color: 'text.primary', fontSize: '0.75rem', fontWeight: 500 }}>
          Currently building Big Freight Life — applied AI architecture for enterprise systems
        </Typography>
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
        <Button
          component="a"
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          variant="contained"
          startIcon={<FileDownloadOutlinedIcon />}
          sx={{
            textTransform: 'none',
            bgcolor: 'primary.main',
            color: '#fff',
            boxShadow: 'none',
            '&:hover': { bgcolor: 'primary.dark', boxShadow: 'none' },
          }}
        >
          Download Resume
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

/* ─── Contact ─── */

export function ContactPresentation() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
      <Box>
        <Box
          component="img"
          src="/images/logo-teal.png"
          alt="Big Freight Life"
          sx={{ width: 48, height: 48, display: 'block', mb: 1.5 }}
        />
        <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.2, color: 'text.primary', mb: 0.5 }}>
          Get in touch
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.6 }}>
          We respond to every inbound message — typically within one business day.
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {/* Address card */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: 'background.paper',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <LocationOnOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}
            >
              Address
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              Big Freight Life LLC
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              1351 N Buckner Blvd #180397
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              Dallas, TX 75218
            </Typography>
          </Box>
        </Box>

        {/* Email card */}
        <Box
          component="a"
          href="mailto:hello@bflux.co"
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
            textDecoration: 'none',
            color: 'inherit',
            transition: 'all 0.15s ease',
            '&:hover': { borderColor: 'primary.main', bgcolor: 'rgba(17,118,128,0.06)' },
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: 'background.paper',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <EmailOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}
            >
              Email
            </Typography>
            <Typography variant="body2" sx={{ color: 'primary.main', lineHeight: 1.6, fontWeight: 500 }}>
              hello@bflux.co
            </Typography>
          </Box>
        </Box>

        {/* Hours card */}
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            p: 2,
            borderRadius: '12px',
            border: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: '8px',
              bgcolor: 'background.paper',
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <AccessTimeOutlinedIcon sx={{ fontSize: 20 }} />
          </Box>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', fontSize: '0.6875rem', display: 'block', mb: 0.5 }}
            >
              Business Hours
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
              Monday – Friday, 9am – 6pm CT
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
