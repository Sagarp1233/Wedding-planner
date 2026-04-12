-- 1. Create collaborators table
CREATE TABLE IF NOT EXISTS public.collaborators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'partner',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(wedding_id, user_id)
);

-- Turn on RLS for collaborators
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own collaboration links" ON public.collaborators;
CREATE POLICY "Users can view their own collaboration links" ON public.collaborators 
    FOR SELECT TO authenticated USING (user_id = auth.uid() OR wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

DROP POLICY IF EXISTS "Owners can remove collaborators" ON public.collaborators;
CREATE POLICY "Owners can remove collaborators" ON public.collaborators
    FOR DELETE TO authenticated USING (wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- 2. Create wedding_invites table
CREATE TABLE IF NOT EXISTS public.wedding_invites (
    token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'partner',
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);

-- Turn on RLS for invites
ALTER TABLE public.wedding_invites ENABLE ROW LEVEL SECURITY;

-- Owners can see invites they generated
DROP POLICY IF EXISTS "Owners can view and create their invites" ON public.wedding_invites;
CREATE POLICY "Owners can view and create their invites" ON public.wedding_invites
    FOR ALL TO authenticated USING (created_by = auth.uid() OR wedding_id IN (SELECT id FROM public.weddings WHERE user_id = auth.uid()));

-- Unauthenticated or authenticated users MUST be able to query checking if a token is valid, but they don't need RLS because we use a SECURITY DEFINER function!

-- 3. Replace RLS Policies on Weddings
-- Drop old policies to prevent collision
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON public.weddings;

-- Read policy (Both owner and collaborators can see)
DROP POLICY IF EXISTS "Enable Read for owners and collaborators" ON public.weddings;
CREATE POLICY "Enable Read for owners and collaborators" ON public.weddings
FOR SELECT TO authenticated USING (
    user_id = auth.uid() OR 
    id IN (SELECT wedding_id FROM public.collaborators WHERE user_id = auth.uid())
);

-- Update policy (Both owner and collaborators can edit details)
DROP POLICY IF EXISTS "Enable Update for owners and collaborators" ON public.weddings;
CREATE POLICY "Enable Update for owners and collaborators" ON public.weddings
FOR UPDATE TO authenticated USING (
    user_id = auth.uid() OR 
    id IN (SELECT wedding_id FROM public.collaborators WHERE user_id = auth.uid())
);

-- Insert policy (Only owner logic applies, handled by default supabase insert setup or allow all authed)
DROP POLICY IF EXISTS "Enable Insert for authenticated users" ON public.weddings;
CREATE POLICY "Enable Insert for authenticated users" ON public.weddings
FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Delete policy (STRICTLY OWNER ONLY)
DROP POLICY IF EXISTS "Enable Delete ONLY for owners" ON public.weddings;
CREATE POLICY "Enable Delete ONLY for owners" ON public.weddings
FOR DELETE TO authenticated USING (user_id = auth.uid());


-- 4. Replace RLS on all child tables (guests, tasks, etc)
DO $$
DECLARE
    t text;
    tables text[] := ARRAY['budget_categories', 'tasks', 'guests', 'timeline_events', 'vendors', 'expenses', 'inspirations'];
BEGIN
    FOR t IN SELECT unnest(tables) LOOP
       EXECUTE format('DROP POLICY IF EXISTS "Enable ALL for actual collaborators" ON public.%I', t);
       EXECUTE format('
          CREATE POLICY "Enable ALL for actual collaborators" ON public.%I FOR ALL TO authenticated USING (
              wedding_id IN (
                  SELECT w.id FROM public.weddings w WHERE w.user_id = auth.uid()
                  UNION
                  SELECT c.wedding_id FROM public.collaborators c WHERE c.user_id = auth.uid()
              )
          )', t);
    END LOOP;
END
$$;

-- 5. Create secure RPC Function to Accept Invites
CREATE OR REPLACE FUNCTION public.accept_wedding_invite(invite_token uuid)
RETURNS json AS $$
DECLARE
   target_wedding_id uuid;
   target_role text;
BEGIN
   -- Verify auth
   IF auth.uid() IS NULL THEN
      RETURN json_build_object('success', false, 'error', 'You must be logged in to accept an invite');
   END IF;

   -- Find the invite
   SELECT wedding_id, role INTO target_wedding_id, target_role 
   FROM public.wedding_invites 
   WHERE token = invite_token AND expires_at > now();
   
   IF NOT FOUND THEN
      RETURN json_build_object('success', false, 'error', 'Invalid or expired invite link');
   END IF;
   
   -- Insert collaborator
   INSERT INTO public.collaborators (wedding_id, user_id, role)
   VALUES (target_wedding_id, auth.uid(), target_role)
   ON CONFLICT (wedding_id, user_id) DO NOTHING;
   
   -- Update user's active wedding
   UPDATE public.users SET active_wedding_id = target_wedding_id WHERE id = auth.uid();
   
   -- Optional: we can delete the invite if it's single use. For simplicity, we just keep it until it expires.
   
   RETURN json_build_object('success', true, 'wedding_id', target_wedding_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
