-- Run once in Supabase SQL Editor (safe to re-run)

alter table public.accounts
  add column if not exists display_name text;

alter table public.accounts
  add column if not exists password_plain text;

alter table public.accounts
  add column if not exists referral_code text;

create table if not exists public.referral_codes (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  label text,
  max_uses int not null default 1 check (max_uses >= 1 and max_uses <= 500),
  use_count int not null default 0 check (use_count >= 0),
  created_at timestamptz not null default now(),
  last_used_at timestamptz
);

create index if not exists referral_codes_code_idx on public.referral_codes (code);

alter table public.referral_codes enable row level security;
