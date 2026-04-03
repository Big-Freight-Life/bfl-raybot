'use client';

import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ViewSidebarOutlinedIcon from '@mui/icons-material/ViewSidebarOutlined';
import Image from 'next/image';

const caseStudies = [
  { title: 'Hyland OnBase Integration', href: 'https://bfl.design/hyland-onbase-salesforce-integration/' },
  { title: 'Hyland for Workday', href: 'https://bfl.design/works/case-studies/hyland-for-workday-integration/' },
  { title: 'Salesforce Migration', href: 'https://bfl.design/works/case-studies/' },
];

interface IconSidebarProps {
  open: boolean;
  onToggle: () => void;
}

export default function IconSidebar({ open, onToggle }: IconSidebarProps) {
  return (
    <Box
      sx={{
        width: open ? 260 : 52,
        flexShrink: 0,
        display: { xs: 'none', md: 'flex' },
        flexDirection: 'column',
        borderRight: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        transition: 'width 0.2s ease',
        overflow: 'hidden',
      }}
    >
      {/* Top row */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          height: 49,
          px: open ? 1.5 : 0,
          justifyContent: open ? 'space-between' : 'center',
          borderBottom: 1,
          borderColor: 'divider',
          flexShrink: 0,
        }}
      >
        {open ? (
          <>
            <Box
              component="a"
              href="https://bfl.design"
              target="_blank"
              rel="noopener noreferrer"
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Image
                src="/images/logo-teal.png"
                alt="Big Freight Life"
                width={20}
                height={20}
                style={{ display: 'block' }}
              />
            </Box>
            <Tooltip title="Close sidebar">
              <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
                <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Tooltip>
          </>
        ) : (
          <Tooltip title="Open sidebar" placement="right">
            <IconButton size="small" onClick={onToggle} sx={{ color: 'text.secondary' }}>
              <ViewSidebarOutlinedIcon sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Nav items */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: open ? 'flex-start' : 'center', py: 1, gap: 0.5, px: open ? 1 : 0 }}>
        <Tooltip title="New chat" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            onClick={() => {
              sessionStorage.removeItem('raybot_history');
              window.location.reload();
            }}
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1 }}
          >
            <EditNoteIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>New chat</Box>}
          </IconButton>
        </Tooltip>

        <Tooltip title="Process" placement="right" disableHoverListener={open}>
          <IconButton
            size="small"
            component="a"
            href="https://bfl.design/process"
            target="_blank"
            rel="noopener noreferrer"
            sx={{ color: 'text.secondary', '&:hover': { color: 'text.primary' }, borderRadius: open ? '8px' : '50%', width: open ? '100%' : 'auto', justifyContent: 'flex-start', gap: 1.5, px: open ? 1.5 : 1 }}
          >
            <AccountTreeOutlinedIcon sx={{ fontSize: 20 }} />
            {open && <Box component="span" sx={{ fontSize: '0.8125rem', whiteSpace: 'nowrap' }}>Process</Box>}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Case Studies section — only when expanded */}
      {open && (
        <Box sx={{ px: 1.5, mt: 2 }}>
          <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', display: 'block', mb: 1, px: 0.5 }}>
            Case Studies
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
            {caseStudies.map((study) => (
              <Box
                key={study.title}
                component="a"
                href={study.href}
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  display: 'block',
                  px: 1.5,
                  py: 1,
                  borderRadius: '8px',
                  fontSize: '0.8125rem',
                  color: 'text.secondary',
                  textDecoration: 'none',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  '&:hover': { bgcolor: 'action.hover', color: 'text.primary' },
                }}
              >
                {study.title}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}
