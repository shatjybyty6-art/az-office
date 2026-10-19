-- نفّذ هذا الملف داخل Supabase > SQL Editor.
create extension if not exists pgcrypto;

create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  platform text not null check (platform in ('PS4', 'PS5')),
  genre text not null default 'غير مصنف',
  year integer,
  cover_url text not null default '',
  description text not null default '',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;

-- يستطيع الجميع قراءة كتالوج الألعاب.
drop policy if exists "Public can read games" on public.games;
create policy "Public can read games"
on public.games for select
to anon, authenticated
using (true);

-- التعديل والإضافة والحذف للمستخدمين المسجلين فقط.
-- أنشئ حساب المسؤول بنفسك من Supabase Authentication > Users.
drop policy if exists "Authenticated users can insert games" on public.games;
create policy "Authenticated users can insert games"
on public.games for insert
to authenticated
with check (true);

drop policy if exists "Authenticated users can update games" on public.games;
create policy "Authenticated users can update games"
on public.games for update
to authenticated
using (true)
with check (true);

drop policy if exists "Authenticated users can delete games" on public.games;
create policy "Authenticated users can delete games"
on public.games for delete
to authenticated
using (true);
