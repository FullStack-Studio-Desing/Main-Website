-- Company contact methods + people for client records.
-- Safe to run again: objects are created only if missing, policies are replaced.

create table if not exists public.client_contacts (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  kind text not null check (kind in ('email', 'phone')),
  value text not null check (char_length(btrim(value)) between 1 and 120),
  label text check (label is null or char_length(btrim(label)) between 1 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.client_people (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  name text not null check (char_length(btrim(name)) between 1 and 120),
  email text check (email is null or email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  role text not null check (char_length(btrim(role)) between 1 and 80),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists client_contacts_client_sort_idx
  on public.client_contacts (client_id, sort_order, created_at);

create index if not exists client_people_client_sort_idx
  on public.client_people (client_id, sort_order, created_at);

alter table public.client_contacts enable row level security;
alter table public.client_people enable row level security;

revoke all on table public.client_contacts from anon;
revoke all on table public.client_people from anon;
grant select, insert, update, delete on table public.client_contacts to authenticated;
grant select, insert, update, delete on table public.client_people to authenticated;

drop policy if exists "admins read client contacts" on public.client_contacts;
drop policy if exists "admins insert client contacts" on public.client_contacts;
drop policy if exists "admins update client contacts" on public.client_contacts;
drop policy if exists "admins delete client contacts" on public.client_contacts;
drop policy if exists "clients read own contacts" on public.client_contacts;

create policy "admins read client contacts" on public.client_contacts
  for select to authenticated using (public.is_admin());
create policy "admins insert client contacts" on public.client_contacts
  for insert to authenticated with check (public.is_admin());
create policy "admins update client contacts" on public.client_contacts
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete client contacts" on public.client_contacts
  for delete to authenticated using (public.is_admin());
create policy "clients read own contacts" on public.client_contacts
  for select to authenticated using (client_id = public.current_client_id());

drop policy if exists "admins read client people" on public.client_people;
drop policy if exists "admins insert client people" on public.client_people;
drop policy if exists "admins update client people" on public.client_people;
drop policy if exists "admins delete client people" on public.client_people;
drop policy if exists "clients read own people" on public.client_people;

create policy "admins read client people" on public.client_people
  for select to authenticated using (public.is_admin());
create policy "admins insert client people" on public.client_people
  for insert to authenticated with check (public.is_admin());
create policy "admins update client people" on public.client_people
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete client people" on public.client_people
  for delete to authenticated using (public.is_admin());
create policy "clients read own people" on public.client_people
  for select to authenticated using (client_id = public.current_client_id());
