-- ==============================================================================
-- Vendor Reviews Schema Migration
-- Creates the review system with automatic rating recalculations
-- ==============================================================================

-- 1. Add Rating Columns to marketplace_vendors
-- Note: Using IF NOT EXISTS safely inside a DO block if needed, but ADD COLUMN IF NOT EXISTS works in modern postgres
ALTER TABLE public.marketplace_vendors ADD COLUMN IF NOT EXISTS rating_avg numeric(3,2) DEFAULT 0.00;
ALTER TABLE public.marketplace_vendors ADD COLUMN IF NOT EXISTS reviews_count integer DEFAULT 0;

-- 2. Create Reviews Table
CREATE TABLE IF NOT EXISTS public.vendor_reviews (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  vendor_id uuid REFERENCES public.marketplace_vendors(id) ON DELETE CASCADE,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(vendor_id, user_id) -- A user can only leave one review per vendor
);

-- Indexes for fast fetching
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_vendor_id ON public.vendor_reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_user_id ON public.vendor_reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_vendor_reviews_rating ON public.vendor_reviews(rating);

-- 3. Trigger to Update average rating on marketplace_vendors
CREATE OR REPLACE FUNCTION public.update_vendor_rating()
RETURNS TRIGGER AS $$
DECLARE
  v_id uuid;
  avg_rating numeric;
  total_reviews integer;
BEGIN
  -- Determine which vendor to update
  IF TG_OP = 'DELETE' THEN
    v_id := OLD.vendor_id;
  ELSE
    v_id := NEW.vendor_id;
  END IF;

  -- Calculate the new average and count
  SELECT 
    COALESCE(AVG(rating), 0), 
    COUNT(id) 
  INTO 
    avg_rating, 
    total_reviews
  FROM public.vendor_reviews
  WHERE vendor_id = v_id;

  -- Update the marketplace vendor record
  UPDATE public.marketplace_vendors
  SET 
    rating_avg = avg_rating,
    reviews_count = total_reviews
  WHERE id = v_id;

  RETURN NULL; -- AFTER trigger can return NULL
END;
$$ LANGUAGE plpgsql;

-- Drop trigger if exists to allow safe re-runs
DROP TRIGGER IF EXISTS trigger_update_vendor_rating ON public.vendor_reviews;

CREATE TRIGGER trigger_update_vendor_rating
AFTER INSERT OR UPDATE OR DELETE ON public.vendor_reviews
FOR EACH ROW EXECUTE FUNCTION public.update_vendor_rating();


-- 4. Row Level Security Setup
ALTER TABLE public.vendor_reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" 
ON public.vendor_reviews FOR SELECT 
USING (true);

-- Authenticated couples can insert their own reviews
CREATE POLICY "Users can insert their own reviews" 
ON public.vendor_reviews FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Authenticated couples can update their own reviews
CREATE POLICY "Users can update their own reviews" 
ON public.vendor_reviews FOR UPDATE 
USING (auth.uid() = user_id);

-- Authenticated couples can delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
ON public.vendor_reviews FOR DELETE 
USING (auth.uid() = user_id);

-- Admin Policy (fallback)
CREATE POLICY "Admins can manage all reviews"
ON public.vendor_reviews FOR ALL TO authenticated USING (
    auth.jwt() ->> 'email' = 'admin@wedora.in' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);
