-- ═══════════════════════════════════════════════════════════════════
-- Wedora Vendor Marketplace — Database Migration
-- Run this in Supabase Dashboard → SQL Editor
-- ═══════════════════════════════════════════════════════════════════

-- 1. MARKETPLACE VENDORS (Core listing table)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS marketplace_vendors (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  city TEXT NOT NULL,
  description TEXT DEFAULT '',
  price_range_min INTEGER DEFAULT 0,
  price_range_max INTEGER DEFAULT 0,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  website TEXT DEFAULT '',
  cover_image TEXT DEFAULT '',
  is_verified BOOLEAN DEFAULT false,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'suspended')),
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index for fast public queries
CREATE INDEX IF NOT EXISTS idx_mv_status_category ON marketplace_vendors(status, category);
CREATE INDEX IF NOT EXISTS idx_mv_slug ON marketplace_vendors(slug);
CREATE INDEX IF NOT EXISTS idx_mv_user_id ON marketplace_vendors(user_id);
CREATE INDEX IF NOT EXISTS idx_mv_city ON marketplace_vendors(city);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_marketplace_vendor_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_mv_updated_at ON marketplace_vendors;
CREATE TRIGGER trg_mv_updated_at
  BEFORE UPDATE ON marketplace_vendors
  FOR EACH ROW EXECUTE FUNCTION update_marketplace_vendor_timestamp();

-- RLS
ALTER TABLE marketplace_vendors ENABLE ROW LEVEL SECURITY;

-- Public: anyone can read approved vendors
CREATE POLICY "Public can view approved vendors"
  ON marketplace_vendors FOR SELECT
  USING (status = 'approved');

-- Vendor: can read their own listing (any status)
CREATE POLICY "Vendor can view own listing"
  ON marketplace_vendors FOR SELECT
  USING (auth.uid() = user_id);

-- Vendor: can insert their own listing
CREATE POLICY "Vendor can create listing"
  ON marketplace_vendors FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Vendor: can update their own listing
CREATE POLICY "Vendor can update own listing"
  ON marketplace_vendors FOR UPDATE
  USING (auth.uid() = user_id);

-- Vendor: can delete their own listing
CREATE POLICY "Vendor can delete own listing"
  ON marketplace_vendors FOR DELETE
  USING (auth.uid() = user_id);

-- Admin: full access (uses service role or check user email)
-- Note: For admin access, use Supabase service_role key in admin API calls,
-- or create a function that checks if the user is admin.


-- 2. VENDOR MEDIA (Portfolio images)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_media (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES marketplace_vendors(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT DEFAULT '',
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vm_vendor_id ON vendor_media(vendor_id);

ALTER TABLE vendor_media ENABLE ROW LEVEL SECURITY;

-- Public: can view media of approved vendors
CREATE POLICY "Public can view approved vendor media"
  ON vendor_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_media.vendor_id
      AND marketplace_vendors.status = 'approved'
    )
  );

-- Vendor: can view their own media
CREATE POLICY "Vendor can view own media"
  ON vendor_media FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_media.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );

-- Vendor: can insert media for their own vendor listing
CREATE POLICY "Vendor can add media"
  ON vendor_media FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_media.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );

-- Vendor: can update their own media
CREATE POLICY "Vendor can update own media"
  ON vendor_media FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_media.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );

-- Vendor: can delete their own media
CREATE POLICY "Vendor can delete own media"
  ON vendor_media FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_media.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );


-- 3. VENDOR LEADS (Enquiries from couples)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_leads (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES marketplace_vendors(id) ON DELETE CASCADE NOT NULL,
  couple_name TEXT NOT NULL,
  phone TEXT DEFAULT '',
  email TEXT DEFAULT '',
  wedding_date DATE,
  message TEXT DEFAULT '',
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vl_vendor_id ON vendor_leads(vendor_id);

ALTER TABLE vendor_leads ENABLE ROW LEVEL SECURITY;

-- Anyone can submit a lead (even anonymous visitors)
CREATE POLICY "Anyone can submit enquiry"
  ON vendor_leads FOR INSERT
  WITH CHECK (true);

-- Vendor: can view leads for their own listing
CREATE POLICY "Vendor can view own leads"
  ON vendor_leads FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_leads.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );

-- Vendor: can update lead status
CREATE POLICY "Vendor can update own lead status"
  ON vendor_leads FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_leads.vendor_id
      AND marketplace_vendors.user_id = auth.uid()
    )
  );


-- 4. VENDOR REVIEWS (Future-ready)
-- ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS vendor_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id UUID REFERENCES marketplace_vendors(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vr_vendor_id ON vendor_reviews(vendor_id);

ALTER TABLE vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Public: can view reviews of approved vendors
CREATE POLICY "Public can view approved vendor reviews"
  ON vendor_reviews FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM marketplace_vendors
      WHERE marketplace_vendors.id = vendor_reviews.vendor_id
      AND marketplace_vendors.status = 'approved'
    )
  );

-- Authenticated users can submit reviews
CREATE POLICY "Authenticated users can submit reviews"
  ON vendor_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update own reviews"
  ON vendor_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete own reviews"
  ON vendor_reviews FOR DELETE
  USING (auth.uid() = user_id);


-- ═══════════════════════════════════════════════════════════════════
-- DONE! All 4 tables created with RLS policies.
-- ═══════════════════════════════════════════════════════════════════
