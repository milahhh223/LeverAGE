# LeverAGE — Database Architecture

This document describes what's actually implemented, and how future
phases are expected to extend it. Sections below the "implemented" ones
are planning documentation, not a schema for tables that exist yet —
`profiles`, `agents`, `evaluations`, `evaluation_decisions`, and
`evaluation_snapshots` are the only tables that exist today.

## Phase 1: implemented

```
auth.users (managed by Supabase Auth)
  └── public.profiles        (1:1, created automatically on sign-up)
```

**`profiles`**
| column        | type        | notes                                   |
|----------------|-------------|------------------------------------------|
| id             | uuid PK     | row identifier                            |
| user_id        | uuid unique | references auth.users(id), cascade delete |
| display_name   | text        | nullable                                  |
| avatar_url     | text        | nullable                                  |
| created_at     | timestamptz | default now()                             |
| updated_at     | timestamptz | kept current by trigger                   |

Row Level Security is enabled. A user may `select`/`update` only the row
where `user_id = auth.uid()`. There is no client-facing insert or delete
policy — rows are created only by the `handle_new_user()` trigger
(`security definer`) on `auth.users` insert, and removed only via the
`on delete cascade` from `auth.users`.

See `supabase/migrations/0001_init.sql` for the exact SQL.

## Phase 2: implemented

```
auth.users (managed by Supabase Auth)
  └── public.agents           (1:many, created explicitly by the user
                                through the "Create agent" flow)
```

**`agents`**
| column              | type        | notes                                                    |
|---------------------|-------------|-----------------------------------------------------------|
| id                  | uuid PK     | row identifier                                             |
| user_id             | uuid        | references auth.users(id), cascade delete                 |
| name                | text        | 2–40 chars                                                 |
| strategy            | text        | check-constrained enum, see `constants.ts`                |
| market_focus        | text        | check-constrained enum, see `constants.ts`                |
| risk_profile        | text        | check-constrained enum, see `constants.ts`                |
| max_allocation_pct  | smallint    | 1–100, default 25                                          |
| status              | text        | only `'configured'` today — no execution engine exists yet |
| created_at          | timestamptz | default now()                                              |
| updated_at          | timestamptz | kept current by trigger                                    |

Row Level Security is enabled. A user may `select`/`insert`/`update`
only rows where `user_id = auth.uid()`. There is no delete policy yet —
archiving/deleting agents is a follow-up (tracked as a future migration,
not implemented in Phase 2).

An `agents` row is real, user-owned configuration data. It does **not**
represent a running trading engine by itself — as of Phase 3, an
agent's actual performance comes from real, persisted evaluation runs
(see below), not from generated placeholder data. Phase 2's illustrative
`simulated-performance.ts` generator has been removed.

See `supabase/migrations/0002_agents.sql` for the exact SQL.

## Phase 3: implemented

```
public.agents
  └── public.evaluations             (1:many — one row per evaluation run)
        ├── public.evaluation_decisions   (1:many, immutable)
        └── public.evaluation_snapshots   (1:many, immutable)
```

**`evaluations`**
| column             | type        | notes                                                        |
|--------------------|-------------|----------------------------------------------------------------|
| id                 | uuid PK     | row identifier                                                  |
| agent_id           | uuid        | references agents(id), cascade delete                          |
| user_id            | uuid        | references auth.users(id), cascade delete — denormalized for RLS |
| market             | text        | only `'sol'` today                                              |
| dataset_id         | text        | which controlled dataset was used, e.g. `sol_sample_v1`         |
| starting_capital   | numeric     | virtual capital the run started with                            |
| current_capital    | numeric     | realized capital at completion                                  |
| status             | text        | `created` \| `running` \| `completed` \| `failed`               |
| started_at         | timestamptz | nullable                                                         |
| completed_at       | timestamptz | nullable                                                         |
| created_at         | timestamptz | default now()                                                    |
| updated_at         | timestamptz | kept current by trigger                                         |

**`evaluation_decisions`** — one row per step the deterministic engine
evaluated: `sequence`, `market_price`, `observation`, `reasoning`,
`action` (`LONG`/`SHORT`/`HOLD`/`EXIT`), `confidence`, `allocation_pct`.
Immutable — insert/select only, no update or delete policy.

**`evaluation_snapshots`** — one row per step's mark-to-market portfolio
state: `sequence`, `portfolio_value`, `return_pct`, `drawdown_pct`.
Also immutable.

