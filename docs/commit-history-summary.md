# Commit History Summary

Generated 2026-05-13. Based on `git log --stat main`.

---

## Commit 1 — `a7a9f0d` — "first commit" (2026-01-11, Arpon Dutta)

**What it did**: Full project scaffold from scratch.

- Next.js 15 app-router setup with TypeScript, Tailwind 4, shadcn/ui (full component library).
- Auth: `next-auth` v5 beta (Google + GitHub OAuth), `auth.config.ts` + `auth.ts` split, Prisma adapter for MongoDB.
- Prisma/MongoDB schema: `User`, `Account`, `Playground`, `TemplateFile`, `ChatMessage`.
- Playground system: `app/playground/[id]/page.tsx` (587 lines), Monaco editor wrapper, WebContainer preview component, terminal component.
- Template selector modal supporting React, Next.js, Express, Vue, Hono, Angular.
- AI chat side panel (`features/ai-chat/`) with code blocks, file attachments, file preview.
- API routes: `/api/chat` (Ollama), `/api/code-suggestion`, `/api/template/[id]`, `/api/auth/[...nextauth]`.
- Dashboard and landing page shells.

---

## Commit 2 — `494714b` — "Update AI model and improve error handling" (2026-01-11, Archishman Mitra)

**What it did**: First round of improvements to AI and playground.

- Switched AI model in chat and code-suggestion routes (Ollama model name update).
- Rewrote `code-suggestion` route with better error handling and streaming (127 lines → richer logic).
- Playground page (`app/playground/[id]/page.tsx`): added AI chat integration (+111 lines), wired up sidebar with file context.
- `PlaygroundEditor`: added AI code insertion functionality, inline suggestion handling.
- `useAISuggestions` hook: minor fix.
- Terminal component: layout and rendering fixes.
- WebContainer preview: refactored render logic.

---

## Commit 3 — `3d178c2` — "GitHub import/export, auto-save, AI chat integration" (2026-01-13, Archishman Mitra)

**What it did**: Largest commit — major feature additions.

- GitHub import (`/api/github/import`) and export (`/api/github/export`) API routes (190 + 263 lines).
- Auto-save hook (`features/playground/hooks/useAutoSave.tsx`, 96 lines) — debounced save to DB.
- Chat session management: new `/api/chat/sessions` and `/api/chat/session/[sessionId]` routes (95 + 79 lines). Chat messages now stored per-session.
- `/api/implement-code` route (361 lines) — separate endpoint to apply AI-suggested code to files.
- AI chat side panel massive expansion (+590 lines) — session list, history, file context passing.
- Playground page extended (+407 lines) — GitHub modal integration, session switching.
- **Problem**: committed `generated/react-app/` (full Vite/React scaffold with `package-lock.json` 3223 lines) — should be gitignored.
- **Problem**: committed `buildlog.txt` — should be gitignored.
- Prisma schema: added `sessionId` and `playgroundId` to `ChatMessage`.
- README updated with feature descriptions.

---

## Commit 4 — `987a8ad` — "Project context in AI, terminal toggle, WebContainer fixes" (2026-01-13, Archishman Mitra)

**What it did**: Made AI context-aware of current project files.

- Chat route (`/api/chat`): system prompt now includes file tree + truncated file contents from the active playground (+54 lines net).
- Playground page: terminal visibility toggle (show/hide terminal panel).
- WebContainer preview component: large rewrite (627 lines, -342/+460) — better boot state management (`idle → booting → installing → ready → error`), improved error surfaces.
- `buildlog.txt` added (10 lines) — **should not be committed**.
- `features/ai-chat/components/ai-chat-sidepanel.tsx`: passes `projectFiles` and `openFiles` to preview.

---

## Commit 5 — `249b5c7` — "Refactor AIChatSidePanel props, fix editor command removal" (2026-01-14, Archishman Mitra)

**What it did**: Small, focused refactor.

- `AIChatSidePanel` component now accepts `projectFiles` and `openFiles` as explicit props (previously likely implicit/context).
- `PlaygroundEditor`: safer command removal from Monaco editor instance (guarded dispose call).

---

## Commit 6 — `e9f6a23` — "Homepage redesign, framer-motion, pricing section" (2026-01-14, Archishman Mitra)

**What it did**: Marketing homepage overhaul.

- `app/(root)/page.tsx`: complete rewrite (735 lines) — new hero, feature grid, pricing section, link cards.
- Three new UI components: `BackgroundGradient`, `Card26`, `PricingCard`.
- Added `framer-motion` for page animations.
- Updated `react-day-picker` to 9.13.0.
- Added 10 PNG images to `public/` (1.png–10.png, ~1.1MB total).

---

## Commit 7 — `10e9105` — "Hover effects, PlaygroundEditor refactor, useAISuggestions fix" (2026-05-13, Archishman Mitra)

**What it did**: UI polish and state management cleanup.

- `app/globals.css`: hover-effect CSS for benefit/feature cards (+29 lines).
- `PlaygroundEditor`: large refactor (~1150 lines changed) — better AI suggestion handling, cleaner state machine for suggestion accept/reject.
- `useAISuggestions` hook: rewritten to use `useEffect` for state consistency (62 lines changed).

---

## Key observations

1. `node_modules` not installed — `npm install` needed before any dev work.
2. `generated/react-app/` and `buildlog.txt` are tracked in git — should be removed and gitignored.
3. Auth is still on `next-auth@5.0.0-beta.27` (package.json) / beta.31 (resolved range).
4. Prisma schema is MongoDB with `@map("_id")` everywhere — full migration to PostgreSQL required.
5. Both `xterm` (legacy) and `@xterm/xterm` (scoped) are in dependencies — duplicate, causes addon conflicts.
6. AI is wired to Ollama (local) — no Gemini/cloud AI yet.
7. No `docs/` directory existed before this run.
