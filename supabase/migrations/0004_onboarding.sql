alter table public.profiles
  add column if not exists onboarding_completed_at timestamptz;

update public.profiles p
set onboarding_completed_at = now()
where p.onboarding_completed_at is null
  and exists (select 1 from public.agents a where a.user_id = p.user_id);
