# Vibecode Editor — Rebuild Spec

> **For Claude Code.** This file is the single source of truth for the rebuild. Read it top-to-bottom before making any changes. Do not deviate without confirming with the user.

---

## 0. Context

The repo is at `github.com/arpon-dutta07/vibe_code_editor`. It started as a browser IDE (Next.js + Monaco + WebContainers + Ollama + NextAuth v5 beta + Prisma/Mongo). The current state has several broken systems and outdated patterns. We're doing a **focused rebuild** — not a from-scratch rewrite. Keep what works (UI shell, Monaco wrapper, file explorer scaffolding), fix what's broken, and pivot the product from a "playground" toward a **Lovable-style AI app generator**.

---

## 1. Goals of this rebuild

In priority order:

1. **Fix what's broken**: authentication, preview, and terminal must all work end-to-end.
2. **Upgrade everything to current stable versions** (Next 16, Auth.js v5 stable, Prisma 6, React 19, Tailwind 4, etc.).
3. **Replace Ollama with the Gemini API** via the Vercel AI SDK (`@ai-sdk/google`).
4. **Pivot the codegen target from React to HTML** (single-file HTML/CSS/JS output, like early Lovable / v0).
5. **Add a markdown-file reading UX** — when the AI is reading a `.md` file, the UI shows `"Reading something.md"` inline (status pills, not a chat dump).
6. **Introduce a Skills system** with frontend-design as the first skill. Architecture for more skills (DB, logging, testing, backend, Docker, deploy, CI/CD) must be in place but only frontend-design is implemented now.
7. **Remove the playground system** entirely. Replace with a single project-centric flow.
8. **Commit-history awareness** — the UI should show "what changed in each commit" in plain language.

---

## 2. Before you start: orientation

**First action when you open this repo**: run

```bash
git log --oneline --all
git log --stat -p main -n 20
```

and produce a short summary (in this chat) of **what each of the existing 6 commits actually did**. The user wants this called out explicitly — they want to know what was done historically before we start tearing things apart. Save the summary to `docs/commit-history-summary.md`.

Then run:

```bash
npm outdated
npx prisma --version
cat package.json | jq '.dependencies, .devDependencies'
```

and produce a second summary of "what's outdated and what needs upgrading". Save to `docs/upgrade-plan.md`.

**Do not start coding until both summary files are written and the user has confirmed.**

---

## 3. Stack — target versions (verified Nov 2026)

| Layer | Old | New |
|---|---|---|
| Framework | Next.js 15.3.1 | **Next.js 16.x** (latest stable) |
| React | 19.0.0 | React 19 (keep) |
| Auth | next-auth@5.0.0-beta.27 | **`next-auth@5` stable** (Auth.js v5 went stable in late 2024; remove the `-beta` tag) |
| ORM | Prisma 6.10 | **Prisma latest 6.x** |
| DB | MongoDB | **PostgreSQL** (Neon or Supabase free tier). Mongo + Prisma has too many quirks (no FK constraints, no real transactions, adapter edge cases). Migrate the schema. |
| Editor | @monaco-editor/react 4.7 | keep, update to latest |
| Runtime | WebContainers | keep |
| Terminal | mix of `xterm` and `@xterm/*` | **`@xterm/xterm` only**. Remove the legacy `xterm`, `xterm-addon-fit`, `xterm-addon-search`, `xterm-addon-web-links` packages. Install `@xterm/addon-fit`, `@xterm/addon-search`, `@xterm/addon-web-links`, `@xterm/addon-webgl`. |
| AI | Ollama (local) | **Gemini via `@ai-sdk/google` + `ai` (Vercel AI SDK)**. Default model: `gemini-2.5-flash`. Allow upgrade to `gemini-3-flash` or `gemini-3-pro` via env. |
| Styling | Tailwind 4 + shadcn | keep |
| State | Zustand 5 | keep |

---

## 4. The three broken systems — root-cause first, then fix

For each of these, **find the actual cause before patching**. Add a short note to `docs/fixes.md` explaining what was wrong.

### 4.1 Authentication

**Symptoms**: doesn't work.

