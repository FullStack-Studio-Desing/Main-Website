-- Support tickets, messages, and attachments.
-- Safe to run again: objects are created only if missing, policies are replaced.

create sequence if not exists public.ticket_number_seq;

create table if not exists public.tickets (
  id uuid primary key default extensions.gen_random_uuid(),
  number text not null unique default ('TCK-' || lpad(nextval('public.ticket_number_seq')::text, 4, '0')),
  client_id uuid not null references public.clients (id) on delete cascade,
  project_id uuid references public.projects (id) on delete set null,
  category text not null default 'question'
    check (category in ('bug','change_request','question','content_update','billing','account','other')),
  title text not null check (char_length(btrim(title)) between 3 and 140),
  description text not null check (char_length(btrim(description)) between 10 and 8000),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  status text not null default 'open'
    check (status in ('open','awaiting_studio','awaiting_client','in_progress','resolved','closed')),
  assigned_to uuid references public.profiles (id) on delete set null,
  task_id uuid references public.project_tasks (id) on delete set null,
  created_by uuid references public.profiles (id) on delete set null,
  last_message_at timestamptz not null default now(),
  client_last_read_at timestamptz,
  studio_last_read_at timestamptz,
  resolved_at timestamptz,
  closed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tickets_client_activity_idx
  on public.tickets (client_id, last_message_at desc);

create index if not exists tickets_status_activity_idx
  on public.tickets (status, last_message_at desc);

create index if not exists tickets_project_idx
  on public.tickets (project_id)
  where project_id is not null;

drop trigger if exists tickets_set_updated_at on public.tickets;
create trigger tickets_set_updated_at
  before update on public.tickets
  for each row execute function public.set_updated_at();

create table if not exists public.ticket_messages (
  id uuid primary key default extensions.gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  author_id uuid references public.profiles (id) on delete set null,
  author_role text not null check (author_role in ('client','admin','system')),
  kind text not null default 'reply' check (kind in ('reply','internal_note','event')),
  body text check (body is null or char_length(body) <= 8000),
  event jsonb,
  created_at timestamptz not null default now(),
  edited_at timestamptz
);

create index if not exists ticket_messages_ticket_idx
  on public.ticket_messages (ticket_id, created_at);

create or replace function public.tickets_touch_last_message_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.tickets
  set last_message_at = greatest(last_message_at, new.created_at)
  where id = new.ticket_id;
  return new;
end;
$$;

drop trigger if exists ticket_messages_touch_ticket on public.ticket_messages;
create trigger ticket_messages_touch_ticket
  after insert on public.ticket_messages
  for each row execute function public.tickets_touch_last_message_at();

create table if not exists public.ticket_attachments (
  id uuid primary key default extensions.gen_random_uuid(),
  ticket_id uuid not null references public.tickets (id) on delete cascade,
  message_id uuid references public.ticket_messages (id) on delete cascade,
  client_id uuid not null references public.clients (id) on delete cascade,
  uploaded_by uuid references public.profiles (id) on delete set null,
  r2_key text not null unique,
  file_name text not null check (char_length(file_name) between 1 and 200),
  content_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  width int,
  height int,
  status text not null default 'pending' check (status in ('pending','ready','rejected')),
  created_at timestamptz not null default now()
);

create index if not exists ticket_attachments_message_idx
  on public.ticket_attachments (message_id)
  where message_id is not null;

-- RLS: tickets ----------------------------------------------------------------

alter table public.tickets enable row level security;
revoke all on table public.tickets from anon;
grant select, insert, update, delete on table public.tickets to authenticated;

drop policy if exists "admins read tickets" on public.tickets;
drop policy if exists "admins insert tickets" on public.tickets;
drop policy if exists "admins update tickets" on public.tickets;
drop policy if exists "admins delete tickets" on public.tickets;
drop policy if exists "clients read own tickets" on public.tickets;
drop policy if exists "clients insert own tickets" on public.tickets;

create policy "admins read tickets" on public.tickets
  for select to authenticated using (public.is_admin());
create policy "admins insert tickets" on public.tickets
  for insert to authenticated with check (public.is_admin());
create policy "admins update tickets" on public.tickets
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete tickets" on public.tickets
  for delete to authenticated using (public.is_admin());
create policy "clients read own tickets" on public.tickets
  for select to authenticated using (client_id = public.current_client_id());
create policy "clients insert own tickets" on public.tickets
  for insert to authenticated with check (client_id = public.current_client_id());

-- RLS: ticket_messages --------------------------------------------------------

alter table public.ticket_messages enable row level security;
revoke all on table public.ticket_messages from anon;
grant select, insert, update, delete on table public.ticket_messages to authenticated;

drop policy if exists "admins read ticket messages" on public.ticket_messages;
drop policy if exists "admins insert ticket messages" on public.ticket_messages;
drop policy if exists "admins update ticket messages" on public.ticket_messages;
drop policy if exists "admins delete ticket messages" on public.ticket_messages;
drop policy if exists "clients read own ticket messages" on public.ticket_messages;
drop policy if exists "clients insert own ticket replies" on public.ticket_messages;

create policy "admins read ticket messages" on public.ticket_messages
  for select to authenticated using (public.is_admin());
create policy "admins insert ticket messages" on public.ticket_messages
  for insert to authenticated with check (public.is_admin());
create policy "admins update ticket messages" on public.ticket_messages
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete ticket messages" on public.ticket_messages
  for delete to authenticated using (public.is_admin());
create policy "clients read own ticket messages" on public.ticket_messages
  for select to authenticated
  using (client_id = public.current_client_id() and kind <> 'internal_note');
create policy "clients insert own ticket replies" on public.ticket_messages
  for insert to authenticated
  with check (
    client_id = public.current_client_id()
    and author_role = 'client'
    and kind = 'reply'
  );

-- RLS: ticket_attachments -----------------------------------------------------

alter table public.ticket_attachments enable row level security;
revoke all on table public.ticket_attachments from anon;
grant select, insert, update, delete on table public.ticket_attachments to authenticated;

drop policy if exists "admins read ticket attachments" on public.ticket_attachments;
drop policy if exists "admins insert ticket attachments" on public.ticket_attachments;
drop policy if exists "admins update ticket attachments" on public.ticket_attachments;
drop policy if exists "admins delete ticket attachments" on public.ticket_attachments;
drop policy if exists "clients read own ticket attachments" on public.ticket_attachments;

create policy "admins read ticket attachments" on public.ticket_attachments
  for select to authenticated using (public.is_admin());
create policy "admins insert ticket attachments" on public.ticket_attachments
  for insert to authenticated with check (public.is_admin());
create policy "admins update ticket attachments" on public.ticket_attachments
  for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete ticket attachments" on public.ticket_attachments
  for delete to authenticated using (public.is_admin());
create policy "clients read own ticket attachments" on public.ticket_attachments
  for select to authenticated
  using (
    client_id = public.current_client_id()
    and (
      message_id is null
      or exists (
        select 1 from public.ticket_messages m
        where m.id = message_id
          and m.client_id = public.current_client_id()
          and m.kind <> 'internal_note'
      )
    )
  );

grant usage, select on sequence public.ticket_number_seq to authenticated;