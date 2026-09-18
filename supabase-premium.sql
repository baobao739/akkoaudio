-- ============================================================
-- AkkoMusic Premium — run once in Supabase SQL Editor
-- ============================================================

alter table public.accounts
  add column if not exists is_premium boolean not null default false;

alter table public.accounts
  add column if not exists premium_at timestamptz;

alter table public.accounts
  add column if not exists premium_code text;

create table if not exists public.premium_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text,
  max_uses int not null default 1 check (max_uses >= 1 and max_uses <= 500),
  use_count int not null default 0 check (use_count >= 0),
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists premium_codes_code_idx on public.premium_codes (code);

alter table public.premium_codes enable row level security;
