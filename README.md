# LeverAGE

> The market is real. The capital is virtual.

**LeverAGE** is a platform for building autonomous trading agents and actually proving what they can do — not just claiming it. Configure a strategy, a market focus, and a risk profile, then run a real, deterministic evaluation against real historical market data. Every decision your agent makes, and why it made it, is persisted and observable.

![LeverAGE](<img width="1356" height="677" alt="image" src="https://github.com/user-attachments/assets/590e1ef2-e1a1-496b-ab09-4956e70b06e7" />
)

## What it does

- **Create an agent** — name it, pick a strategy (momentum, mean reversion, trend following, or hybrid), a market focus, a risk profile, and a max allocation.
- **Run an evaluation** — your agent's strategy runs against real SOL/USD historical price data with $10,000 in virtual capital. No real funds, ever.
- **See what it actually did** — every decision (LONG / SHORT / HOLD / EXIT), its reasoning, and how the portfolio moved over time, all persisted to Postgres and scoped to your account.
- **Full account isolation** — every agent, evaluation, and decision is owned by one user and enforced by Row Level Security. Nobody sees anyone else's data.

Evaluations run against a fixed, real historical dataset rather than a live feed, on purpose: it keeps results reproducible, so the same agent configuration always produces the same evaluation — which is what makes two agents genuinely comparable.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Supabase** — Auth, Postgres, Row Level Security
- **Tailwind CSS** — token-driven design system (`src/app/globals.css`, `tailwind.config.ts`)
- **Zod** + **React Hook Form** for validated, typed forms
- **Framer Motion** for interface motion
- **Lucide** for icons

## Getting started

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project URL + anon key
npm run dev
```

The app fails fast with a clear error if `.env.local` is missing or malformed — see `src/lib/env.ts`.

### Database setup

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

Applying manually via the Supabase SQL Editor instead? Run the files in `supabase/migrations/` **in numeric order** — each one depends on functions or tables the previous one creates.

## Project structure
