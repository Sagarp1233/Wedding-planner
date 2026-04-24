-- ═══════════════════════════════════════════════════════════════════
-- Wedora — Vendor SaaS CRM Enhancements 
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. Safely drop the existing constraint on status
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'vendor_leads_status_check') THEN
    ALTER TABLE public.vendor_leads DROP CONSTRAINT vendor_leads_status_check;
  END IF;
END $$;

-- 2. Add CRM tracking columns to vendor_leads
ALTER TABLE public.vendor_leads ADD COLUMN IF NOT EXISTS notes TEXT DEFAULT '';
ALTER TABLE public.vendor_leads ADD COLUMN IF NOT EXISTS estimated_value INTEGER DEFAULT 0;

-- 3. Add the updated pipeline constraint (so 'booked' etc. are allowed)
ALTER TABLE public.vendor_leads ADD CONSTRAINT vendor_leads_status_check 
  CHECK (status IN ('new', 'contacted', 'negotiating', 'booked', 'closed_lost'));

-- ═══════════════════════════════════════════════════════════════════
-- DONE! Enhanced CRM schema updated.
-- ═══════════════════════════════════════════════════════════════════
