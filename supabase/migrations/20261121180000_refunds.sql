-- Refunds: per-payment refunded totals, refund log, refunded invoice states.
-- Safe to run again: objects are created only if missing, constraints and policies are replaced.

-- Drop whatever check constraint currently guards a table's status column,
-- whatever name Postgres gave it, so it can be replaced with the wider list.
create or replace function pg_temp.drop_status_checks(target regclass)
returns void
language plpgsql
as $$
declare
  constraint_name text;
begin
  for constraint_name in
    select con.conname
    from pg_constraint con
    where con.conrelid = target
      and con.contype = 'c'
      and pg_get_constraintdef(con.oid) ilike '%status%'
      and pg_get_constraintdef(con.oid) not ilike '%refunded_amount%'
  loop
    execute format('alter table %s drop constraint %I', target, constraint_name);
  end loop;
end;
$$;

-- Payments: running refunded total + partial refund status ---------------------

alter table public.payments
  add column if not exists refunded_amount numeric(12, 2) not null default 0;

alter table public.payments drop constraint if exists payments_refunded_amount_check;
alter table public.payments
  add constraint payments_refunded_amount_check
  check (refunded_amount >= 0 and refunded_amount <= amount);

select pg_temp.drop_status_checks('public.payments');
alter table public.payments
  add constraint payments_status_check
  check (status in ('paid', 'pending', 'failed', 'refunded', 'partially_refunded'));

-- Invoices: refunded states --------------------------------------------------

select pg_temp.drop_status_checks('public.invoices');
alter table public.invoices
  add constraint invoices_status_check
  check (status in ('draft', 'sent', 'paid', 'failed', 'void', 'refunded', 'partially_refunded'));

drop policy if exists "clients read own invoices" on public.invoices;
create policy "clients read own invoices" on public.invoices
  for select to authenticated
  using (
    client_id = public.current_client_id()
    and status in ('sent', 'paid', 'failed', 'refunded', 'partially_refunded')
  );

-- Refund log -------------------------------------------------------------------

create table if not exists public.payment_refunds (
  id uuid primary key default extensions.gen_random_uuid(),
  payment_id uuid not null references public.payments (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  invoice_id uuid references public.invoices (id) on delete set null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text not null default 'USD' check (char_length(currency) = 3),
  reason text check (reason is null or char_length(reason) <= 1000),
  source text not null default 'crm' check (source in ('crm', 'mercadopago', 'manual')),
  mp_refund_id text check (mp_refund_id is null or char_length(mp_refund_id) <= 120),
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now()
);

create index if not exists payment_refunds_payment_idx
  on public.payment_refunds (payment_id, created_at desc);

-- One log row per Mercado Pago refund, so the CRM action and the webhook cannot both record it.
create unique index if not exists payment_refunds_mp_refund_id_key
  on public.payment_refunds (mp_refund_id)
  where mp_refund_id is not null;

alter table public.payment_refunds enable row level security;
revoke all on table public.payment_refunds from anon;
grant select, insert, update, delete on table public.payment_refunds to authenticated;

drop policy if exists "admins read payment refunds" on public.payment_refunds;
drop policy if exists "admins insert payment refunds" on public.payment_refunds;
drop policy if exists "admins update payment refunds" on public.payment_refunds;
drop policy if exists "admins delete payment refunds" on public.payment_refunds;
drop policy if exists "clients read own payment refunds" on public.payment_refunds;
create policy "admins read payment refunds" on public.payment_refunds
  for select to authenticated using (public.is_admin());
create policy "admins insert payment refunds" on public.payment_refunds
  for insert to authenticated with check (public.is_admin());
create policy "admins update payment refunds" on public.payment_refunds
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete payment refunds" on public.payment_refunds
  for delete to authenticated using (public.is_admin());
create policy "clients read own payment refunds" on public.payment_refunds
  for select to authenticated using (client_id = public.current_client_id());
