-- LeverAGE Phase 2: agents foundation
-- Creates the `agents` table, indexes, RLS policies, and the updated_at
-- trigger (reusing public.set_updated_at() from 0001_init.sql).
--
-- An agent row represents a user-configured simulated trading agent:
-- identity, strategy, market focus, and risk configuration. It does NOT
-- represent a live trading engine — decisions, performance, and trade
-- history are simulated in the application layer until that engine
-- exists (see docs/database-architecture.md).

create table if not exists public.agents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,

  name text not null check (char_length(name) between 2 and 40),

  -- Enumerated as text (not a Postgres enum) so future strategies/focuses
  -- can be added with a simple check-constraint migration rather than an
  -- enum-type migration. Keep in sync with
  -- src/features/agents/constants.ts.
  strategy text not null check (
    strategy in ('momentum', 'mean_reversion', 'hybrid', 'trend_following')
  ),
  market_focus text not null check (
    market_focus in ('sol', 'ansem', 'general')
  ),
  risk_profile text not null check (
    risk_profile in ('conservative', 'balanced', 'aggressive')
  ),
  max_allocation_pct smallint not null default 25 check (
    max_allocation_pct between 1 and 100
  ),

  -- 'configured' is the only real status today: the agent exists and is
  -- set up, but there is no live/simulated execution engine running it
  -- yet. Future phases can extend this constraint (e.g. 'simulating',
  -- 'archived') via an additive migration.
  status text not null default 'configured' check (status in ('configured')),

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists agents_user_id_idx on public.agents (user_id);

drop trigger if exists set_agents_updated_at on public.agents;
create trigger set_agents_updated_at
  before update on public.agents
  for each row
  execute function public.set_updated_at();

-- Row Level Security: a user may only read/create/update their own agents.
alter table public.agents enable row level security;

drop policy if exists "Users can view own agents" on public.agents;
create policy "Users can view own agents"
  on public.agents for select
  using (auth.uid() = user_id);

drop policy if exists "Users can create own agents" on public.agents;
create policy "Users can create own agents"
  on public.agents for insert
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own agents" on public.agents;
create policy "Users can update own agents"
  on public.agents for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- No delete policy yet: deleting/archiving agents is a Phase 2 follow-up
-- (see docs/database-architecture.md). Direct client deletes are denied
-- by default under RLS until that policy is added.
