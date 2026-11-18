-- CRM billing: Mercado Pago customers, cards on file, and invoices.
-- Safe to run again: objects are created only if missing, policies are replaced.
-- Also ensures projects exist if the previous CRM migration was not applied yet.

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

alter table public.clients
  add column if not exists mp_customer_id text,
  add column if not exists tax_id_type text
    check (tax_id_type is null or tax_id_type in ('RFC', 'CURP')),
  add column if not exists tax_id_number text
    check (tax_id_number is null or char_length(tax_id_number) <= 40);

create unique index if not exists clients_mp_customer_id_key
  on public.clients (mp_customer_id)
  where mp_customer_id is not null;

create table if not exists public.payment_methods (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  mp_customer_id text not null,
  mp_card_id text not null,
  brand text check (brand is null or char_length(brand) <= 40),
  last_four text check (last_four is null or char_length(last_four) = 4),
  exp_month integer check (exp_month is null or exp_month between 1 and 12),
  exp_year integer check (exp_year is null or exp_year between 2000 and 2100),
  holder_name text check (holder_name is null or char_length(holder_name) <= 120),
  is_default boolean not null default false,
  status text not null default 'active' check (status in ('active', 'removed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (client_id, mp_card_id)
);

create index if not exists payment_methods_client_idx
  on public.payment_methods (client_id, created_at desc)
  where status = 'active';

drop trigger if exists payment_methods_set_updated_at on public.payment_methods;
create trigger payment_methods_set_updated_at
  before update on public.payment_methods
  for each row execute function public.set_updated_at();

alter table public.payment_methods enable row level security;
revoke all on table public.payment_methods from anon;
grant select, insert, update, delete on table public.payment_methods to authenticated;

drop policy if exists "admins read payment methods" on public.payment_methods;
drop policy if exists "admins insert payment methods" on public.payment_methods;
drop policy if exists "admins update payment methods" on public.payment_methods;
drop policy if exists "admins delete payment methods" on public.payment_methods;
drop policy if exists "clients read own payment methods" on public.payment_methods;
drop policy if exists "clients insert own payment methods" on public.payment_methods;
drop policy if exists "clients update own payment methods" on public.payment_methods;
create policy "admins read payment methods" on public.payment_methods
  for select to authenticated using (public.is_admin());
create policy "admins insert payment methods" on public.payment_methods
  for insert to authenticated with check (public.is_admin());
create policy "admins update payment methods" on public.payment_methods
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete payment methods" on public.payment_methods
  for delete to authenticated using (public.is_admin());
create policy "clients read own payment methods" on public.payment_methods
  for select to authenticated using (client_id = public.current_client_id());
create policy "clients insert own payment methods" on public.payment_methods
  for insert to authenticated with check (client_id = public.current_client_id());
create policy "clients update own payment methods" on public.payment_methods
  for update to authenticated
  using (client_id = public.current_client_id())
  with check (client_id = public.current_client_id());

create table if not exists public.invoices (
  id uuid primary key default extensions.gen_random_uuid(),
  client_id uuid not null references public.clients (id) on delete cascade,
  payment_method_id uuid references public.payment_methods (id) on delete set null,
  payment_id uuid references public.payments (id) on delete set null,
  number text not null check (char_length(btrim(number)) between 1 and 40),
  title text not null check (char_length(btrim(title)) between 1 and 140),
  description text check (description is null or char_length(description) <= 4000),
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  billing_type text not null default 'one_time'
    check (billing_type in ('one_time', 'recurring')),
  status text not null default 'draft'
    check (status in ('draft', 'sent', 'paid', 'failed', 'void')),
  period_label text check (period_label is null or char_length(period_label) <= 80),
  due_on date,
  next_charge_on date,
  mp_order_id text check (mp_order_id is null or char_length(mp_order_id) <= 120),
  sent_at timestamptz,
  paid_at timestamptz,
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists invoices_number_key on public.invoices (number);
create index if not exists invoices_client_created_idx
  on public.invoices (client_id, created_at desc);
create index if not exists invoices_status_idx on public.invoices (status);

drop trigger if exists invoices_set_updated_at on public.invoices;
create trigger invoices_set_updated_at
  before update on public.invoices
  for each row execute function public.set_updated_at();

alter table public.invoices enable row level security;
revoke all on table public.invoices from anon;
grant select, insert, update, delete on table public.invoices to authenticated;

drop policy if exists "admins read invoices" on public.invoices;
drop policy if exists "admins insert invoices" on public.invoices;
drop policy if exists "admins update invoices" on public.invoices;
drop policy if exists "admins delete invoices" on public.invoices;
drop policy if exists "clients read own invoices" on public.invoices;
create policy "admins read invoices" on public.invoices
  for select to authenticated using (public.is_admin());
create policy "admins insert invoices" on public.invoices
  for insert to authenticated with check (public.is_admin());
create policy "admins update invoices" on public.invoices
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete invoices" on public.invoices
  for delete to authenticated using (public.is_admin());
create policy "clients read own invoices" on public.invoices
  for select to authenticated
  using (
    client_id = public.current_client_id()
    and status in ('sent', 'paid', 'failed')
  );

alter table public.payments
  add column if not exists invoice_id uuid references public.invoices (id) on delete set null,
  add column if not exists mp_order_id text
    check (mp_order_id is null or char_length(mp_order_id) <= 120);

create index if not exists payments_invoice_id_idx
  on public.payments (invoice_id)
  where invoice_id is not null;
