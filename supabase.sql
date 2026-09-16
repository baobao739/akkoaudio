-- Run once in Supabase SQL Editor.

create extension if not exists pgcrypto;

create table if not exists public.accounts (
  id uuid primary key default gen_random_uuid(),
  username text not null unique
    check (char_length(trim(username)) between 3 and 32),
  password_hash text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'denied', 'revoked')),
  created_at timestamptz not null default now(),
  reviewed_at timestamptz,
  review_note text check (review_note is null or char_length(review_note) <= 300),
  last_login_at timestamptz
);

create index if not exists accounts_status_idx
  on public.accounts (status, created_at desc);

create index if not exists accounts_username_lower_idx
  on public.accounts (lower(username));

alter table public.accounts enable row level security;
