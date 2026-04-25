-- Add relationship columns to wedding_sites table
-- These store the relation (e.g. "Father of the Bride") for each family contact person

ALTER TABLE wedding_sites
  ADD COLUMN IF NOT EXISTS bride_contact_relation TEXT DEFAULT 'Father of the Bride',
  ADD COLUMN IF NOT EXISTS groom_contact_relation TEXT DEFAULT 'Father of the Groom';
