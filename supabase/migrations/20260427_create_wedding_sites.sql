-- Create the wedding_sites table
CREATE TABLE IF NOT EXISTS public.wedding_sites (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id uuid REFERENCES auth.users(id),
  slug text UNIQUE,
  bride_name text,
  groom_name text,
  wedding_date timestamptz,
  rsvp_deadline timestamptz,
  hero_image_url text,
  story_text text,
  venue_name text,
  venue_address text,
  venue_maps_url text,
  venue_city text,
  dress_code text,
  theme text DEFAULT 'elegant',
  show_wedora_branding boolean DEFAULT true,
  is_published boolean DEFAULT false,
  bride_contact_name text,
  bride_contact_phone text,
  groom_contact_name text,
  groom_contact_phone text,
  events jsonb DEFAULT '[]'::jsonb,
  gallery_images jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create the rsvp_responses table
CREATE TABLE IF NOT EXISTS public.rsvp_responses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_site_id uuid REFERENCES public.wedding_sites(id) ON DELETE CASCADE,
  guest_name text NOT NULL,
  guest_phone text NOT NULL,
  guest_email text,
  guest_count int DEFAULT 1,
  attendance_status text,
  events_attending jsonb DEFAULT '[]'::jsonb,
  meal_preference text,
  guest_side text,
  message_to_couple text,
  created_at timestamptz DEFAULT now()
);

-- Ensure the venue_city column exists just in case the table was already created before
ALTER TABLE public.wedding_sites ADD COLUMN IF NOT EXISTS venue_city text;

-- Enable RLS and setup permissive policies for public wedding sites
ALTER TABLE public.wedding_sites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rsvp_responses ENABLE ROW LEVEL SECURITY;

-- Allow public read access to wedding sites
CREATE POLICY "Public can view published wedding sites" 
ON public.wedding_sites FOR SELECT 
USING (is_published = true OR auth.uid() = couple_id);

-- Allow couple to fully manage their own wedding site
CREATE POLICY "Couples can manage their own wedding site" 
ON public.wedding_sites FOR ALL 
USING (auth.uid() = couple_id);

-- Allow public/anonymous to submit RSVPs
CREATE POLICY "Public can insert rsvp responses" 
ON public.rsvp_responses FOR INSERT 
WITH CHECK (true);

-- Allow couple to view their own RSVPs
CREATE POLICY "Couples can read their RSVPs" 
ON public.rsvp_responses FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_sites ws 
    WHERE ws.id = rsvp_responses.wedding_site_id 
    AND ws.couple_id = auth.uid()
  )
);

-- Insert the sample row for Sumanth and Abhineethi
INSERT INTO public.wedding_sites (
  slug, bride_name, groom_name, wedding_date, theme, is_published, 
  story_text, venue_name, venue_address, venue_city, events, show_wedora_branding
) VALUES (
  'sumanth-and-abhineethi',
  'Abhineethi',
  'Sumanth',
  now() + interval '1 year',
  'elegant',
  true,
  'Sumanth and Abhineethi met during their college years and have been inseparable ever since. From late night study sessions to traveling the world together, their journey has been magical. Join us as we celebrate our love and commitment to each other surrounded by loved ones.',
  'Taj Falaknuma Palace',
  'Engine Bowli, Falaknuma, Hyderabad, Telangana',
  'Hyderabad',
  '[{"name": "Sangeet & Mehendi", "date": "2027-04-25T13:30:00Z", "time": "7:00 PM", "venue": "Falaknuma Lawns"}, {"name": "Muhurtham", "date": "2027-04-26T04:00:00Z", "time": "9:30 AM", "venue": "Main Hall"}, {"name": "Reception", "date": "2027-04-26T14:00:00Z", "time": "7:30 PM", "venue": "Grand Ballroom"}]'::jsonb,
  true
) ON CONFLICT (slug) DO NOTHING;

