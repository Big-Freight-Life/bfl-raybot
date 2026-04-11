'use client';

import { Box, Typography } from '@mui/material';
import type { CaseStudy, PresentationBlock } from '@/lib/case-studies';

interface CaseStudyPresentationProps {
  study: CaseStudy;
}

export default function CaseStudyPresentation({ study }: CaseStudyPresentationProps) {
  if (!study.presentation) return null;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {/* Title */}
      <Typography
        component="h1"
        sx={{ fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3, color: 'text.primary' }}
      >
        {study.title}
      </Typography>

      {/* Summary block with role and date */}
      {study.summary && (
        <Box
          sx={{
            p: 2,
            borderRadius: '12px',
            bgcolor: 'action.hover',
            borderLeft: 3,
            borderColor: 'primary.main',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              fontWeight: 600,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              display: 'block',
              mb: 0.75,
              fontSize: '0.6875rem',
            }}
          >
            Summary
          </Typography>
          <Typography
            variant="body2"
            sx={{
              lineHeight: 1.6,
              color: 'text.primary',
              mb: study.role || study.date ? 1.5 : 0,
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {study.summary}
          </Typography>
          {(study.role || study.date) && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              {study.role && (
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', lineHeight: 1.5 }}>
                  <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mr: 1 }}>
                    Role
                  </Box>
                  {study.role}
                </Typography>
              )}
              {study.date && (
                <Typography sx={{ fontSize: '0.8125rem', color: 'text.primary', lineHeight: 1.5 }}>
                  <Box component="span" sx={{ color: 'text.secondary', fontSize: '0.6875rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600, mr: 1 }}>
                    Date
                  </Box>
                  {study.date}
                </Typography>
              )}
            </Box>
          )}
        </Box>
      )}

      {/* Rest of the presentation content */}
      {study.presentation.map((block, i) => (
        <BlockRenderer key={i} block={block} />
      ))}
    </Box>
  );
}

function BlockRenderer({ block }: { block: PresentationBlock }) {
  if (block.type === 'heading') {
    const fontSize = block.level === 1 ? '1.5rem' : block.level === 2 ? '1.125rem' : '1rem';
    const mt = block.level === 1 ? 0 : 1;
    return (
      <Typography
        component={`h${block.level}` as 'h1' | 'h2' | 'h3'}
        sx={{
          fontSize,
          fontWeight: 700,
          lineHeight: 1.3,
          color: 'text.primary',
          mt,
          mb: 0.5,
        }}
      >
        {block.text}
      </Typography>
    );
  }

  if (block.type === 'paragraph') {
    return (
      <Typography variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
        {block.text}
      </Typography>
    );
  }

  if (block.type === 'list') {
    return (
      <Box component="ul" sx={{ pl: 3, m: 0, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        {block.items.map((item, i) => (
          <Typography component="li" key={i} variant="body2" sx={{ lineHeight: 1.7, color: 'text.primary' }}>
            {item}
          </Typography>
        ))}
      </Box>
    );
  }

  if (block.type === 'image') {
    return (
      <Box sx={{ my: 1 }}>
        {block.src ? (
          <Box
            component="img"
            src={block.src}
            alt={block.alt}
            sx={{ width: '100%', borderRadius: '12px', display: 'block' }}
          />
        ) : (
          <Box
            sx={{
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '12px',
              background: `linear-gradient(135deg, ${block.color || '#C2703E'} 0%, ${block.color || '#C2703E'}88 100%)`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'rgba(255,255,255,0.7)',
              fontSize: '0.875rem',
              fontWeight: 500,
              letterSpacing: '0.02em',
            }}
            role="img"
            aria-label={block.alt}
          >
            {block.alt}
          </Box>
        )}
        {block.caption && (
          <Typography
            variant="caption"
            sx={{ display: 'block', mt: 0.75, color: 'text.secondary', fontSize: '0.75rem', textAlign: 'center' }}
          >
            {block.caption}
          </Typography>
        )}
      </Box>
    );
  }

  return null;
}
