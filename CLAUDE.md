# Raybot — Claude Code Instructions

## Project Overview

Standalone AI chat assistant for Big Freight Life at `raybot.bfl.design`. Represents Ray Butler in conversation — answers questions, generates diagrams, captures leads.

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript
- **UI:** MUI 6
- **AI Model:** Google Gemini Flash (`gemini-2.0-flash`)
- **Voice Output:** ElevenLabs TTS (Rachel voice)
- **Voice Input:** Web Speech API (browser-native)
- **Diagrams:** Mermaid.js (rendered inline in chat with DOMPurify sanitization)
- **Email:** Resend API
- **Logging:** Vercel KV (conversations stored 30 days, auto-expire)
- **Hosting:** Vercel, repo `Big-Freight-Life/bfl-raybot`, branch `main`

## Architecture

Separate Vercel project from `bfl-design` for security isolation. No shared infrastructure.

### Key Components
- **ChatPanel** — Main chat orchestrator with typewriter effect, session history
- **ChatInput** — Textarea with mic, speaker toggle, send button
- **ChatMessage** — Message bubble with copy, download, like/dislike actions, source labels (voice/text)
- **IconSidebar** — Collapsible sidebar (52px rail / 260px expanded) with logo, new chat, process link, case studies
- **AvatarStage** — Digital twin mode: dark stage with animated avatar placeholder (HeyGen integration pending)
- **EmailGate** — Email validation gate (format + MX record check, blocks disposable domains)
- **InlineDiagram** — Renders Mermaid diagrams inline in chat messages

### Digital Twin Mode
Activated via brain icon in top bar. Collapses sidebar, shows avatar stage on left, chat becomes transcript panel on right (320px). Floating toolbar at bottom of avatar stage with speaker/mic controls. Chat input hidden in this mode.

## API Routes

| Route | Method | Purpose | Rate Limit |
|-------|--------|---------|------------|
| `/api/chat` | POST | Gemini chat with history | 20/hr per IP |
| `/api/tts` | POST | ElevenLabs text-to-speech | 20/hr per IP |
| `/api/lead` | POST | Lead capture (Resend + Slack) | 3/hr per IP |
| `/api/feedback` | POST | Like/dislike logging | None |
| `/api/verify-email` | POST | Email validation (MX lookup) | 10/10min per IP |

## Environment Variables

```
GEMINI_API_KEY          # Google AI Studio
ELEVENLABS_API_KEY      # ElevenLabs
RESEND_API_KEY          # Resend email
CONTACT_EMAIL           # Lead notification recipient
SLACK_WEBHOOK_URL       # Slack notification
CALENDAR_URL            # Google Calendar booking link
NEXT_PUBLIC_CALENDAR_URL # Client-side calendar URL
KV_REST_API_URL         # Vercel KV (auto-set when linked)
KV_REST_API_TOKEN       # Vercel KV (auto-set when linked)
```

## Deployment

1. Edit locally in `/Users/raybutler/development/bfl-raybot`
2. Push to `Big-Freight-Life/bfl-raybot` (branch: `main`)
3. Vercel auto-deploys, or `vercel deploy --prod`
4. Live at: https://bfl-raybot.vercel.app

## Important Notes

- Email gate collects email before chat access (MX validation, no verification code)
- Conversations are logged to Vercel KV with 30-day TTL, IPs are hashed
- Knowledge base is in `src/lib/knowledge.ts` — update when services/products change
- Mermaid SVG output is sanitized with DOMPurify before DOM insertion
- In-memory rate limiter resets on cold starts (Vercel serverless)
- The chat shares a thread between text and digital twin modes — messages labeled with source
