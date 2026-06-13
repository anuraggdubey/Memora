-- Memora initial Supabase schema.
-- Run this in Supabase SQL Editor after Auth is enabled.

create extension if not exists vector;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  color text not null default '#1A1A1A',
  model text not null default 'auto' check (model in ('auto', 'groq', 'gemini')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chats (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  title text not null default 'New chat',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  chat_id uuid not null references public.chats(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  model text check (model in ('auto', 'groq', 'gemini')),
  created_at timestamptz not null default now()
);

create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  text text not null,
  category text not null check (
    category in ('fact', 'preference', 'decision', 'goal', 'people', 'project')
  ),
  pinned boolean not null default false,
  embedding vector(768),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workspace_id uuid references public.workspaces(id) on delete set null,
  source_message_id uuid references public.messages(id) on delete set null,
  text text not null,
  status text not null default 'Pending' check (
    status in ('Pending', 'Implemented', 'Abandoned', 'In progress')
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
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
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;

  insert into public.workspaces (user_id, name, color, model)
  values (new.id, 'Personal', '#1A1A1A', 'auto')
  on conflict do nothing;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
  before update on public.workspaces
  for each row execute function public.set_updated_at();

drop trigger if exists set_chats_updated_at on public.chats;
create trigger set_chats_updated_at
  before update on public.chats
  for each row execute function public.set_updated_at();

drop trigger if exists set_memories_updated_at on public.memories;
create trigger set_memories_updated_at
  before update on public.memories
  for each row execute function public.set_updated_at();

drop trigger if exists set_decisions_updated_at on public.decisions;
create trigger set_decisions_updated_at
  before update on public.decisions
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.chats enable row level security;
alter table public.messages enable row level security;
alter table public.memories enable row level security;
alter table public.decisions enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

drop policy if exists "workspaces_crud_own" on public.workspaces;
create policy "workspaces_crud_own"
  on public.workspaces for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "chats_crud_own" on public.chats;
create policy "chats_crud_own"
  on public.chats for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "messages_crud_own" on public.messages;
create policy "messages_crud_own"
  on public.messages for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "memories_crud_own" on public.memories;
create policy "memories_crud_own"
  on public.memories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "decisions_crud_own" on public.decisions;
create policy "decisions_crud_own"
  on public.decisions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists workspaces_user_id_idx on public.workspaces(user_id);
create index if not exists chats_user_id_idx on public.chats(user_id);
create index if not exists messages_chat_id_idx on public.messages(chat_id);
create index if not exists memories_user_id_idx on public.memories(user_id);
create index if not exists memories_category_idx on public.memories(category);
create index if not exists decisions_user_id_idx on public.decisions(user_id);
