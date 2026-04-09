-- Wedora blog SEO + RLS migration
-- Safe to run multiple times.

begin;

-- 1) Optional SEO / publishing columns (kept nullable for backward compatibility)
alter table public.blogs
  add column if not exists author text,
  add column if not exists keywords text,
  add column if not exists category text,
  add column if not exists published_at timestamptz,
  add column if not exists updated_at timestamptz default now();

-- Ensure slug uniqueness for clean /blog/:slug URLs
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blogs_slug_unique'
      and conrelid = 'public.blogs'::regclass
  ) then
    alter table public.blogs
      add constraint blogs_slug_unique unique (slug);
  end if;
end $$;

-- Helpful indexes
create index if not exists idx_blogs_status on public.blogs(status);
create index if not exists idx_blogs_published_at on public.blogs(published_at desc);
create index if not exists idx_blogs_slug on public.blogs(slug);

-- Keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_blogs_set_updated_at on public.blogs;
create trigger trg_blogs_set_updated_at
before update on public.blogs
for each row
execute function public.set_updated_at();

-- 2) RLS policies
alter table public.blogs enable row level security;

-- Public read only published posts
drop policy if exists "blogs_public_read_published" on public.blogs;
create policy "blogs_public_read_published"
on public.blogs
for select
using (status = 'published');

-- Admin full access (email or metadata role)
drop policy if exists "blogs_admin_all" on public.blogs;
create policy "blogs_admin_all"
on public.blogs
for all
using (
  auth.email() = 'admin@wedora.in'
  or coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
)
with check (
  auth.email() = 'admin@wedora.in'
  or coalesce(auth.jwt() -> 'user_metadata' ->> 'role', '') = 'admin'
);

-- Optional hardening: only allow draft/published values
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'blogs_status_check'
      and conrelid = 'public.blogs'::regclass
  ) then
    alter table public.blogs
      add constraint blogs_status_check
      check (status in ('draft', 'published'));
  end if;
end $$;

commit;
