-- FullStack Studio client portal.
-- Run this once in the Supabase SQL editor (Project → SQL → New query).
-- Safe to run again: objects are created only if they are missing, and policies are replaced.
--
-- After it succeeds:
-- 1. Authentication → Providers → Email stays on.
-- 2. Authentication → Settings → turn off public sign-ups. The studio creates every login.
-- 3. Authentication → Users → Add user for yourself, with Auto Confirm on.
-- 4. Put that email in PORTAL_ADMIN_EMAILS. The app promotes it on sign-in
--    when SUPABASE_SERVICE_ROLE_KEY is set. Or run:
--    update public.profiles set role = 'admin' where email = 'you@yourstudio.com';

create extension if not exists pgcrypto with schema extensions;

create table if not exists public.clients (
  id uuid primary key default extensions.gen_random_uuid(),
  company_name text not null check (char_length(btrim(company_name)) between 1 and 120),
  contact_name text not null check (char_length(btrim(contact_name)) between 1 and 120),
  email text not null check (email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'),
  phone text check (phone is null or char_length(phone) <= 40),
  status text not null default 'active' check (status in ('active', 'paused', 'archived')),
  plan_id text not null default 'starter' check (plan_id in ('starter', 'growth', 'scale', 'custom')),
  plan_name text not null check (char_length(btrim(plan_name)) between 1 and 80),
  monthly_amount numeric(12, 2) not null check (monthly_amount >= 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  billing_notes text check (billing_notes is null or char_length(billing_notes) <= 4000),
  started_on date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null default '',
  full_name text,
  role text not null default 'client' check (role in ('admin', 'client')),
  client_id uuid references public.clients (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  status text not null default 'pending' check (status in ('paid', 'pending', 'failed', 'refunded')),
  paid_on date,
  period_label text check (period_label is null or char_length(period_label) <= 80),
  method text check (method is null or char_length(method) <= 40),
  reference text check (reference is null or char_length(reference) <= 120),
  notes text check (notes is null or char_length(notes) <= 4000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.reports (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  title text not null check (char_length(btrim(title)) between 1 and 140),
  period_label text not null check (char_length(btrim(period_label)) between 1 and 80),
  summary text check (summary is null or char_length(summary) <= 8000),
  traffic text check (traffic is null or char_length(traffic) <= 8000),
  campaigns text check (campaigns is null or char_length(campaigns) <= 8000),
  pipeline text check (pipeline is null or char_length(pipeline) <= 8000),
  actions text check (actions is null or char_length(actions) <= 8000),
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists profiles_email_key
  on public.profiles (lower(email))
  where email <> '';

create unique index if not exists profiles_one_login_per_client
  on public.profiles (client_id)
  where client_id is not null and role = 'client';

create index if not exists payments_client_created_idx
  on public.payments (client_id, created_at desc);

create index if not exists reports_client_created_idx
  on public.reports (client_id, created_at desc);

create index if not exists profiles_client_id_idx
  on public.profiles (client_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    coalesce(new.email, ''),
    nullif(new.raw_user_meta_data ->> 'full_name', ''),
    'client'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- security definer so the policies below can read profiles without recursing through RLS.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.current_client_id()
returns uuid
language sql
stable
security definer
set search_path = ''
as $$
  select client_id
  from public.profiles
  where id = auth.uid();
$$;

revoke all on function public.set_updated_at() from public, anon, authenticated;
revoke all on function public.handle_new_user() from public, anon, authenticated;
revoke all on function public.is_admin() from public, anon, authenticated;
revoke all on function public.current_client_id() from public, anon, authenticated;
grant execute on function public.is_admin() to authenticated;
grant execute on function public.current_client_id() to authenticated;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists clients_set_updated_at on public.clients;
create trigger clients_set_updated_at
  before update on public.clients
  for each row execute function public.set_updated_at();

drop trigger if exists payments_set_updated_at on public.payments;
create trigger payments_set_updated_at
  before update on public.payments
  for each row execute function public.set_updated_at();

drop trigger if exists reports_set_updated_at on public.reports;
create trigger reports_set_updated_at
  before update on public.reports
  for each row execute function public.set_updated_at();

alter table public.clients enable row level security;
alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.reports enable row level security;

revoke all on table public.clients from anon;
revoke all on table public.profiles from anon;
revoke all on table public.payments from anon;
revoke all on table public.reports from anon;

grant select, insert, update, delete on table public.clients to authenticated;
grant select, insert, update, delete on table public.payments to authenticated;
grant select, insert, update, delete on table public.reports to authenticated;
grant select on table public.profiles to authenticated;

drop policy if exists "admins read clients" on public.clients;
drop policy if exists "admins insert clients" on public.clients;
drop policy if exists "admins update clients" on public.clients;
drop policy if exists "admins delete clients" on public.clients;
drop policy if exists "clients read own record" on public.clients;
create policy "admins read clients" on public.clients for select to authenticated using (public.is_admin());
create policy "admins insert clients" on public.clients for insert to authenticated with check (public.is_admin());
create policy "admins update clients" on public.clients for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete clients" on public.clients for delete to authenticated using (public.is_admin());
create policy "clients read own record" on public.clients for select to authenticated using (id = public.current_client_id());

drop policy if exists "read own profile or admin" on public.profiles;
create policy "read own profile or admin" on public.profiles for select to authenticated using (id = auth.uid() or public.is_admin());

drop policy if exists "admins read payments" on public.payments;
drop policy if exists "admins insert payments" on public.payments;
drop policy if exists "admins update payments" on public.payments;
drop policy if exists "admins delete payments" on public.payments;
drop policy if exists "clients read own payments" on public.payments;
create policy "admins read payments" on public.payments for select to authenticated using (public.is_admin());
create policy "admins insert payments" on public.payments for insert to authenticated with check (public.is_admin());
create policy "admins update payments" on public.payments for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete payments" on public.payments for delete to authenticated using (public.is_admin());
create policy "clients read own payments" on public.payments for select to authenticated using (client_id = public.current_client_id());

drop policy if exists "admins read reports" on public.reports;
drop policy if exists "admins insert reports" on public.reports;
drop policy if exists "admins update reports" on public.reports;
drop policy if exists "admins delete reports" on public.reports;
drop policy if exists "clients read published reports" on public.reports;
create policy "admins read reports" on public.reports for select to authenticated using (public.is_admin());
create policy "admins insert reports" on public.reports for insert to authenticated with check (public.is_admin());
create policy "admins update reports" on public.reports for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete reports" on public.reports for delete to authenticated using (public.is_admin());
create policy "clients read published reports" on public.reports
  for select to authenticated
  using (client_id = public.current_client_id() and status = 'published');
