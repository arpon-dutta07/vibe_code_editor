# Upgrade Plan

Generated 2026-05-13. Based on `npm outdated` + `package.json` audit.

> Note: `node_modules` is not installed. All packages show as MISSING in `npm outdated`.
> "Current" below refers to the version pinned/resolved in `package.json` / `package-lock.json`.

---

## 0. First: install deps

```bash
npm install
```

---

## 1. Packages to REMOVE (spec §3, §10)

| Package | Reason |
|---|---|
| `xterm` | Legacy, conflicts with `@xterm/xterm`. Terminal broken because both present. |
| `xterm-addon-fit` | Legacy. Replace with `@xterm/addon-fit`. |
| `xterm-addon-search` | Legacy. Replace with `@xterm/addon-search`. |
| `xterm-addon-web-links` | Legacy. Replace with `@xterm/addon-web-links`. |

```bash
npm uninstall xterm xterm-addon-fit xterm-addon-search xterm-addon-web-links
```

---

## 2. Packages to ADD (spec §3, §6, §10)

| Package | Version | Purpose |
|---|---|---|
| `ai` | latest (≥4.x) | Vercel AI SDK — `streamText`, `useChat` |
| `@ai-sdk/google` | latest | Gemini provider for AI SDK |
| `@xterm/addon-fit` | latest | xterm fit addon (scoped) |
| `@xterm/addon-search` | latest | xterm search addon (scoped) |
| `@xterm/addon-web-links` | latest | xterm web-links addon (scoped) |
| `prisma` (devDep) | latest 6.x | CLI for migrations |

```bash
npm install ai @ai-sdk/google @xterm/addon-fit @xterm/addon-search @xterm/addon-web-links
npm install -D prisma@^6
```

Note: `@xterm/addon-webgl` and `@xterm/xterm` are already in `package.json`.

---

## 3. Core framework upgrades

### 3.1 Next.js: 15.3.1 → 16.x (REQUIRED by spec)

```bash
npm install next@latest
npx @next/codemod@latest upgrade latest
```

Breaking changes to watch:
- App Router APIs may have minor changes — run codemod first.
- `next.config.ts` syntax may need updates.
- `eslint-config-next` version must match Next version.

### 3.2 next-auth: beta.27 → v5 stable (REQUIRED by spec)

```bash
npm install next-auth@5
```

⚠️ `npm outdated` shows `latest` as `4.24.14` (v4 line). The spec states Auth.js v5 went stable in late 2024.
Check `npm view next-auth versions` to confirm v5 stable tag before installing.
If v5 stable is not on the `latest` tag yet, install with explicit version: `npm install next-auth@5.x.x`.

### 3.3 Prisma: @prisma/client 6.10.0 → latest 6.x (spec says stay on 6.x)

```bash
npm install @prisma/client@^6 prisma@^6
```

Also: switch DB from MongoDB to PostgreSQL — requires full schema rewrite (see §5 below).

---

## 4. Minor version upgrades (available, recommended)

| Package | Current (package.json) | Latest | Notes |
|---|---|---|---|
| `@xterm/xterm` | 5.5.0 | **6.0.0** | Major — API changes likely. Evaluate before upgrading. |
| `@xterm/addon-webgl` | 0.18.0 | 0.19.0 | Safe minor. |
| `monaco-editor` | 0.52.2 | 0.55.1 | Safe minor. Update `@monaco-editor/react` too. |
| `framer-motion` | 11.18.2 | **12.x** | Major — breaking API changes. Lower priority (homepage only). |
| `lucide-react` | 0.507.0 | **1.x** | Major — icon name changes. Update after checking usage. |
| `date-fns` | 3.x | **4.x** | Major. Update if used in critical paths. |
| `react-resizable-panels` | 3.x | **4.x** | Major. Playground layout depends on this — check API diff. |
| `recharts` | 2.x | **3.x** | Major. Only if charts are in active use. |
| `zod` | 3.x | **4.x** | Major — spec uses zod for AI tool schemas; update carefully. |
| `react-syntax-highlighter` | 15.6.1 | 16.x | Minor/major. Used in AI chat code blocks. |
| `react-day-picker` | 9.13.0 | **10.x** | Major. Calendar component. |

**Recommendation**: upgrade `@xterm/*`, `monaco-editor`, `@monaco-editor/react`, `react-resizable-panels` as part of the terminal/editor fix work. Hold `framer-motion`, `lucide-react`, `recharts`, `zod` until core systems are stable.

---

## 5. Database migration: MongoDB → PostgreSQL (REQUIRED by spec)

Current state: `prisma/schema.prisma` uses `provider = "mongodb"` with MongoDB-specific syntax (`@map("_id")` on every model, no FK constraints).

Required actions:
1. Provision a PostgreSQL instance (Neon free tier recommended — serverless, Vercel-native).
2. Rewrite `prisma/schema.prisma`: remove `@map("_id")`, use `@id @default(cuid())`, add FK relations, new schema per spec §5.
3. Run `prisma migrate dev --name init`.
4. Update `DATABASE_URL` env to PostgreSQL connection string.

New schema entities per spec §5:
- `Project` (replaces `Playground`)
- `ProjectFile` (replaces `TemplateFile`)
- `ChatMessage` (keep, update relations)
- `ProjectCommit` (new)

---

## 6. Environment variables to add/change

```env
# Add
GOOGLE_GENERATIVE_AI_API_KEY=...
GEMINI_MODEL=gemini-2.5-flash

# Change
DATABASE_URL=postgresql://...   # was MongoDB

# Keep (verify these exist)
AUTH_SECRET=...
NEXTAUTH_URL=...   # or AUTH_URL for Auth.js v5
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
```

---

## 7. Config file changes needed

- `package.json`: add `"postinstall": "prisma generate"` to scripts.
- `next.config.ts`: add COOP/COEP headers for WebContainer route; configure Monaco workers.
- `vercel.json`: mirror the same COOP/COEP headers.
- `.gitignore`: add `buildlog.txt`, `generated/`, `.next/`, `node_modules/` (some may already be present — verify).
- `eslint-config-next`: update version to match Next 16.

---

## 8. Items to remove from codebase

- `generated/react-app/` — accidentally committed; should be gitignored and deleted from tracking.
- `buildlog.txt` — accidentally committed; should be gitignored.
- All Ollama references in `app/api/chat/route.ts`, `app/api/code-suggestion/route.ts`, README.
- `features/playground/` — to be replaced by `features/project/` (defer delete until new feature built).

---

## Priority order for upgrades

1. `npm install` (get node_modules in place)
2. Remove legacy xterm packages, install scoped ones + AI SDK packages
3. Upgrade Next.js + run codemod
4. Upgrade next-auth to v5 stable
5. Upgrade Prisma 6.x + migrate schema to PostgreSQL
6. Minor version bumps (`@xterm`, `monaco-editor`, `react-resizable-panels`)
7. Evaluate and upgrade remaining major-version packages (framer-motion, lucide, zod, recharts)