**Likely causes** (investigate in this order):
- Still on `next-auth@5.0.0-beta.27` which has known quirks vs. the stable release. Upgrade to stable.
- `AUTH_SECRET` / `NEXTAUTH_URL` mismatch between local and deployed envs.
- `middleware.ts` running on edge while Prisma adapter is being imported there — Prisma client doesn't work on edge. The split must be: `auth.config.ts` (edge-safe, no adapter) → consumed by `middleware.ts`; `auth.ts` (Node, with Prisma adapter) → consumed by route handlers and server components.
- Missing `trustHost: true` in production config (Vercel behind proxy).
- Cookie domain issues if the app is on a custom domain.

**Definition of done**:
- Google + GitHub OAuth both work in dev and on Vercel preview.
- Session is readable in server components via `auth()` and in route handlers.
- A protected route correctly redirects unauthenticated users to `/login`.
- E2E manual test documented in `docs/auth-test.md`.

### 4.2 Preview

**Symptoms**: doesn't work.

**Likely causes**:
- WebContainers require **COOP/COEP cross-origin isolation headers**. Check `vercel.json` / `next.config.ts`. The IDE route must set:
  ```
  Cross-Origin-Embedder-Policy: require-corp
  Cross-Origin-Opener-Policy: same-origin
  ```
- WebContainer boot is async and the preview iframe might be rendered before the server is ready. Need a proper boot state (`idle` → `booting` → `installing` → `ready` → `error`).
- The dev-server URL inside the WebContainer must be captured via the `server-ready` event and piped into the iframe `src`.
- If output is now HTML (per §5), preview is even simpler — no `npm install` for static HTML. Two preview modes:
  - **HTML mode**: render the generated HTML directly in a sandboxed iframe (no WebContainer needed for static output).
  - **Node mode**: WebContainer for anything that needs a build/server.

**Definition of done**:
- Iframe renders the live output within 3 seconds of generation for HTML mode.
- Errors during boot are surfaced in the UI with a "Retry" button.
- Console logs from the preview are piped into the in-app terminal/console panel.

### 4.3 Terminal

**Symptoms**: doesn't work.

**Likely causes**:
- Duplicate xterm packages (both `xterm` and `@xterm/xterm`) — addons attach to one instance, terminal instantiated from the other. **Fix first** — this alone may resolve it.
- Terminal is rendered on the server and xterm requires `window`. Must be `dynamic(() => import(...), { ssr: false })`.
- Container `dim` is 0×0 on first render — need `FitAddon.fit()` after the panel has measured.
- Not piped to the WebContainer's spawn process.

**Definition of done**:
- Terminal renders and accepts input.
- Resizing the panel calls `fit()` correctly.
- Output from `npm install` / dev server appears live.
- Ctrl+C kills the running process.

---

## 5. The product pivot — Lovable-style, HTML output

We are **removing the multi-template playground**. The new flow:

1. User lands on dashboard → "New project" button.
2. New project = an empty workspace with a chat panel on the left, an editor + preview on the right.
3. User types a prompt → Gemini generates a **single-file HTML app** (HTML + inline CSS + inline JS, or HTML + linked `style.css` + `script.js` — the AI decides based on complexity).
4. Each AI turn produces a diff against the current files. Diffs are applied, committed (in-app git-like history), and previewed.
5. User can edit files manually in Monaco. AI sees the manual edits on next turn.

**Remove**:
- `features/playground/` and all template selection (React, Next.js, Express, Hono, Vue, Angular).
- The "import GitHub repo" flow for now — defer to v2.
- Anything tied to running arbitrary Node projects in WebContainers (keep the WebContainer code, but only as a fallback Node runtime that the AI can opt into via a skill).

**Keep / refactor**:
- File explorer → now scoped to a single project's files (typically `index.html`, `style.css`, `script.js`, plus any assets).
- Monaco editor → unchanged.
- Chat panel → rebuilt around AI SDK `useChat`.

**New: project entity**
```
Project {
  id, userId, name, slug, createdAt, updatedAt,
  files: ProjectFile[]
  messages: ChatMessage[]
  commits: ProjectCommit[]   // in-app commit log
}
ProjectFile { id, projectId, path, content, updatedAt }
ChatMessage { id, projectId, role, parts (JSON), createdAt }
ProjectCommit { id, projectId, message, summary, diff (JSON), createdAt }
```

Write the Prisma schema accordingly. No Mongo.

---

## 6. Gemini integration

**Packages**:
```bash
npm install ai @ai-sdk/google zod
```

**Env**:
```
GOOGLE_GENERATIVE_AI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash  # default; allow gemini-3-flash, gemini-3-pro
```

