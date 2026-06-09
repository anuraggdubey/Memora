# MEMORA

**Persistent Memory AI Chat Platform**

**Complete Product Build Plan — Frontend to Backend**

> **The AI chatbot that actually remembers you — forever.**
> Dual AI model routing • Persistent memory graph • Workspaces • Weekly insights

**Version 1.0** • Tech Stack: Next.js, Supabase, Gemini Flash, Groq

---

## Table of Contents

1. [Product Overview](#1-product-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Project Folder Structure](#4-project-folder-structure)
5. [Features — Complete Specification](#5-features--complete-specification)
6. [API Endpoints](#6-api-endpoints)
7. [User Flow — Step by Step](#7-user-flow--step-by-step)
8. [UI/UX Design Specification](#8-uiux-design-specification)
9. [Background Jobs](#9-background-jobs)
10. [Environment Variables](#10-environment-variables)
11. [Build Phases — What to Build When](#11-build-phases--what-to-build-when)
12. [Cost Breakdown — Running for Free](#12-cost-breakdown--running-for-free)
13. [Security & Privacy](#13-security--privacy)
14. [Launch Checklist](#14-launch-checklist)

---

## 1. Product Overview

### 1.1 What is Memora?

Memora is a Web2 AI chat platform where conversations are not disposable. Every message, decision, idea, and preference a user shares is stored, indexed, and made permanently accessible. The AI does not just answer questions — it learns the user over time, surfaces relevant past context automatically, and generates weekly insights from the user's chat history.

### 1.2 The Core Problem We Solve

Every existing AI chatbot (ChatGPT, Claude, Gemini) has the same fundamental flaw: memory resets either between sessions or after a context window limit. Users are forced to re-explain themselves constantly. Memora fixes this at the infrastructure level — memory is stored in a database, not a context window.

| **Existing AI Tools** | **Memora** |
|---|---|
| ChatGPT / Claude / Gemini | Memora |
| Forgets everything after session ends | Remembers every conversation permanently |
| No cross-session learning | Builds user profile from day 1 |
| One global chat feed | Workspaces with isolated memory scopes |
| No insights or reports | Weekly digest, decisions log, year in review |
| Single AI model | Dual-model routing: Groq + Gemini Flash |
| No memory editing | Full memory audit — view, edit, delete any fact |

### 1.3 Target Users

- **Students and learners** — track what they are studying, get quizzed, never repeat context
- **Professionals** — maintain a running work context, decision log, project memory
- **Journalers and self-improvement users** — daily entries, mood tracking, weekly AI summaries
- **Power users / developers** — slash commands, API access, custom personas per workspace
- **Anyone frustrated by AI amnesia**

### 1.4 Platform Name

| |
|---|
| **Platform name: MEMORA** |
| **Tagline:** The AI that never forgets. |
| **Domain:** memora.app (or similar) |
| **Brand feel:** Clean, minimal, trustworthy. No dark mode gimmicks, no crypto aesthetic. |

---

## 2. Technology Stack

### 2.1 Stack Overview

The entire platform is designed to run for free at MVP stage using generous free tiers. All tools selected are production-grade and can scale when the user base grows.

### 2.2 Full Stack Breakdown

| **Tool** | **Purpose** | **Cost** |
|---|---|---|
| Next.js 14 (App Router) | Frontend framework | Free / Open source |
| Tailwind CSS | Styling | Free / Open source |
| TypeScript | Language | Free / Open source |
| Vercel | Hosting + serverless functions + cron jobs | Free (100GB bandwidth) |
| Supabase | PostgreSQL database + pgvector + auth | Free (500MB storage) |
| Clerk | User authentication (alternative to Supabase auth) | Free (10K MAU) |
| Groq API | Primary AI: fast responses, simple queries | Free tier (generous) |
| Google Gemini Flash | Secondary AI: long context, analysis, summaries | Free (1M tokens/day) |
| pgvector (Supabase) | Vector similarity search for memory retrieval | Free (bundled) |
| Inngest | Background jobs — memory extraction after each chat | Free tier |
| Resend | Transactional email for weekly digests | Free (3K emails/month) |
| Web Speech API | Voice input in browser — no cost | Free (browser native) |
| Vercel Cron | Scheduled weekly digest generation | Free (2 cron jobs) |

### 2.3 Why Dual AI Model (Groq + Gemini Flash)?

The two models serve different purposes. The platform automatically routes each user message to the best model based on message complexity — users never need to switch manually.

| **Model** | **When it is used** |
|---|---|
| Groq (Llama 3.1) | Fast, short replies. Simple Q&A, casual chat, quick lookups. Extremely low latency (under 1 second). Best for real-time feel. |
| Google Gemini Flash | Long context analysis, summarization, PDF reading, weekly digest generation, coding help. Handles 1M token context. Best for depth. |
| Auto-routing logic | If message is under 200 tokens AND no documents/files attached AND no /deep command: use Groq. Everything else: use Gemini Flash. |
| Manual override | User can type /groq or /gemini to force a model. Or pin a workspace to always use a specific model. |

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
Browser (Next.js) → Vercel Edge/Serverless API Routes → Supabase (Postgres + pgvector)
                                                       → Groq API (fast replies)
                                                       → Gemini Flash API (deep replies)
                                                       → Inngest (background memory extraction jobs)

Vercel Cron → Gemini Flash → Weekly digest generation → Resend (email delivery)
```

### 3.2 Database Schema

All data lives in Supabase PostgreSQL. The schema is designed for both relational queries (fetch messages by conversation) and vector similarity search (find memories relevant to current message).

#### Users table

```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  name          TEXT,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  preferences   JSONB DEFAULT '{}'
);
```

#### Workspaces table

```sql
CREATE TABLE workspaces (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            TEXT NOT NULL,
  description     TEXT,
  system_prompt   TEXT,
  model_preference TEXT DEFAULT 'auto',  -- 'auto' | 'groq' | 'gemini'
  color           TEXT DEFAULT '#2E75B6',
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Conversations table

```sql
CREATE TABLE conversations (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  title           TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now(),
  message_count   INTEGER DEFAULT 0,
  is_pinned       BOOLEAN DEFAULT false
);
```

#### Messages table

```sql
CREATE TABLE messages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id),
  role            TEXT NOT NULL,  -- 'user' | 'assistant'
  content         TEXT NOT NULL,
  model_used      TEXT,           -- 'groq' | 'gemini'
  tokens_used     INTEGER,
  created_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Memories table (core differentiator)

```sql
CREATE TABLE memories (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id    UUID REFERENCES workspaces(id),  -- null = global memory
  content         TEXT NOT NULL,  -- extracted fact or preference
  category        TEXT,  -- 'fact' | 'preference' | 'decision' | 'goal' | 'person' | 'project'
  source_conv_id  UUID REFERENCES conversations(id),
  embedding       vector(768),  -- pgvector embedding for similarity search
  is_pinned       BOOLEAN DEFAULT false,
  is_deleted      BOOLEAN DEFAULT false,
  confidence      FLOAT DEFAULT 1.0,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- Vector index for fast similarity search
CREATE INDEX ON memories USING ivfflat (embedding vector_cosine_ops);
```

#### Decisions log table

```sql
CREATE TABLE decisions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  workspace_id    UUID REFERENCES workspaces(id),
  decision_text   TEXT NOT NULL,
  context         TEXT,
  source_conv_id  UUID REFERENCES conversations(id),
  decided_at      TIMESTAMPTZ DEFAULT now()
);
```

#### Weekly digests table

```sql
CREATE TABLE weekly_digests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  week_start      DATE NOT NULL,
  content         TEXT NOT NULL,  -- AI-generated markdown summary
  topics          TEXT[],
  decisions_count INTEGER DEFAULT 0,
  generated_at    TIMESTAMPTZ DEFAULT now()
);
```

---

## 4. Project Folder Structure

### 4.1 Next.js App Router Structure

```
memora/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx            # sidebar + workspace nav
│   │   ├── page.tsx              # home: recent chats
│   │   ├── chat/
│   │   │   ├── [conversationId]/page.tsx
│   │   ├── workspace/
│   │   │   ├── [workspaceId]/page.tsx
│   │   ├── memories/page.tsx     # memory cards UI
│   │   ├── insights/page.tsx     # weekly digests + topic heatmap
│   │   ├── decisions/page.tsx    # decisions log
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── chat/route.ts         # main chat endpoint
│   │   ├── memories/
│   │   │   ├── route.ts            # CRUD for memories
│   │   │   └── search/route.ts     # vector search
│   │   ├── workspaces/route.ts
│   │   ├── conversations/route.ts
│   │   ├── digest/route.ts       # weekly digest generation
│   │   └── cron/weekly/route.ts  # Vercel cron trigger
│   └── layout.tsx
├── components/
│   ├── chat/
│   │   ├── ChatWindow.tsx
│   │   ├── MessageBubble.tsx
│   │   ├── MessageInput.tsx      # slash commands, voice input
│   │   └── ModelBadge.tsx        # shows which AI responded
│   ├── memory/
│   │   ├── MemoryCard.tsx
│   │   └── MemoryGrid.tsx
│   ├── sidebar/
│   │   ├── Sidebar.tsx
│   │   └── WorkspaceList.tsx
│   └── insights/
│       ├── WeeklyDigest.tsx
│       └── TopicHeatmap.tsx
├── lib/
│   ├── supabase.ts           # Supabase client
│   ├── groq.ts               # Groq API wrapper
│   ├── gemini.ts             # Gemini API wrapper
│   ├── router.ts             # model routing logic
│   ├── memory-extractor.ts   # post-chat memory extraction
│   └── embeddings.ts         # generate + search embeddings
├── inngest/
│   ├── client.ts
│   └── functions/
│       ├── extract-memories.ts  # triggered after each conversation
│       └── weekly-digest.ts     # Sunday cron job
├── types/
│   └── index.ts
├── .env.local
└── package.json
```

---

## 5. Features — Complete Specification

### 5.1 Core Chat

#### How it works

- User types a message in the chat input
- System checks if a /command was used (see slash commands section)
- Router decides: Groq or Gemini based on message length and complexity
- Top 5 most relevant memories are fetched via pgvector similarity search
- Memories are silently injected into the system prompt as context
- AI generates response using selected model with memory context
- Response streams back to UI token by token
- A model badge shows whether Groq or Gemini answered
- After conversation ends or after 10 messages: background job extracts new memories

#### Model routing logic

```typescript
// lib/router.ts
export function selectModel(message: string, hasFiles: boolean, forcedModel?: string): 'groq' | 'gemini' {
  if (forcedModel) return forcedModel as 'groq' | 'gemini';
  if (hasFiles) return 'gemini';
  if (message.length > 800) return 'gemini';
  if (message.includes('/deep') || message.includes('/analyze')) return 'gemini';
  const complexKeywords = ['explain', 'summarize', 'compare', 'analyze', 'write', 'code'];
  if (complexKeywords.some(k => message.toLowerCase().includes(k))) return 'gemini';
  return 'groq';
}
```

### 5.2 Memory System

#### Automatic memory extraction

After every conversation (triggered by Inngest background job), Gemini Flash reads the full transcript and extracts structured memories. This runs asynchronously — the user never waits for it.

```typescript
// Extraction prompt sent to Gemini Flash
const EXTRACTION_PROMPT = `
You are a memory extraction system. Read this conversation and extract
important facts about the user. Return JSON array only, no other text.

For each memory, output:
{ content: string, category: 'fact'|'preference'|'decision'|'goal'|'person'|'project' }

Examples:
- 'User is a CS graduate from 2026' -> category: fact
- 'User prefers concise answers' -> category: preference
- 'User decided to build a Web2 project instead of Web3' -> category: decision
- 'User wants to launch MVP in 2 months' -> category: goal
- 'User mentioned a co-founder named Rahul' -> category: person
- 'User is building a chat platform called Memora' -> category: project

Only extract clear, useful facts. Do not extract filler or small talk.`
```

#### Memory retrieval (context injection)

Before every AI response, the system runs a vector similarity search to find the 5 most relevant memories for the current message, then injects them into the system prompt.

```typescript
// lib/embeddings.ts
export async function getRelevantMemories(userId: string, message: string, workspaceId?: string) {
  const embedding = await generateEmbedding(message);  // Gemini embeddings API
  const { data } = await supabase.rpc('match_memories', {
    query_embedding: embedding,
    match_user_id: userId,
    match_workspace_id: workspaceId ?? null,
    match_count: 5,
    match_threshold: 0.7
  });
  return data;
}
```

#### Memory cards UI

- Dedicated /memories page shows all extracted memories in a card grid
- Each card shows: content, category badge (color-coded), date extracted, source conversation link
- User can: edit text, delete memory, pin memory (always included in context), add manual memory
- Filter by category: All / Facts / Preferences / Decisions / Goals / People / Projects
- Search bar with full-text search across all memories

### 5.3 Workspaces

Workspaces are isolated environments with their own memory scope, AI persona, and model preference. Think of them as separate brains for different areas of life.

| **Workspace** | **Purpose and behavior** |
|---|---|
| Work | Professional context only. Custom persona: 'Be my senior engineering advisor'. Model: Gemini. |
| Health | Tracks fitness goals, diet, sleep notes. AI persona: 'Health coach'. Model: Groq. |
| Learning | Study mode. Tracks topics, quizzes user, spaced repetition. Model: Gemini. |
| Personal | Journal mode. Daily entries, mood tracking, life decisions. Model: Auto. |
| Projects | Per-project workspace. Full context of design decisions, blockers, progress. Model: Gemini. |
| Custom | User creates any workspace with a custom name, color, persona, and model preference. |

**Memory scoping:** When chatting in the Work workspace, only Work memories are injected into context. Global memories (pinned, or category=fact/person) are always included regardless of workspace.

### 5.4 Slash Commands

| **Command** | **What it does** |
|---|---|
| /remember [text] | Manually save something as a memory. Skips extraction, saves immediately. |
| /forget [text] | Searches memories for matching text and marks them deleted. |
| /search [query] | Searches all past conversations and memories. Returns top results with links. |
| /summarize | Summarizes the current conversation so far. |
| /decisions | Lists all logged decisions across all workspaces. |
| /report | Generates an on-demand summary of the past 7 days. |
| /deep [message] | Forces Gemini Flash regardless of message length. |
| /groq [message] | Forces Groq regardless of message complexity. |
| /persona [text] | Sets a custom system prompt for this workspace temporarily. |
| /export | Exports all memories and chat history as JSON or Markdown download. |

### 5.5 Insights & Reports

#### Weekly digest

- Every Sunday at midnight, Vercel Cron triggers the digest generation job
- Inngest function fetches all messages from past 7 days for the user
- Gemini Flash generates a structured markdown report with: topics covered, decisions made, goals mentioned, mood assessment, notable moments
- Digest is stored in the weekly_digests table and shown in the Insights page
- Optional: emailed to user via Resend (user can opt in)

#### Topic heatmap

- Reads category tags and message content from past 90 days
- Groups by topic clusters: work, health, relationships, money, learning, creativity, etc.
- Renders as a visual grid (recharts or plain div grid) — darker color = more messages
- User can click a topic to see all conversations in that topic

#### Decisions log

- Every time Gemini extracts a memory with category='decision', it also writes a row to the decisions table
- Decisions page shows a timeline of every decision made since account creation
- Filterable by workspace, date range, and keyword
- User can mark a decision as 'implemented', 'abandoned', or 'in progress'

### 5.6 Voice Input

- MessageInput component includes a microphone button
- Uses browser-native Web Speech API — zero cost, no external service needed
- On mobile: works with device microphone. On desktop: uses computer mic.
- Transcribed text appears in the input field — user can edit before sending
- Supported in all Chromium browsers (Chrome, Edge, Brave). Firefox has limited support.

### 5.7 Memory Export

- User can download their full data at any time: zero lock-in anxiety
- /export command or Export button in Settings
- Downloads a .zip containing: memories.json, conversations.json, decisions.json, digests.md
- Import back in: upload the .zip on a new account to restore all memories

---

## 6. API Endpoints

### 6.1 Chat API

**POST /api/chat**

The main endpoint. Handles model routing, memory injection, streaming response, and triggering memory extraction.

#### Request body

```json
{
  "conversationId": "string",
  "workspaceId": "string",
  "message": "string",
  "forcedModel": "'groq' | 'gemini'",
  "hasFiles": "boolean"
}
```

#### Response

```
// Streamed response (Server-Sent Events)
data: {token: 'Hello'}
data: {token: ' world'}
data: {done: true, model: 'groq', messageId: 'uuid', tokensUsed: 142}
```

#### Internal logic (pseudocode)

```
1. Authenticate user (Supabase/Clerk JWT)
2. Load workspace system prompt and model preference
3. Fetch top 5 relevant memories via pgvector
4. Build system prompt = base_prompt + workspace_persona + memory_context
5. Select model via selectModel(message, hasFiles, workspace.model_preference)
6. Load last 20 messages from conversation as chat history
7. Stream response from selected AI API
8. Save assistant message to DB
9. If message_count % 10 === 0: trigger Inngest 'extract-memories' event
10. Return stream
```

### 6.2 Memory Endpoints

| **Endpoint** | **Purpose** | **Notes** |
|---|---|---|
| GET /api/memories | Fetch all memories for user. Supports ?category=&workspace=&search= filters. | Auth required |
| POST /api/memories | Create a manual memory. Body: { content, category, workspaceId } | Auth required |
| PATCH /api/memories/:id | Update a memory content, category, or pin status. | Auth required |
| DELETE /api/memories/:id | Soft delete a memory (sets is_deleted=true). | Auth required |
| POST /api/memories/search | Vector similarity search. Body: { query, workspaceId, limit }. Returns ranked memories. | Auth required |

### 6.3 Conversation Endpoints

| **Endpoint** | **Purpose** | **Notes** |
|---|---|---|
| GET /api/conversations | List all conversations. Supports ?workspaceId= and ?page= pagination. | Auth required |
| POST /api/conversations | Create new conversation. Body: { workspaceId, title } | Auth required |
| GET /api/conversations/:id | Fetch conversation with all messages. | Auth required |
| PATCH /api/conversations/:id | Update title or pin status. | Auth required |
| DELETE /api/conversations/:id | Delete conversation and all its messages. | Auth required |

### 6.4 Workspace Endpoints

| **Endpoint** | **Purpose** | **Notes** |
|---|---|---|
| GET /api/workspaces | List all workspaces for user. | Auth required |
| POST /api/workspaces | Create workspace. Body: { name, description, systemPrompt, modelPreference, color } | Auth required |
| PATCH /api/workspaces/:id | Update workspace settings. | Auth required |
| DELETE /api/workspaces/:id | Delete workspace. Cascades to conversations + memories. | Auth required |

### 6.5 Insights Endpoints

| **Endpoint** | **Purpose** | **Notes** |
|---|---|---|
| GET /api/digest | Fetch all weekly digests for user. Supports ?week= filter. | Auth required |
| POST /api/digest/generate | Manually trigger digest generation for any week. | Auth required |
| GET /api/decisions | Fetch all logged decisions. Supports ?workspace=&status= filters. | Auth required |
| PATCH /api/decisions/:id | Update decision status: implemented / abandoned / in-progress. | Auth required |
| POST /api/cron/weekly | Vercel Cron trigger — generates digests for all users. Protected by CRON_SECRET. | Cron only |

---

## 7. User Flow — Step by Step

### 7.1 Onboarding Flow

- User visits memora.app and clicks 'Get started free'
- Signs up with email/Google via Clerk
- Brief onboarding wizard: 'What will you use Memora for?' (picks 1-3 use cases)
- System creates 3 default workspaces based on their selection (e.g. Work, Personal, Learning)
- User is dropped into the first workspace with a welcome message from the AI
- Welcome message explains: what Memora does, that memory builds over time, slash commands available

### 7.2 Daily Use Flow

- User opens Memora app
- Sees sidebar with recent conversations grouped by workspace
- Clicks a workspace or starts a new chat
- Types a message — or uses microphone button for voice
- AI responds in under 1 second (Groq) or 2-3 seconds (Gemini)
- Model badge in corner shows which AI answered
- User continues the conversation naturally
- After every 10 messages, background job silently extracts new memories — user never sees this
- User can type /remember [something] to save a specific fact immediately

### 7.3 Memory Management Flow

- User visits the Memories page from sidebar
- Sees all extracted memories as cards, organized by category
- Clicks a card to expand — sees the source conversation that generated it
- Edits a memory if the AI extracted it wrong
- Deletes irrelevant memories
- Pins important memories (these are always included in context)
- Adds a manual memory: 'I am vegetarian' — saved immediately

### 7.4 Insights Flow

- Every Sunday morning, user receives email: 'Your Memora weekly digest is ready'
- Opens Insights page
- Sees this week's AI-generated summary: what they worked on, decisions made, patterns noticed
- Scrolls down to see the topic heatmap for the past month
- Clicks a topic block to see all conversations in that topic
- Visits Decisions page to review all logged decisions and update their status

### 7.5 Power User Flow

- Creates a custom workspace: 'Startup — Memora' with persona 'You are my brutally honest startup advisor who always pushes me to ship faster'
- Pins this workspace to always use Gemini Flash
- Uses /search [topic] to find all past conversations about a specific subject
- Uses /report to get an instant summary of the past week without waiting for Sunday
- Uses /export to download all data as a backup

---

## 8. UI/UX Design Specification

### 8.1 Design Philosophy

- Clean, minimal, trustworthy — not a flashy AI toy, feels like a serious productivity tool
- No dark mode by default (white surface, light gray sidebar). Offer dark mode toggle in settings.
- Typography: Inter font, 14px body, generous line height
- Colors: Blue (#2E75B6) as primary accent. Category badges are color-coded. No rainbow overload.
- Everything loads instantly — Groq responses feel near-real-time

### 8.2 Page-by-Page Layout

#### Main chat layout

- Left sidebar (260px): workspace list, recent chats, nav links (Memories, Insights, Decisions, Settings)
- Center (flex-1): chat window with message bubbles. User messages right-aligned, AI messages left-aligned.
- Bottom: message input with: text area, send button, microphone button, attachment button (future), model indicator
- Top of chat: conversation title (editable), model badge showing current auto-selected model

#### Message bubble

- User: white bubble, right side, no avatar
- AI: light gray bubble, left side, model badge (Groq = orange badge, Gemini = blue badge)
- Markdown rendering: headers, bold, code blocks, bullet lists all render properly
- Code blocks: syntax highlighted, copy button in top right corner
- Streaming: text appears token by token, typing indicator dots while waiting

#### Memories page

- Grid layout: 3 columns on desktop, 1 column on mobile
- Each card: category badge (color-coded), memory text, date, source chat link, edit/delete icons
- Top bar: search input + category filter tabs (All / Facts / Preferences / Decisions / Goals / People / Projects)
- 'Add memory' button: opens a simple form with text field and category dropdown
- Pinned memories shown first with a pin icon

#### Insights page

- Weekly digest section: card per week, expandable to read full AI report
- Topic heatmap: calendar-style grid, past 90 days, colored by message volume
- Quick stats bar: total conversations, total memories, total decisions, days active

#### Decisions page

- Timeline view: newest first
- Each decision: text, workspace tag, date, status dropdown (pending / implemented / abandoned / in-progress)
- Filter bar: by workspace, by date range, by status

### 8.3 Responsive Design

| **Breakpoint** | **Layout** |
|---|---|
| Desktop (1200px+) | Two-column layout: sidebar + main content. Full chat interface. |
| Tablet (768–1200px) | Sidebar collapses to icon-only mode. Chat window full width. |
| Mobile (< 768px) | No sidebar. Bottom tab nav: Chats / Memories / Insights. Mobile-first input area. |

---

## 9. Background Jobs

### 9.1 Memory Extraction Job

Triggered by Inngest after every 10 messages in a conversation, or when the user explicitly ends a session.

```typescript
// inngest/functions/extract-memories.ts
export const extractMemories = inngest.createFunction(
  { id: 'extract-memories' },
  { event: 'chat/conversation.updated' },
  async ({ event, step }) => {
    const { conversationId, userId, workspaceId } = event.data;

    // Fetch full conversation transcript
    const messages = await step.run('fetch-messages', async () => {
      return supabase.from('messages').select('*').eq('conversation_id', conversationId);
    });

    // Send to Gemini Flash for extraction
    const extracted = await step.run('extract', async () => {
      return gemini.generateContent(EXTRACTION_PROMPT + JSON.stringify(messages));
    });

    // Save each memory with embedding
    await step.run('save-memories', async () => {
      for (const memory of extracted) {
        const embedding = await generateEmbedding(memory.content);
        await supabase.from('memories').upsert({ ...memory, userId, workspaceId, embedding });
      }
    });
  }
);
```

### 9.2 Weekly Digest Job

Triggered every Sunday at 00:00 UTC by Vercel Cron. Generates a digest for every active user.

```json
// vercel.json
{
  "crons": [{
    "path": "/api/cron/weekly",
    "schedule": "0 0 * * 0"
  }]
}
```

```typescript
// Digest generation prompt
const DIGEST_PROMPT = `
You are generating a weekly personal review for a user.
Based on their conversations from the past 7 days, write a friendly summary covering:
1. Main topics and themes discussed
2. Decisions made (if any)
3. Goals mentioned or progress on goals
4. Any patterns or recurring concerns you notice
5. One encouraging observation about their week

Be warm, personal, and insightful. Write in second person ('You spent a lot of time...').
Keep it under 400 words. Format in clean markdown.`
```

---

## 10. Environment Variables

```bash
# .env.local

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Auth (Clerk)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...

# AI Models
GROQ_API_KEY=gsk_...
GOOGLE_GEMINI_API_KEY=AIza...

# Background jobs
INNGEST_EVENT_KEY=...
INNGEST_SIGNING_KEY=...

# Email
RESEND_API_KEY=re_...

# Cron security
CRON_SECRET=your-random-secret-here
```

---

## 11. Build Phases — What to Build When

### Phase 1: MVP (Week 1–3)

**Goal:** Get a working chat product with memory extraction running. No insights, no workspaces yet.

- Next.js project setup, Supabase schema, Clerk auth
- Basic chat UI: input, message bubbles, streaming
- Groq API integration (fast replies)
- Gemini Flash integration (deep replies)
- Model routing logic
- Memory extraction Inngest job
- pgvector setup and context injection
- Deploy to Vercel

> **Phase 1 end state:** A working chat app that remembers you. Basic but already better than ChatGPT.

### Phase 2: Core Platform (Week 4–6)

- Workspaces: create, switch, isolated memory scopes
- Memories page: view, edit, delete, pin, add manually
- Slash commands: /remember, /forget, /search, /summarize
- Model badge on messages
- Voice input (Web Speech API)
- Decisions log (auto-detection + dedicated page)

> **Phase 2 end state:** A full platform. Users can manage their memory, use workspaces, and see decisions.

### Phase 3: Insights & Polish (Week 7–9)

- Weekly digest generation (cron job + Gemini)
- Topic heatmap visualization
- Insights page with stats, heatmap, digest history
- Email delivery via Resend
- Memory export (/export command)
- Settings page: account, model preferences, email opt-in
- Mobile responsive layout

> **Phase 3 end state:** Shippable, polished product. Ready for public launch and user feedback.

### Phase 4: Growth Features (Post-launch)

- Study mode with spaced repetition
- Second brain: PDF/document upload + RAG
- Year in review report
- Custom AI personas marketplace
- Shared workspaces (team/couples memory)
- API access for power users

---

## 12. Cost Breakdown — Running for Free

The entire MVP can run at $0/month. Here is exactly what the free tiers allow and when you hit limits.

| **Service** | **Free tier details** | **When to upgrade** |
|---|---|---|
| Vercel (Hobby) | Free: 100GB bandwidth, unlimited deployments, 2 cron jobs | Upgrade at ~1000 DAU |
| Supabase (Free) | Free: 500MB database, 1GB file storage, 50K MAU auth | Upgrade at ~500 users with heavy history |
| Clerk (Free) | Free: 10,000 monthly active users | Upgrade when >10K MAU — $25/month after |
| Groq API | Free tier: 14,400 requests/day (6000 tokens/min) | Sufficient for hundreds of daily users |
| Gemini Flash | Free: 1M tokens/day input, 4M output tokens/day | Extremely generous — lasts until real scale |
| Inngest (Free) | Free: 50K function runs/month | Each conversation = ~1 run. 50K conversations/month free |
| Resend (Free) | Free: 3,000 emails/month, 100/day | Sufficient for weekly digests up to 3K users |
| **Total monthly cost** | **$0 up to ~500–1000 active users** | Scale costs only appear at real traction |

> **Key insight: The AI API cost is per-token, not per-user.**
> At low volume (under 500 daily users), Gemini Flash and Groq free tiers are more than enough.
> When you start charging users $5–10/month, the free tiers easily cover costs until $5K+ MRR.

---

## 13. Security & Privacy

### 13.1 Data Security

- All API routes protected by Clerk JWT verification — no unauthenticated access
- Supabase Row Level Security (RLS) enabled on all tables — users can only read/write their own data
- Service role key only used in server-side API routes, never exposed to client
- Cron endpoints protected by CRON_SECRET header verification
- All data encrypted in transit (HTTPS) and at rest (Supabase default encryption)

### 13.2 Privacy Design

- Memory audit page gives users full visibility into everything stored about them
- One-click memory deletion — users can remove any extracted fact
- Full data export available at any time — no lock-in
- Account deletion cascades: deletes all messages, memories, workspaces permanently
- No memory is shared between users — complete isolation
- Users own their data — clear privacy policy stating data is not used for model training

### 13.3 Supabase RLS Policies

```sql
-- Example RLS policy: users can only see their own memories
ALTER TABLE memories ENABLE ROW LEVEL SECURITY;

CREATE POLICY 'Users can view own memories'
  ON memories FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY 'Users can insert own memories'
  ON memories FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY 'Users can update own memories'
  ON memories FOR UPDATE
  USING (auth.uid() = user_id);
```

---

## 14. Launch Checklist

### Pre-launch

- [ ] All Phase 1 and 2 features working end-to-end
- [ ] Mobile responsive layout tested on iPhone and Android
- [ ] RLS policies active on all Supabase tables
- [ ] Error handling: API failures show user-friendly messages, not raw errors
- [ ] Rate limiting on /api/chat to prevent abuse (use Vercel Edge middleware)
- [ ] Privacy policy and terms of service pages
- [ ] Custom domain configured on Vercel
- [ ] Vercel Analytics enabled (free)

### Launch day

- [ ] Post on X/Twitter: demo video showing the memory feature in action
- [ ] Post on LinkedIn: product story — why AI amnesia is a real problem
- [ ] Submit to Product Hunt
- [ ] Post in relevant Reddit communities: r/productivity, r/ChatGPT, r/selfhosted
- [ ] Share in developer Discord communities

### Post-launch

- [ ] Set up Sentry for error monitoring (free tier)
- [ ] Monitor Supabase usage dashboard weekly
- [ ] Collect user feedback via in-app feedback button
- [ ] Weekly review of which workspaces and features are used most

---

> **Final note: Ship Phase 1 in 3 weeks. Get real users. Let their behavior tell you what to build next.**
>
> The memory system is the moat. Every day a user talks to Memora, switching cost grows.
> Focus on making the first 10 users love it before scaling to 1000.

---

*End of Document — Memora Platform Build Plan v1.0*