Row Level Security on all three tables follows the same pattern as
`agents`: a user may `select` only rows where `user_id = auth.uid()`;
`evaluations` additionally allows `insert`/`update` (to create a run and
mark it completed/failed) scoped the same way; decisions and snapshots
only allow `insert` (they're written once, in full, by the run that
created them, and never modified after).

**No `positions` table.** With a single market and a single open
position at a time, position state (entry price, side, realized P&L) is
fully derivable by scanning `evaluation_decisions` in sequence order — a
`LONG`/`SHORT` opens, the next `EXIT` closes it, and the win/loss for
that trade is derivable from the portfolio value change across that one
step in `evaluation_snapshots`. Revisit this decision if the engine ever
needs to hold multiple concurrent positions or trade multiple markets
within one evaluation — at that point the sequence-scanning approach
stops being sufficient and a dedicated table earns its complexity.

**The dataset is controlled, not live.** `src/features/evaluations/dataset.ts`
holds a fixed, hand-authored 30-point SOL price series with no
randomness — the same agent configuration run against it always
produces the exact same decisions and results. This is deliberate: it's
what makes an evaluation reproducible and comparable. When a real
market data source is integrated, it should be added as a new
`dataset_id` rather than replacing this one, so historical evaluations
stay reproducible against what they actually ran against.

**The strategy engine** (`src/features/evaluations/engine.ts`) is simple,
explainable, deterministic rule-based logic per strategy (momentum /
mean-reversion / trend-following / hybrid) — not a claim that any of
these are profitable. An agent's `risk_profile` genuinely changes
behavior: `conservative` requires a larger price move before acting and
sizes positions at half the agent's max allocation; `aggressive` acts on
smaller moves and uses the full max allocation. This was verified by
running all 12 strategy × risk-profile combinations against the sample
dataset and confirming results differ meaningfully across all of them,
allocation never exceeds the agent's configured max, and identical
inputs always produce identical outputs.

See `supabase/migrations/0003_evaluations.sql` for the exact SQL.

## Planned: future phases

The relationships below are conceptual — they describe intent, not a
schema to migrate today. Each will be implemented alongside the backend
logic that actually needs it, in the phase that builds that feature.

```
USER
 ├── PROFILE                 (Phase 1 — done)
 ├── AGENTS                  (Phase 2 — done, configuration only)
 │    └── EVALUATIONS        (Phase 3 — done: real, persisted runs
 │                            against a controlled dataset)
 └── PORTFOLIOS              (future)

PORTFOLIO
 ├── belongs to USER
 └── POSITIONS               (current/historical holdings — likely an
                              aggregate view across an agent's evaluations
                              and/or live runs, not yet designed)

COMPETITION
 └── PARTICIPANTS            (an Arena competition instance)

PARTICIPANT
 └── refers to an AGENT (and, eventually, possibly a human trader)
```

### Design intentions for later phases

- **Evaluations** are scoped to one controlled dataset today. Live or
  historical-real-market evaluations should reuse the same
  `evaluations`/`evaluation_decisions`/`evaluation_snapshots` shape with
  a different `dataset_id`/market — the schema doesn't need to change,
  only what produces the rows.
- **Portfolios** are a future aggregation layer — likely a rollup across
  an agent's evaluations rather than a fourth place trades get written.
  Undecided until that phase is underway.
- **Competitions** reference participants generically so a Participant
  can eventually be either an agent or (later) a human trader, without
  reshaping the Competition table itself. An Arena competition will most
  likely compare agents by their evaluation results, not introduce a
  parallel scoring system.
- All future tables will follow the same RLS posture as `profiles`/`agents`/
  `evaluations`: owner-scoped access by default, with any cross-user
  visibility (e.g. leaderboards, Arena results) implemented as an
  explicit, intentional policy or view — never by disabling RLS.

## Migration workflow

Migrations live in `supabase/migrations/`, applied in filename order.
Once the Supabase CLI is linked to a project:

```bash
supabase migration new <name>     # create a new migration file
supabase db push                  # apply pending migrations
supabase gen types typescript --local > src/types/database.ts
```

`src/types/database.ts` is currently hand-written to match
`0001_init.sql`, `0002_agents.sql`, and `0003_evaluations.sql` exactly.
Regenerate it with the command above after any migration so the two
never drift.
