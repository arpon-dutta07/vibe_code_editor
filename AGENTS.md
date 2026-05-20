# Repository Guidelines

## Project Structure & Module Organization
VibecodeAI is an AI-powered browser IDE built with Next.js 16 (App Router). The codebase follows a feature-centric organization:
- **`.\app`**: Contains the Next.js App Router structure, including API routes and main page layouts.
- **`.\features`**: Core business logic split by feature (`auth`, `chat`, `dashboard`, `project`, `webcontainers`).
- **`.\skills`**: Instruction sets for specializing AI behavior (e.g., `frontend-design`).
- **`.\lib`**: Shared utilities, database client (`db.ts`), and AI provider abstractions (`lib\ai`).
- **`.\components`**: Shared UI components using Radix UI and Tailwind CSS 4.
- **`.\prisma`**: Database schema and migrations for PostgreSQL.

## Build, Test, and Development Commands
- **`npm run dev`**: Starts the Next.js development server.
- **`npm run build`**: Builds the application for production.
- **`npm run lint`**: Runs Next.js linting checks.
- **`npx prisma generate`**: Generates the Prisma client (runs automatically on `postinstall`).
- **`npx prisma migrate dev`**: Creates and applies database migrations.
- **`npx prisma db push`**: Pushes the schema to the database without migrations (use for rapid prototyping).

## Coding Style & Naming Conventions
- **TypeScript**: Strict mode is enabled. Use interfaces for data structures and types for unions/literals.
- **Styling**: Uses Tailwind CSS 4 with `shadcn/ui` components. Avoid inline styles; prefer utility classes.
- **AI Integration**: AI logic is abstracted behind `lib\ai\provider.ts` using the Vercel AI SDK. Use `google` provider for Gemini models.
- **UI States**: Follow §8 of `.\FOLLOWTHIS.md` for tool-call status UI (inline status pills, not chat dumps).

## Testing Guidelines
The project currently lacks a formal automated testing suite. Manual testing steps for authentication are documented in `.\docs\auth-test.md`.

## Commit & Pull Request Guidelines
Follow conventional commits with optional scope in parentheses:
- `feat(scope): ...` (e.g., `feat(dashboard): implement search`)
- `fix(scope): ...`
- `refactor(scope): ...`
- `style(ui): ...`
- `docs: ...`
- `chore: ...`

## Agent Instructions
**Single Source of Truth**: `.\FOLLOWTHIS.md` is the primary rebuild specification. ALWAYS read it before implementing major features or refactors. 
- Pivot codegen target to HTML-first (single-file HTML/CSS/JS).
- Maintain AI context using the Skills system in `.\skills`.
- Ensure COOP/COEP headers are set for WebContainer functionality.