**Server route** (`app/api/chat/route.ts`):
- Use `streamText` from `ai`.
- Model: `google(process.env.GEMINI_MODEL ?? 'gemini-2.5-flash')`.
- System prompt is built from: base IDE prompt + active skills (see §7) + current project file tree + truncated file contents.
- Tools the model can call:
  - `read_file(path)` — returns file contents. When called, the UI shows `Reading <path>` (see §8).
  - `write_file(path, content)` — writes/replaces a file. UI shows `Editing <path>` then `Wrote <path>`.
  - `delete_file(path)` — UI shows `Deleting <path>`.
  - `list_files()` — UI shows `Scanning project`.
  - `run_command(cmd)` — only if Node mode is active (WebContainer running). UI shows `Running <cmd>`.

**Client** (`features/chat/`):
- Use `useChat` from `@ai-sdk/react`.
- Render `message.parts` properly — text parts as markdown, tool-call parts as status pills (see §8).
- Stream responses.

**Provider abstraction**:
- Even though we're shipping Gemini, put it behind `lib/ai/provider.ts` so swapping to Anthropic/OpenAI later is one file.

---

## 7. Skills system

Skills are bundled instruction sets the AI loads into its system prompt to specialize behavior. Folder layout:

```
skills/
  frontend-design/
    SKILL.md          # description + when to use + actual instructions
    examples/         # optional example outputs
  README.md           # how skills work
```

**Frontend-design skill** (the only one we implement now):
- Loaded by default for every project (since this build only outputs HTML).
- Content: principles for distinctive, production-grade frontend (away from generic "AI look"), color/spacing/type-scale guidance, when to use animation, when not to, asset sourcing, accessibility minimums.
- The user can paste their own design system tokens; the skill picks those up.

**Skill loading flow**:
1. Server reads `skills/*/SKILL.md` at startup, caches in memory.
2. Each project has an `activeSkills: string[]` field (default `['frontend-design']`).
3. System prompt = base + concatenated active skill bodies + project context.

**Future skills** (scaffold only — create the folders with placeholder `SKILL.md` saying "Not yet implemented"):
- `architecture-design`
- `database-selection`
- `logging`
- `testing-scripts`
- `frontend` (broader than frontend-design)
- `backend`
- `docker`
- `deployment`
- `ci-cd-pipelines`

UI: a "Skills" tab in the project sidebar shows available skills with toggles. Only frontend-design is enabled-able for now; others are greyed out with "Coming soon".

---

## 8. Tool-call status UI ("Reading something.md")

When the AI calls a tool, **do not dump tool args/results into the chat bubble**. Instead, render an inline status pill within the assistant message:

```
[icon] Reading README.md         ← while in-flight
[icon] Read README.md (42 lines) ← done, collapsed by default
```

Click expands to show the file content or command output. Style: small rounded pill, muted background, single line, monospace path.

Pill labels by tool:
- `read_file` → `Reading <path>` → `Read <path>`
- `write_file` → `Editing <path>` → `Wrote <path>`
- `delete_file` → `Deleting <path>` → `Deleted <path>`
- `list_files` → `Scanning project` → `Scanned (<N> files)`
- `run_command` → `Running: <cmd>` → `Ran: <cmd>` (with exit code)

Implementation: iterate `message.parts`; when `part.type === 'tool-<name>'`, render the corresponding pill component based on `part.state` (`input-streaming` | `input-available` | `output-available` | `output-error`).

---

## 9. Commit history feature

The user wants to know "what was done in each commit" in plain language.

Two layers:

1. **Repo commits** (the existing 6 commits on `main` and any future ones): on demand, run `git log` and pass the diffs to Gemini to produce a one-sentence summary per commit. Cache to `docs/commit-history-summary.md`. Re-run when new commits land.

2. **In-app commits** (the `ProjectCommit` entity from §5): every time the AI applies a set of file writes, create a `ProjectCommit` with `message` = AI's own summary of the change. Show in a "History" tab in the project. Clicking a commit shows the diff and allows revert.

---

## 10. File-by-file cleanup checklist

Do these in order:

**Cleanup**:
- [ ] Add `buildlog.txt`, `generated/`, `.next/`, `node_modules/` to `.gitignore`. Remove tracked copies.
- [ ] Remove legacy xterm packages (see §3).
- [ ] Remove all Ollama references (README, env, code).
- [ ] Delete `features/playground/` (after copying anything reusable into `features/project/`).

