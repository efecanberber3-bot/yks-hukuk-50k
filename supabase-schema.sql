-- HUKUK 50K OS • Supabase Cloud
-- Run this whole file once in Supabase SQL Editor.
-- Never put service_role/secret keys into GitHub or the browser.

create table if not exists public.user_state (
  user_id uuid primary key references auth.users(id) on delete cascade,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.user_state enable row level security;

revoke all on table public.user_state from anon;
grant select, insert, update, delete on table public.user_state to authenticated;

drop policy if exists "Users can read their own state" on public.user_state;
create policy "Users can read their own state"
on public.user_state for select
to authenticated
using ((select auth.uid()) = user_id);

drop policy if exists "Users can insert their own state" on public.user_state;
create policy "Users can insert their own state"
on public.user_state for insert
to authenticated
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can update their own state" on public.user_state;
create policy "Users can update their own state"
on public.user_state for update
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can delete their own state" on public.user_state;
create policy "Users can delete their own state"
on public.user_state for delete
to authenticated
using ((select auth.uid()) = user_id);


-- V31 • Friend / Accountability mode. Only selected progress stats are stored here.
create table if not exists public.friend_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  share_code text not null unique,
  display_name text not null default 'Hukuk 50K öğrencisi',
  share_enabled boolean not null default false,
  study_minutes integer not null default 0,
  weekly_questions integer not null default 0,
  week_score integer not null default 0,
  streak integer not null default 0,
  target_rank integer not null default 30000,
  target_label text not null default 'Hukuk',
  updated_at timestamptz not null default now()
);
alter table public.friend_profiles enable row level security;
revoke all on table public.friend_profiles from anon;
grant select, insert, update, delete on table public.friend_profiles to authenticated;
drop policy if exists "Users can manage own friend profile" on public.friend_profiles;
create policy "Users can manage own friend profile" on public.friend_profiles for all to authenticated
using ((select auth.uid())=user_id) with check ((select auth.uid())=user_id);
drop policy if exists "Users can view enabled friend profiles" on public.friend_profiles;
create policy "Users can view enabled friend profiles" on public.friend_profiles for select to authenticated
using (share_enabled = true or (select auth.uid())=user_id);
