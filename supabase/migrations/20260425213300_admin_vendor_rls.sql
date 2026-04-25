-- Allow Admin to view ALL vendor records, even pending ones
-- This ensures pending applications appear in the moderation dashboard
CREATE POLICY "Admin full access marketplace_vendors" 
ON marketplace_vendors 
FOR ALL 
TO authenticated 
USING ( auth.email() = 'admin@wedora.in' );
