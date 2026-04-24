-- ═══════════════════════════════════════════════════════════════════
-- Wedora — Couple Preference Columns for Progressive Onboarding
-- Run this in Supabase Dashboard → SQL Editor
-- Safe & idempotent: uses ADD COLUMN IF NOT EXISTS
-- ═══════════════════════════════════════════════════════════════════

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS budget_range text,
  ADD COLUMN IF NOT EXISTS guest_count text,
  ADD COLUMN IF NOT EXISTS venue_status text,
  ADD COLUMN IF NOT EXISTS planning_needs text[],
  ADD COLUMN IF NOT EXISTS wedding_style text,
  ADD COLUMN IF NOT EXISTS onboarding_completed boolean NOT NULL DEFAULT false;

-- ═══════════════════════════════════════════════════════════════════
-- DONE! New columns added to public.users for couple preferences.
-- No RLS changes needed — users already have UPDATE on their own row.
-- ═══════════════════════════════════════════════════════════════════
