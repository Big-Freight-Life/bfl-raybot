# Raybot

AI chat assistant for [Big Freight Life](https://bfl.design) at [raybot.bfl.design](https://bfl-raybot.vercel.app).

## Setup

```bash
nvm use           # Uses Node version from .nvmrc
npm install
cp .env.example .env.local   # Fill in your values
npm run dev       # http://localhost:3000
```

## Stack

- Next.js 16 (App Router)
- MUI 6
- Google Gemini Flash (chat)
- ElevenLabs (text-to-speech)
- Mermaid.js (diagrams)
- Vercel KV (conversation logging)
- Resend (email)

## Features

- AI chat with typewriter effect
- Voice input (Web Speech API) and output (ElevenLabs TTS)
- Inline Mermaid diagram rendering
- Digital twin mode with avatar stage
- Lead capture (email + Google Calendar)
- Email gate with MX validation
- Conversation logging (30-day auto-delete)

## Deploy

Push to `main` — Vercel auto-deploys.

```bash
# Force deploy from local
vercel deploy --prod
```

## Environment Variables

See `.env.example` for required variables. Set them in Vercel project settings for production.
