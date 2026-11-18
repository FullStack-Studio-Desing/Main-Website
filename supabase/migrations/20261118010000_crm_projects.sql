-- CRM projects + global payment helpers for the admin backend.
-- Safe to run again: objects are created only if missing, policies are replaced.

create table if not exists public.projects (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 140),
  description text check (description is null or char_length(description) <= 4000),
  status text not null default 'active'
    check (status in ('planning', 'active', 'paused', 'completed', 'cancelled')),
  started_on date,
  due_on date,
  budget numeric(12, 2) check (budget is null or budget >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  notes text check (notes is null or char_length(notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_client_created_idx
  on public.projects (client_id, created_at desc);

create index if not exists projects_status_idx
  on public.projects (status);

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_updated_at();

alter table public.projects enable row level security;

revoke all on table public.projects from anon;
grant select, insert, update, delete on table public.projects to authenticated;

drop policy if exists "admins read projects" on public.projects;
drop policy if exists "admins insert projects" on public.projects;
drop policy if exists "admins update projects" on public.projects;
drop policy if exists "admins delete projects" on public.projects;
drop policy if exists "clients read own projects" on public.projects;

create policy "admins read projects" on public.projects
  for select to authenticated using (public.is_admin());
create policy "admins insert projects" on public.projects
  for insert to authenticated with check (public.is_admin());
create policy "admins update projects" on public.projects
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete projects" on public.projects
  for delete to authenticated using (public.is_admin());
create policy "clients read own projects" on public.projects
  for select to authenticated using (client_id = public.current_client_id());
