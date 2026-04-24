-- ═══════════════════════════════════════════════════════════════════
-- Wedora — Vendor Analytics Tracking Tables
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. PROFILE VIEWS TABLE — tracks every couple visit to a vendor page
CREATE TABLE IF NOT EXISTS public.vendor_profile_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES public.marketplace_vendors(id) ON DELETE CASCADE NOT NULL,
  viewer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- null = anonymous visitor
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vpv_vendor_id ON public.vendor_profile_views(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vpv_created_at ON public.vendor_profile_views(created_at);

ALTER TABLE public.vendor_profile_views ENABLE ROW LEVEL SECURITY;

-- Anyone can insert a view (even anonymous)
CREATE POLICY "Anyone can log a profile view"
  ON public.vendor_profile_views FOR INSERT
  WITH CHECK (true);

-- Vendors can read views for their own listing
CREATE POLICY "Vendor can view own profile views"
  ON public.vendor_profile_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.marketplace_vendors
      WHERE marketplace_vendors.id = vendor_profile_views.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );

-- Admin can read all views
CREATE POLICY "Admin can view all profile views"
  ON public.vendor_profile_views FOR SELECT TO authenticated
  USING (
    auth.jwt() ->> 'email' = 'admin@wedora.in' OR
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
  );


-- 2. ADD SOURCE COLUMN TO VENDOR_LEADS — track where leads come from
ALTER TABLE public.vendor_leads
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'marketplace';

-- ═══════════════════════════════════════════════════════════════════
-- DONE! Tracking tables created.
-- vendor_profile_views: logs each couple visit
-- vendor_leads.source: 'marketplace', 'whatsapp', 'direct', 'blog'
-- ═══════════════════════════════════════════════════════════════════