**Upgrades**:
- [ ] `npm install next@latest` and run the codemod: `npx @next/codemod@latest upgrade latest`.
- [ ] `npm install next-auth@5` (drop `-beta`).
- [ ] `npm install prisma@latest @prisma/client@latest`.
- [ ] `npm install @ai-sdk/google ai zod`.
- [ ] `npm install @xterm/xterm @xterm/addon-fit @xterm/addon-search @xterm/addon-web-links @xterm/addon-webgl` and remove the legacy ones.
- [ ] Audit and update all `@radix-ui/*` packages to latest.

**Config**:
- [ ] `next.config.ts`: set COOP/COEP headers on the editor route (or globally if simpler). Configure Monaco workers.
- [ ] `vercel.json`: same headers, double check.
- [ ] `package.json`: add `"postinstall": "prisma generate"` to scripts.
- [ ] `prisma/schema.prisma`: switch provider to `postgresql`, write new schema per §5, run `prisma migrate dev --name init`.

**Auth**:
- [ ] Verify `auth.config.ts` is edge-safe (no Prisma import).
- [ ] Verify `auth.ts` imports the Prisma adapter and the providers, exports `handlers`, `auth`, `signIn`, `signOut`.
- [ ] Verify `middleware.ts` imports only from `auth.config.ts`.
- [ ] Add `trustHost: true` for prod.
- [ ] Test Google + GitHub OAuth flows.

**AI**:
- [ ] Create `lib/ai/provider.ts` (Gemini behind an interface).
- [ ] Create `lib/ai/tools.ts` with the 5 tools from §6.
- [ ] Create `lib/skills/loader.ts` and `skills/frontend-design/SKILL.md`.
- [ ] Create `app/api/chat/route.ts` using `streamText`.
- [ ] Create `features/chat/` with `useChat`-based components.
- [ ] Create the status-pill components per §8.

**Editor / Preview**:
- [ ] Refactor preview to support HTML mode (sandboxed iframe, srcDoc) and Node mode (WebContainer).
- [ ] Default new projects to HTML mode.
- [ ] Fix terminal per §4.3.

**Database**:
- [ ] Implement `Project`, `ProjectFile`, `ChatMessage`, `ProjectCommit` per §5.
- [ ] Server actions / route handlers for project CRUD.
- [ ] Replace any `features/playground` DB queries.

**Docs**:
- [ ] Rewrite `README.md` to reflect the new product (Lovable-style HTML app generator).
- [ ] `docs/commit-history-summary.md` (per §2).
- [ ] `docs/upgrade-plan.md` (per §2).
- [ ] `docs/fixes.md` (root causes for auth/preview/terminal).
- [ ] `docs/auth-test.md` (manual auth test steps).

---

## 11. Out of scope (don't touch this round)

- Real-time collaboration (Yjs / Liveblocks).
- One-click deploy to Vercel/Netlify from inside the IDE.
- Plugin marketplace.
- Image generation tools.
- Mobile responsive IDE UI (desktop only is fine for v1).
- The other 9 skills beyond frontend-design.

---

## 12. Working agreement

- **Branch per major area**: `chore/upgrade-deps`, `fix/auth`, `fix/preview`, `fix/terminal`, `feat/gemini`, `feat/skills`, `feat/html-output`, `refactor/remove-playground`. Open small PRs.
- **Commit messages**: conventional commits (`fix:`, `feat:`, `chore:`, `refactor:`, `docs:`).
- **Don't bulk-rewrite working code**. Touch only what the spec asks for.
- **If something in this spec contradicts itself or seems wrong, stop and ask** before guessing.
- **After each major area is done**, update its checkbox in §10 and post a short summary.

---

## 13. Definition of done for the whole rebuild

- `npm run build` succeeds with zero errors and zero peer-dep warnings.
- Auth: Google + GitHub OAuth both work locally and on Vercel preview.
- Preview: a Gemini-generated HTML app renders in the iframe within 3s.
- Terminal: accepts input and shows output in Node mode.
- Chat: streaming Gemini responses with status pills for tool calls.
- A new user can sign up → create a project → prompt "build me a calculator" → see a working calculator in the preview within 30s.
- All four docs (`commit-history-summary.md`, `upgrade-plan.md`, `fixes.md`, `auth-test.md`) exist and are accurate.
- README updated.
- No references to Ollama anywhere in the codebase.