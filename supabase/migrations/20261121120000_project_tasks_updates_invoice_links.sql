-- Project tasks + project updates, and public pay links for invoices.
-- Safe to run again: objects are created only if missing, policies are replaced.

-- Tasks -----------------------------------------------------------------------

create table if not exists public.project_tasks (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 200),
  details text check (details is null or char_length(details) <= 4000),
  status text not null default 'todo'
    check (status in ('todo', 'in_progress', 'blocked', 'done')),
  priority text not null default 'normal'
    check (priority in ('low', 'normal', 'high', 'urgent')),
  due_on date,
  completed_at timestamptz,
  sort_order integer not null default 0,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_tasks_project_idx
  on public.project_tasks (project_id, status, sort_order, created_at);

create index if not exists project_tasks_open_due_idx
  on public.project_tasks (due_on)
  where status <> 'done';

drop trigger if exists project_tasks_set_updated_at on public.project_tasks;
create trigger project_tasks_set_updated_at
  before update on public.project_tasks
  for each row execute function public.set_updated_at();

alter table public.project_tasks enable row level security;
revoke all on table public.project_tasks from anon;
grant select, insert, update, delete on table public.project_tasks to authenticated;

drop policy if exists "admins read project tasks" on public.project_tasks;
drop policy if exists "admins insert project tasks" on public.project_tasks;
drop policy if exists "admins update project tasks" on public.project_tasks;
drop policy if exists "admins delete project tasks" on public.project_tasks;
drop policy if exists "clients read own project tasks" on public.project_tasks;
create policy "admins read project tasks" on public.project_tasks
  for select to authenticated using (public.is_admin());
create policy "admins insert project tasks" on public.project_tasks
  for insert to authenticated with check (public.is_admin());
create policy "admins update project tasks" on public.project_tasks
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete project tasks" on public.project_tasks
  for delete to authenticated using (public.is_admin());
create policy "clients read own project tasks" on public.project_tasks
  for select to authenticated using (client_id = public.current_client_id());

-- Updates (activity log) ------------------------------------------------------

create table if not exists public.project_updates (
  id uuid primary key default extensions.gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  kind text not null default 'note'
    check (kind in ('note', 'milestone', 'blocker', 'delivery')),
  body text not null check (char_length(btrim(body)) between 1 and 8000),
  visible_to_client boolean not null default false,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists project_updates_project_idx
  on public.project_updates (project_id, created_at desc);

drop trigger if exists project_updates_set_updated_at on public.project_updates;
create trigger project_updates_set_updated_at
  before update on public.project_updates
  for each row execute function public.set_updated_at();

alter table public.project_updates enable row level security;
revoke all on table public.project_updates from anon;
grant select, insert, update, delete on table public.project_updates to authenticated;

drop policy if exists "admins read project updates" on public.project_updates;
drop policy if exists "admins insert project updates" on public.project_updates;
drop policy if exists "admins update project updates" on public.project_updates;
drop policy if exists "admins delete project updates" on public.project_updates;
drop policy if exists "clients read visible project updates" on public.project_updates;
create policy "admins read project updates" on public.project_updates
  for select to authenticated using (public.is_admin());
create policy "admins insert project updates" on public.project_updates
  for insert to authenticated with check (public.is_admin());
create policy "admins update project updates" on public.project_updates
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete project updates" on public.project_updates
  for delete to authenticated using (public.is_admin());
create policy "clients read visible project updates" on public.project_updates
  for select to authenticated
  using (client_id = public.current_client_id() and visible_to_client);

-- Invoices: optional project link + unguessable public pay token ---------------

alter table public.invoices
  add column if not exists project_id uuid references public.projects (id) on delete set null,
  add column if not exists public_token text;

update public.invoices
  set public_token = encode(extensions.gen_random_bytes(18), 'hex')
  where public_token is null;

alter table public.invoices
  alter column public_token set default encode(extensions.gen_random_bytes(18), 'hex'),
  alter column public_token set not null;

create unique index if not exists invoices_public_token_key
  on public.invoices (public_token);

create index if not exists invoices_project_idx
  on public.invoices (project_id)
  where project_id is not null;

-- Payments: optional project link so money can be tracked per project.
alter table public.payments
  add column if not exists project_id uuid references public.projects (id) on delete set null;

create index if not exists payments_project_idx
  on public.payments (project_id)
  where project_id is not null;

-- Public pay page reads invoices by token through the service role on the server,
-- so no anon policies are added here.

-- One ledger row per Mercado Pago order, so the pay route and the webhook
-- cannot both insert a payment for the same order.
create unique index if not exists payments_mp_order_id_key
  on public.payments (mp_order_id)
  where mp_order_id is not null;
