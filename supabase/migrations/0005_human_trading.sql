-- LeverAGE: human trading sessions
--
-- Extends the existing evaluations/evaluation_decisions/evaluation_snapshots
-- tables to support a second kind of evaluation: a human manually trading
-- against the same real historical dataset an agent evaluates against,
-- using the same $10,000 starting capital and the exact same portfolio
-- math (see src/features/evaluations/portfolio-math.ts). This is what
-- makes a human session and an agent evaluation directly comparable on
-- the same chart.
--
-- Rather than a parallel set of tables, `evaluations` gains a `mode`
-- column: 'agent' (the existing behavior, unchanged) or 'human' (new).
-- A human evaluation has no agent_id and is driven by a person clicking
-- through one decision at a time instead of the engine running once,
-- synchronously, to completion — so it needs a bit of persisted
-- in-progress state (current_sequence, the open position, if any) that
-- an agent evaluation never needed, since an agent evaluation is never
-- observed mid-run.

alter table public.evaluations
  alter column agent_id drop not null;

alter table public.evaluations
  add column if not exists mode text not null default 'agent' check (mode in ('agent', 'human')),
  add column if not exists label text,
  add column if not exists current_sequence integer not null default 0,
  add column if not exists position_side text check (position_side in ('LONG', 'SHORT')),
  add column if not exists position_entry_price numeric(14, 4),
  add column if not exists position_allocation_pct smallint,
  add column if not exists position_allocation_value numeric(14, 2),
  add column if not exists peak_value numeric(14, 2) not null default 10000;

-- An agent evaluation must have an agent; a human session must not
-- (there's no agent to attribute the decisions to — a person made them).
alter table public.evaluations
  drop constraint if exists evaluations_mode_agent_check;
alter table public.evaluations
  add constraint evaluations_mode_agent_check
  check ((mode = 'agent' and agent_id is not null) or (mode = 'human' and agent_id is null));

alter table public.evaluation_decisions
  alter column agent_id drop not null;

alter table public.evaluation_snapshots
  alter column agent_id drop not null;

-- No RLS changes needed: every policy on these three tables already
-- keys off `auth.uid() = user_id`, which is unaffected by agent_id
-- becoming nullable.
