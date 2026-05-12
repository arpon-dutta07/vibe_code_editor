# VibecodeAI — Lovable-style HTML App Generator

An AI-powered browser IDE that turns natural language prompts into working web apps. Describe what you want to build, and the AI generates HTML/CSS/JS and shows a live preview — instantly.

---

## What it does

1. **Chat → Code**: Type a prompt. The AI (Gemini 2.5 Flash) writes your app as clean, vanilla HTML/CSS/JS.
2. **Live preview**: The generated HTML renders in a sandboxed iframe within 3 seconds.
3. **Monaco editor**: Edit the generated code directly. Save and preview updates immediately.
4. **Commit history**: Every AI generation is recorded as a commit. See what changed, in plain language.
5. **Skills system**: Toggle AI behavior with skill packs. `frontend-design` is active by default — it guides the AI toward distinctive, production-quality UI (not generic "AI-built" look).

---

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Auth | Auth.js v5 (Google + GitHub OAuth) |
| Database | PostgreSQL (Neon/Supabase) via Prisma 6 |
| AI | Gemini 2.5 Flash via Vercel AI SDK (`ai` + `@ai-sdk/google`) |
| Editor | Monaco Editor |
| Terminal | xterm.js v6 (WebContainer/Node mode) |
| Styling | Tailwind CSS 4 + shadcn/ui |

---

## Getting started

### 1. Clone and install

```bash
git clone https://github.com/arpon-dutta07/vibe_code_editor
cd vibe_code_editor
npm install
```

### 2. Set up environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

```env
# Auth
AUTH_SECRET=<run: openssl rand -hex 32>
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...

# Database (PostgreSQL — Neon free tier recommended)
DATABASE_URL=postgresql://...

# AI
GOOGLE_GENERATIVE_AI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash
```

### 3. Set up the database

```bash
npx prisma migrate dev --name init
```

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project flow

1. Sign in with Google or GitHub.
2. Click **New Project** on the dashboard.
3. Type a prompt: `"Build me a calculator app"`.
4. The AI calls `write_file` to create `index.html` (and `style.css`/`script.js` as needed).
5. Click **Preview** to see the result live.
6. Edit manually in Monaco, or keep prompting the AI.
7. Check **History** to see what each AI turn changed.

---

## Skills system

Skills are instruction sets loaded into the AI's context. Located in `skills/*/SKILL.md`.

| Skill | Status |
|---|---|
| `frontend-design` | Active — guides UI quality and visual distinctiveness |
| `architecture-design` | Coming soon |
| `database-selection` | Coming soon |
| `logging` | Coming soon |
| `testing-scripts` | Coming soon |
| `frontend` | Coming soon |
| `backend` | Coming soon |
| `docker` | Coming soon |
| `deployment` | Coming soon |
| `ci-cd-pipelines` | Coming soon |

Toggle skills per-project in the **Skills** tab of the project sidebar.

---

## Environment variables reference

| Variable | Required | Default | Description |
|---|---|---|---|
| `AUTH_SECRET` | Yes | — | Random secret for JWT signing |
| `AUTH_GOOGLE_ID` | Yes | — | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Yes | — | Google OAuth client secret |
| `AUTH_GITHUB_ID` | Yes | — | GitHub OAuth app client ID |
| `AUTH_GITHUB_SECRET` | Yes | — | GitHub OAuth app client secret |
| `DATABASE_URL` | Yes | — | PostgreSQL connection string |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Yes | — | Gemini API key |
| `GEMINI_MODEL` | No | `gemini-2.5-flash` | Model to use (`gemini-2.5-flash`, `gemini-3-flash`, `gemini-3-pro`) |

---

## Documentation

- [`docs/commit-history-summary.md`](docs/commit-history-summary.md) — What each historical commit did
- [`docs/upgrade-plan.md`](docs/upgrade-plan.md) — Package upgrade notes and decisions
- [`docs/fixes.md`](docs/fixes.md) — Root cause analysis for auth / preview / terminal
- [`docs/auth-test.md`](docs/auth-test.md) — Manual auth test steps
