-- Pusaka — initial schema, RLS, storage, and triggers.
-- Run in the Supabase SQL editor (or via the Supabase CLI) on a fresh project.

create extension if not exists "pgcrypto";

-- ── Enums ────────────────────────────────────────────────────────────────────
create type news_template as enum
  ('announcement','achievement','event','scholarship','university_info');
create type news_category as enum
  ('prestasi','pengumuman','event','beasiswa','universitas');
create type news_status as enum ('draft','published');
create type aspirasi_kelas as enum
  ('X IPA','X IPS','XI IPA','XI IPS','XII IPA','XII IPS');
create type aspirasi_kategori as enum
  ('fasilitas','akademik','kegiatan','universitas','lainnya');
create type aspirasi_status as enum ('new','in_review','resolved','archived');
create type user_role as enum ('super_admin','editor');

-- ── updated_at helper ────────────────────────────────────────────────────────
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── profiles (extends auth.users) ────────────────────────────────────────────
create table profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  full_name   text not null default '',
  email       text,
  role        user_role not null default 'editor',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

-- ── news ─────────────────────────────────────────────────────────────────────
create table news (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  template        news_template not null,
  category        news_category not null,
  status          news_status not null default 'draft',
  title           text not null,
  title_en        text,
  summary         text not null default '',
  summary_en      text,
  body            text not null default '',
  body_en         text,
  cover_image_url text,
  cover_image_alt text,
  gallery         jsonb not null default '[]'::jsonb,
  details         jsonb not null default '{}'::jsonb,
  published_at    timestamptz,
  author_id       uuid references profiles(id) on delete set null,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create index news_status_published_idx on news (status, published_at desc);
create index news_category_idx on news (category);
create trigger news_set_updated_at before update on news
  for each row execute function set_updated_at();

-- ── programs ─────────────────────────────────────────────────────────────────
create table programs (
  id              uuid primary key default gen_random_uuid(),
  slug            text unique not null,
  title           text not null,
  title_en        text,
  description     text not null default '',
  description_en  text,
  cover_image_url text,
  cover_image_alt text,
  details         jsonb not null default '{}'::jsonb,
  sort_order      int not null default 0,
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);
create trigger programs_set_updated_at before update on programs
  for each row execute function set_updated_at();

-- ── info_sessions ────────────────────────────────────────────────────────────
create table info_sessions (
  id              uuid primary key default gen_random_uuid(),
  title           text not null,
  title_en        text,
  session_date    date,
  description     text not null default '',
  description_en  text,
  cover_image_url text,
  gallery         jsonb not null default '[]'::jsonb,
  sort_order      int not null default 0,
  created_at      timestamptz not null default now()
);

-- ── aspirasi (student submissions) ───────────────────────────────────────────
create table aspirasi (
  id             uuid primary key default gen_random_uuid(),
  nama           text not null,
  kelas          aspirasi_kelas not null,
  kategori       aspirasi_kategori not null,
  judul          text not null,
  isi            text not null,
  contact        text,
  status         aspirasi_status not null default 'new',
  assigned_to    uuid references profiles(id) on delete set null,
  internal_notes text,
  created_at     timestamptz not null default now()
);
create index aspirasi_status_idx on aspirasi (status, created_at desc);
create index aspirasi_kategori_idx on aspirasi (kategori);

-- ── Auth helper functions (security definer to avoid RLS recursion) ──────────
create or replace function is_staff()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from profiles p where p.id = auth.uid() and p.is_active
  );
$$;

create or replace function is_super_admin()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from profiles p
    where p.id = auth.uid() and p.is_active and p.role = 'super_admin'
  );
$$;

-- Auto-create a profile row when an auth user is created.
create or replace function handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'editor'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ── Row Level Security ───────────────────────────────────────────────────────
alter table profiles      enable row level security;
alter table news          enable row level security;
alter table programs      enable row level security;
alter table info_sessions enable row level security;
alter table aspirasi      enable row level security;

-- profiles: a user sees their own row; staff can read all (for assignment lists);
-- only super admins can modify profiles.
create policy "profiles read" on profiles
  for select using (auth.uid() = id or is_staff());
create policy "profiles super admin manage" on profiles
  for all using (is_super_admin()) with check (is_super_admin());

-- news: public reads only published; staff read drafts + manage everything.
create policy "news public read" on news
  for select using (status = 'published' or is_staff());
create policy "news staff manage" on news
  for all using (is_staff()) with check (is_staff());

-- programs: public reads active; staff manage everything.
create policy "programs public read" on programs
  for select using (is_active or is_staff());
create policy "programs staff manage" on programs
  for all using (is_staff()) with check (is_staff());

-- info_sessions: public read all; staff manage.
create policy "sessions public read" on info_sessions
  for select using (true);
create policy "sessions staff manage" on info_sessions
  for all using (is_staff()) with check (is_staff());

-- aspirasi: anyone may submit; only staff may read/update/delete. Public can
-- NEVER read submissions.
create policy "aspirasi public insert" on aspirasi
  for insert with check (true);
create policy "aspirasi staff read" on aspirasi
  for select using (is_staff());
create policy "aspirasi staff update" on aspirasi
  for update using (is_staff()) with check (is_staff());
create policy "aspirasi staff delete" on aspirasi
  for delete using (is_staff());

-- ── Storage buckets + policies ───────────────────────────────────────────────
insert into storage.buckets (id, name, public) values
  ('news-images','news-images', true),
  ('program-images','program-images', true),
  ('session-images','session-images', true)
on conflict (id) do nothing;

create policy "public read images" on storage.objects
  for select using (bucket_id in ('news-images','program-images','session-images'));
create policy "staff upload images" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('news-images','program-images','session-images') and is_staff());
create policy "staff update images" on storage.objects
  for update to authenticated
  using (bucket_id in ('news-images','program-images','session-images') and is_staff());
create policy "staff delete images" on storage.objects
  for delete to authenticated
  using (bucket_id in ('news-images','program-images','session-images') and is_staff());
