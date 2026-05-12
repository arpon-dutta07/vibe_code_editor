# Auth Manual Test Steps

Run these checks after deploying or when verifying auth works.

---

## Prerequisites

Ensure these env vars are set (`.env.local` for local, Vercel dashboard for production):

```
AUTH_SECRET=<random 32-char string — generate with: openssl rand -hex 32>
AUTH_URL=http://localhost:3000        # local only; omit on Vercel (auto-detected)
AUTH_GOOGLE_ID=...
AUTH_GOOGLE_SECRET=...
AUTH_GITHUB_ID=...
AUTH_GITHUB_SECRET=...
DATABASE_URL=postgresql://...
```

Google OAuth app settings (console.cloud.google.com):
- Authorized JavaScript origins: `http://localhost:3000`, `https://<your-domain>`
- Authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`, `https://<your-domain>/api/auth/callback/google`

GitHub OAuth app settings (github.com/settings/developers):
- Homepage URL: `https://<your-domain>`
- Authorization callback URL: `https://<your-domain>/api/auth/callback/github`

---

## Test checklist

### 1. Sign-in page loads
- [ ] Navigate to `/auth/sign-in` (unauthenticated).
- [ ] Page renders the sign-in form with Google and GitHub buttons.

### 2. Google OAuth
- [ ] Click "Sign in with Google".
- [ ] Google consent screen appears.
- [ ] After approving, redirected to `/` (DEFAULT_LOGIN_REDIRECT).
- [ ] Session is active — user avatar/name visible in header.
- [ ] Navigate to `/dashboard` — page loads with user's projects.

### 3. GitHub OAuth
- [ ] Sign out first (call `/api/auth/signout` or use the sign-out button).
- [ ] Repeat step 2 with GitHub.

### 4. Protected route redirect
- [ ] Open a new incognito window.
- [ ] Navigate to `/dashboard` while unauthenticated.
- [ ] Should redirect to `/auth/sign-in`.
- [ ] After signing in, should redirect back.

### 5. Session persistence
- [ ] Sign in, then close and reopen the browser.
- [ ] Navigate to `/dashboard` — still signed in (JWT is stored in cookie).

### 6. Sign-out
- [ ] Click sign-out.
- [ ] Session cookie is cleared.
- [ ] Navigating to `/dashboard` redirects to sign-in.

### 7. Vercel production (after deploy)
- [ ] Repeat all steps above on the Vercel preview URL.
- [ ] Check that `trustHost: true` is working: sign-in should not fail with a CSRF error.

---

## Common failure modes

| Symptom | Cause | Fix |
|---|---|---|
| Redirect loop on `/auth/sign-in` | `authRoutes` middleware matches the wrong path | Check `routes.ts` `authRoutes` array |
| "OAuthCallback" error | Callback URL mismatch in provider settings | Update OAuth app redirect URIs |
| Sign-in succeeds but session is empty | `AUTH_SECRET` differs between instances | Ensure same secret across all deployments |
| Works locally but fails on Vercel | Missing `trustHost: true` | Verify `auth.ts` has `trustHost: true` |
| Database connection error during sign-in | `DATABASE_URL` not set or wrong | Check PostgreSQL connection string |
