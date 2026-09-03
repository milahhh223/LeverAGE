# LeverAGE — Phase 3 (in progress)

> The market is real. The capital is virtual.

Phase 1 established the foundation. Phase 2 added real, persisted agent
creation. Phase 3 adds the agent evaluation foundation: users can run a
real, deterministic evaluation of their agent's strategy against a
controlled sample dataset, with every decision and portfolio snapshot
persisted to Supabase. It intentionally does **not** yet implement
portfolios, live/real market data, or the Arena. Those remain later
phases; see `docs/database-architecture.md` for how they're expected to
build on this.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS, token-driven (see `src/app/globals.css` and `tailwind.config.ts`)
- Supabase (Auth + Postgres + Row Level Security)
- Zod + React Hook Form
- Framer Motion (animation infrastructure only — primitives, not a full cinematic system yet)
- Lucide React (icons)

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your Supabase project URL + anon key
npm run dev
```

The app fails fast with a clear message if `.env.local` is missing or
malformed — see `src/lib/env.ts`.

### Database

Apply the migrations to your Supabase project:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

This creates `public.profiles` (with a trigger that provisions a profile
automatically on sign-up), `public.agents`, and the Phase 3 evaluation
tables (`public.evaluations`, `public.evaluation_decisions`,
`public.evaluation_snapshots`) — all with Row Level Security enabled.
See `supabase/migrations/` and `docs/database-architecture.md`.

**Note:** if you're applying these manually via the Supabase SQL Editor
rather than the CLI, run the migration files in order (`0001` → `0002`
→ `0003`) — later ones depend on functions/tables the earlier ones
create.

## Project structure

```
src/
├── app/              route segments: (marketing), (auth), (app), api/
├── components/       ui/ (primitives), layout/ (shell), shared/ (logo, motion)
├── features/         auth/ (implemented), agents/ (implemented),
│                     evaluations/ (implemented — deterministic engine +
│                     persistence), portfolio|arena (planned — README only)
├── lib/              supabase clients, env validation, utils, constants
├── config/           site.ts, navigation.ts
└── middleware.ts     session refresh + route protection
```

`features/*` is where business logic, schemas, and services live —
kept out of page components so later phases can extend a feature
without touching routing or layout.

## What's real vs. controlled-sample vs. placeholder

Real and working: sign-up, sign-in, sign-out, session-protected routes,
profile read/update (Settings page), the full design system and
component library, **agent creation** (persisted to `public.agents`,
owned and RLS-scoped per user), and **agent evaluation** — starting an
evaluation runs a real, deterministic strategy engine
(`src/features/evaluations/engine.ts`) and persists every decision and
portfolio snapshot to Supabase (`evaluations`, `evaluation_decisions`,
`evaluation_snapshots`), all owned and RLS-scoped per user.

Controlled sample, not live: evaluations run against a fixed,
hand-authored SOL price dataset (`src/features/evaluations/dataset.ts`),
not live market data — clearly labeled as a "Sample dataset" wherever
it's shown. The strategies themselves are simple, explainable
deterministic rules, not a claim of profitability.

Intentionally empty: Portfolio and Arena pages show honest empty
states — no fake data, no working buttons that lead nowhere. The
Dashboard and Agents list reflect your real saved agents and their real
latest evaluation status (or a real empty state if you have none).

## Scripts

```bash
npm run dev         # start dev server
npm run build        # production build
npm run lint          # eslint
npm run typecheck   # tsc --noEmit
```
