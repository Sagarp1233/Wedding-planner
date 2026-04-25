-- Enhance wedding_sites with reminder_settings
ALTER TABLE public.wedding_sites ADD COLUMN IF NOT EXISTS reminder_settings jsonb DEFAULT '{
  "whatsapp_pending": false,
  "whatsapp_confirmed": false,
  "email_reminders": false
}'::jsonb;

-- Ensure rsvp_responses table has the necessary columns (idempotent additions if already there)
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS guest_email text;
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS group_id uuid;

-- Create Guest Groups Table
CREATE TABLE IF NOT EXISTS public.guest_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_site_id uuid REFERENCES public.wedding_sites(id) ON DELETE CASCADE,
  name text NOT NULL,
  color text DEFAULT '#B76E79',
  created_at timestamptz DEFAULT now()
);

-- RLS for guest groups
ALTER TABLE public.guest_groups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Couples can manage their own guest groups" 
ON public.guest_groups FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.wedding_sites ws 
    WHERE ws.id = guest_groups.wedding_site_id 
    AND ws.couple_id = auth.uid()
  )
);

-- Ensure correct FK in rsvp_responses
ALTER TABLE public.rsvp_responses DROP CONSTRAINT IF EXISTS fk_rsvp_groups;
ALTER TABLE public.rsvp_responses ADD CONSTRAINT fk_rsvp_groups FOREIGN KEY (group_id) REFERENCES public.guest_groups(id) ON DELETE SET NULL;
