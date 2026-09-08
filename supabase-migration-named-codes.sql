-- Run this in Supabase SQL Editor (safe to run once).
-- Adds name + revoke support for access codes.

alter table public.access_codes
  add column if not exists name text,
  add column if not exists revoked boolean not null default false;

-- Optional: keep used codes queryable
create index if not exists access_codes_used_idx
  on public.access_codes (used, revoked, used_at desc);
