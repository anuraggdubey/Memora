# Memora

> **The AI that never forgets.**

Memora is a persistent-memory AI chat platform where conversations are never disposable. Every message, decision, idea, and preference you share is stored, indexed, and made permanently accessible. Unlike traditional AI chatbots that reset between sessions, Memora builds a continuous understanding of you over time.

## What Makes Memora Different

| Traditional AI Chatbots | Memora |
|---|---|
| Forgets everything after session ends | Remembers every conversation permanently |
| No cross-session learning | Builds a user profile from day one |
| One global chat feed | Workspaces with isolated memory scopes |
| No insights or reports | Weekly digest, decisions log, topic heatmaps |
| Single AI model | Dual-model routing: Grok + Gemini Flash |
| No memory editing | Full memory audit — view, edit, delete any fact |

## Core Features

- **Persistent Memory** — Every conversation is analyzed and key facts, preferences, decisions, and goals are automatically extracted and stored.
- **Dual AI Model Routing** — Messages are intelligently routed between Grok (fast, low-latency responses) and Gemini Flash (deep reasoning, long context) based on complexity.
- **Workspaces** — Isolated environments (Work, Personal, Learning, etc.) with their own memory scope, AI persona, and model preference.
- **Memory Management** — View, edit, pin, or delete any extracted memory. Add manual memories anytime.
- **Weekly Insights** — AI-generated weekly digests summarizing topics discussed, decisions made, and patterns noticed.
- **Decisions Log** — Every decision you make in chat is tracked with context, so you can review and update their status over time.
- **Slash Commands** — `/remember`, `/forget`, `/search`, `/summarize`, `/deep`, `/groq`, and more.
- **Voice Input** — Browser-native speech recognition for hands-free input.

## Tech Stack

| Technology | Purpose |
|---|---|
| Next.js (App Router) | Frontend framework |
| TypeScript | Language |
| Tailwind CSS | Styling |
| Supabase | PostgreSQL database + pgvector + auth |
| Grok API | Primary AI — fast responses, simple queries |
| Google Gemini Flash | Secondary AI — long context, analysis, summaries |
| pgvector | Vector similarity search for memory retrieval |
| Inngest | Background jobs — memory extraction, digest generation |
| Bun | Package manager and runtime |

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) installed
- A [Grok API](https://console.groq.com/) key
- A [Google Gemini API](https://aistudio.google.com/apikey) key
- A [Supabase](https://supabase.com/) project

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/memora.git
   cd memora
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create your environment file:
   ```bash
   cp .env.example .env
   ```

4. Fill in your API keys in `.env` (see [Environment Variables](#environment-variables) below).

5. Start the development server:
   ```bash
   bun run dev
   ```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Your Grok API key for fast inference |
| `GOOGLE_GEMINI_API_KEY` | Your Google Gemini Flash API key |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key (server-side only) |
| `INNGEST_EVENT_KEY` | Inngest event key for background jobs |
| `INNGEST_SIGNING_KEY` | Inngest signing key |
| `RESEND_API_KEY` | Resend API key for transactional emails |
| `CRON_SECRET` | Secret for securing cron job endpoints |

> **Note:** Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Never put secrets in `NEXT_PUBLIC_` variables.

## Scripts

| Command | Description |
|---|---|
| `bun run dev` | Start the local Next.js dev server |
| `bun run build` | Create a production build |
| `bun run start` | Serve the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format the project with Prettier |

## Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login and signup pages
│   ├── (workspace)/     # Dashboard pages (chat, memories, insights, etc.)
│   ├── components/      # Shared UI components
│   ├── pages/           # Page-level components
│   ├── context.tsx      # Global app state (React Context)
│   └── layout.tsx       # Root layout
├── components/ui/       # Shadcn/Radix UI primitives
├── lib/                 # Utilities, API clients, config
└── styles.css           # Global styles
```

## License

This project is private and not yet licensed for public distribution.
