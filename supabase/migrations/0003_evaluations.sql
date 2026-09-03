-- LeverAGE Phase 3: agent evaluation foundation
--
-- Introduces a controlled, deterministic evaluation lifecycle for agents:
-- an `evaluations` row represents one run of an agent against a fixed,
-- versioned sample dataset (see src/features/evaluations/dataset.ts).
-- Every decision the deterministic strategy engine makes, and every
-- portfolio snapshot along the way, is persisted — never derived only
-- from frontend state.
--
-- No `positions` table yet: with a single market and a single open
-- position at a time, position state is fully derivable by scanning
-- evaluation_decisions in sequence order (LONG/SHORT opens, EXIT closes).
-- See docs/database-architecture.md for the reasoning and the trigger
-- condition for revisiting this.

create table if not exists public.evaluations (
  id uuid primary key default gen_random_uuid(),
  agent_id uuid not null references public.agents (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  market text not null check (market in ('sol')),
  dataset_id text not null,

  starting_capital numeric(14, 2) not null default 10000,
  current_capital numeric(14, 2) not null default 10000,

  status text not null default 'created' check (
    status in ('created', 'running', 'completed', 'failed')
  ),

  started_at timestamptz,
  completed_at timestamptz,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists evaluations_agent_id_idx on public.evaluations (agent_id);
create index if not exists evaluations_user_id_idx on public.evaluations (user_id);

drop trigger if exists set_evaluations_updated_at on public.evaluations;
create trigger set_evaluations_updated_at
  before update on public.evaluations
  for each row
  execute function public.set_updated_at();

alter table public.evaluations enable row level security;

drop policy if exists "Users can view own evaluations" on public.evaluations;
create policy "Users can view own evaluations"
  on public.evaluations for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own evaluations" on public.evaluations;
create policy "Users can create own evaluations"
  on public.evaluations for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own evaluations" on public.evaluations;
create policy "Users can update own evaluations"
  on public.evaluations for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ---------------------------------------------------------------------

create table if not exists public.evaluation_decisions (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.evaluations (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  sequence integer not null,
  market_price numeric(14, 4) not null,

  observation text not null,
  reasoning text not null,

  action text not null check (action in ('LONG', 'SHORT', 'HOLD', 'EXIT')),
  confidence numeric(4, 3) not null check (confidence between 0 and 1),
  allocation_pct smallint not null check (allocation_pct between 0 and 100),

  created_at timestamptz not null default now(),

  constraint evaluation_decisions_sequence_unique unique (evaluation_id, sequence)
);

create index if not exists evaluation_decisions_evaluation_id_idx
  on public.evaluation_decisions (evaluation_id);
create index if not exists evaluation_decisions_user_id_idx
  on public.evaluation_decisions (user_id);

alter table public.evaluation_decisions enable row level security;

drop policy if exists "Users can view own decisions" on public.evaluation_decisions;
create policy "Users can view own decisions"
  on public.evaluation_decisions for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own decisions" on public.evaluation_decisions;
create policy "Users can create own decisions"
  on public.evaluation_decisions for insert
  with check (auth.uid() = user_id);

-- Decisions are an immutable audit trail: no update/delete policy.

-- ---------------------------------------------------------------------

create table if not exists public.evaluation_snapshots (
  id uuid primary key default gen_random_uuid(),
  evaluation_id uuid not null references public.evaluations (id) on delete cascade,
  agent_id uuid not null references public.agents (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,

  sequence integer not null,
  portfolio_value numeric(14, 2) not null,
  return_pct numeric(7, 3) not null,
  drawdown_pct numeric(7, 3) not null,

  created_at timestamptz not null default now(),

  constraint evaluation_snapshots_sequence_unique unique (evaluation_id, sequence)
);

create index if not exists evaluation_snapshots_evaluation_id_idx
  on public.evaluation_snapshots (evaluation_id);
create index if not exists evaluation_snapshots_user_id_idx
  on public.evaluation_snapshots (user_id);

alter table public.evaluation_snapshots enable row level security;

drop policy if exists "Users can view own snapshots" on public.evaluation_snapshots;
create policy "Users can view own snapshots"
  on public.evaluation_snapshots for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own snapshots" on public.evaluation_snapshots;
create policy "Users can create own snapshots"
  on public.evaluation_snapshots for insert
  with check (auth.uid() = user_id);

-- Snapshots are an immutable audit trail: no update/delete policy.
