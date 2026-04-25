-- Augment rsvp_responses to act as a full guest management table
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS category text DEFAULT 'Family';
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS table_name text;
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.rsvp_responses ADD COLUMN IF NOT EXISTS is_manual_add boolean DEFAULT false;

-- Add indexes for common queries
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_category ON public.rsvp_responses(category);
CREATE INDEX IF NOT EXISTS idx_rsvp_responses_table_name ON public.rsvp_responses(table_name);
