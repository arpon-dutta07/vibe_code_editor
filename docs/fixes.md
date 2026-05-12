# Root Cause Analysis — Three Broken Systems

---

## 1. Authentication

**Root cause**: Three compounding issues.

### 1a. Beta version quirks
`next-auth@5.0.0-beta.27` has known divergences from the stable v5 API. The beta has shifted its JWT/session callback signatures multiple times. **Fix**: upgraded to `^5.0.0-beta.31` (latest available); will upgrade to stable v5 when it lands on npm `latest`.

### 1b. Missing `trustHost: true`
When deployed on Vercel (or any reverse proxy), Auth.js receives requests with a forwarded host header. Without `trustHost: true`, CSRF validation fails on the callback URL, causing sign-in to silently fail or redirect to an error page.

**Fix**: added `trustHost: true` to `auth.ts` NextAuth config.

### 1c. Prisma adapter on edge (potential)
The `middleware.ts` was importing from `auth.config.ts` (edge-safe, no adapter), which is correct. No fix needed here — the split was already in place.

**What still needs manual verification**:
- `AUTH_SECRET`, `NEXTAUTH_URL` (or `AUTH_URL` for v5), `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET`, `AUTH_GITHUB_ID`, `AUTH_GITHUB_SECRET` must all be set in both local `.env` and Vercel environment variables.
- Google OAuth: Authorized Redirect URIs must include `https://<your-domain>/api/auth/callback/google`.
- GitHub OAuth: Homepage URL and Callback URL must match.

---

## 2. Preview

**Root cause**: Two issues.

### 2a. No HTML mode
The old preview was WebContainer-only (boot → npm install → dev server → iframe). For the new HTML output model, this is overkill and fragile. A simple `<iframe srcDoc={html}>` is instant and reliable.

**Fix**: Added `features/webcontainers/components/html-preview.tsx` — a sandboxed iframe that renders HTML content directly via `srcDoc`. This is the default for all new projects.

### 2b. WebContainer COOP/COEP headers
The `next.config.ts` and `vercel.json` already had the correct headers:
```
Cross-Origin-Opener-Policy: same-origin
Cross-Origin-Embedder-Policy: require-corp
```
These were already present — the headers were not the primary issue. The real issue was using a heavy Node-mode preview for what should be a static HTML preview.

**WebContainer (Node mode)** is preserved for future use but is not the default path.

---

## 3. Terminal

**Root cause**: Duplicate xterm package conflict.

Both `xterm` (legacy, unscoped) and `@xterm/xterm` (scoped, modern) were installed simultaneously. The `terminal.tsx` component imported from `xterm` while the addons were listed as `@xterm/addon-webgl` etc. xterm's module system creates separate instances when both packages are present. Addons try to attach to an `@xterm/xterm` Terminal instance but the component holds a `xterm` Terminal instance — they are incompatible objects, causing silent failures and a blank terminal.

**Fix**:
1. Removed `xterm`, `xterm-addon-fit`, `xterm-addon-search`, `xterm-addon-web-links` from `package.json`.
2. Added `@xterm/addon-fit`, `@xterm/addon-search`, `@xterm/addon-web-links` (scoped packages).
3. Updated all imports in `terminal.tsx` from `xterm` → `@xterm/xterm`, etc.
4. Upgraded `@xterm/xterm` to `^6.0.0` and all addons to their latest compatible versions.
