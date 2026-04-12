-- ============================================================
-- EMERGENCY FIX: Drop ALL collaboration policies, then recreate cleanly
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================================

-- ==================== STEP 1: NUKE ALL BAD POLICIES ====================

-- Drop ALL policies on weddings (old and new, every possible name)
DROP POLICY IF EXISTS "Enable ALL for users based on user_id" ON public.weddings;
DROP POLICY IF EXISTS "Enable Read for owners and collaborators" ON public.weddings;
DROP POLICY IF EXISTS "Enable Update for owners and collaborators" ON public.weddings;
DROP POLICY IF EXISTS "Enable Insert for authenticated users" ON public.weddings;
DROP POLICY IF EXISTS "Enable Delete ONLY for owners" ON public.weddings;

-- Drop all policies on collaborators
DO $$
BEGIN
  DROP POLICY IF EXISTS "Users can view their own collaboration links" ON public.collaborators;
  DROP POLICY IF EXISTS "Collaborators can view by direct user match" ON public.collaborators;
  DROP POLICY IF EXISTS "Owners can remove collaborators" ON public.collaborators;
  DROP POLICY IF EXISTS "Owners can manage collaborators" ON public.collaborators;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Drop all policies on wedding_invites
DO $$
BEGIN
  DROP POLICY IF EXISTS "Owners can view and create their invites" ON public.wedding_invites;
EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- Drop child table policies
DO $$
DECLARE
    t text;
    tables text[] := ARRAY['budget_categories', 'tasks', 'guests', 'timeline_events', 'vendors', 'expenses', 'inspirations'];
BEGIN
    FOR t IN SELECT unnest(tables) LOOP
       EXECUTE format('DROP POLICY IF EXISTS "Enable ALL for actual collaborators" ON public.%I', t);
    END LOOP;
END $$;


-- ==================== STEP 2: RESTORE SIMPLE WORKING POLICY ON WEDDINGS ====================
-- This is the ORIGINAL simple policy that was working before collaboration was added

CREATE POLICY "Enable ALL for users based on user_id" ON public.weddings
FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);


-- ==================== STEP 3: CREATE COLLABORATION TABLES ====================

CREATE TABLE IF NOT EXISTS public.collaborators (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'partner',
    created_at timestamp with time zone DEFAULT now(),
    UNIQUE(wedding_id, user_id)
);
ALTER TABLE public.collaborators ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.wedding_invites (
    token uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    wedding_id uuid NOT NULL REFERENCES public.weddings(id) ON DELETE CASCADE,
    created_by uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role text NOT NULL DEFAULT 'partner',
    expires_at timestamp with time zone NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);
ALTER TABLE public.wedding_invites ENABLE ROW LEVEL SECURITY;


-- ==================== STEP 4: SAFE NON-RECURSIVE POLICIES ====================

-- Collaborators: simple direct check, NO subquery to weddings
CREATE POLICY "collab_own_rows" ON public.collaborators
    FOR ALL TO authenticated USING (user_id = auth.uid());

-- Wedding invites: simple direct check
CREATE POLICY "invite_own_rows" ON public.wedding_invites
    FOR ALL TO authenticated USING (created_by = auth.uid());


-- ==================== STEP 5: ADD COLLABORATOR ACCESS TO WEDDINGS ====================
-- This is the ONLY cross-table policy. It queries collaborators which has
-- a simple user_id check — NO recursion possible.

CREATE POLICY "collab_read_weddings" ON public.weddings
FOR SELECT TO authenticated USING (
    id IN (SELECT c.wedding_id FROM public.collaborators c WHERE c.user_id = auth.uid())
);

CREATE POLICY "collab_update_weddings" ON public.weddings
FOR UPDATE TO authenticated USING (
    id IN (SELECT c.wedding_id FROM public.collaborators c WHERE c.user_id = auth.uid())
);


-- ==================== STEP 6: CHILD TABLES - USE SIMPLE UNION APPROACH ====================
DO $$
DECLARE
    t text;
    tables text[] := ARRAY['budget_categories', 'tasks', 'guests', 'timeline_events', 'vendors', 'expenses', 'inspirations'];
BEGIN
    FOR t IN SELECT unnest(tables) LOOP
       EXECUTE format('
          CREATE POLICY "collab_access" ON public.%I 
          FOR ALL TO authenticated USING (
              wedding_id IN (
                  SELECT c.wedding_id FROM public.collaborators c WHERE c.user_id = auth.uid()
              )
          )', t);
    END LOOP;
END $$;


-- ==================== STEP 7: INVITE ACCEPT RPC ====================
CREATE OR REPLACE FUNCTION public.accept_wedding_invite(invite_token uuid)
RETURNS json AS $$
DECLARE
   target_wedding_id uuid;
   target_role text;
BEGIN
   IF auth.uid() IS NULL THEN
      RETURN json_build_object('success', false, 'error', 'You must be logged in');
   END IF;

   SELECT wedding_id, role INTO target_wedding_id, target_role 
   FROM public.wedding_invites 
   WHERE token = invite_token AND expires_at > now();
   
   IF NOT FOUND THEN
      RETURN json_build_object('success', false, 'error', 'Invalid or expired invite link');
   END IF;
   
   INSERT INTO public.collaborators (wedding_id, user_id, role)
   VALUES (target_wedding_id, auth.uid(), target_role)
   ON CONFLICT (wedding_id, user_id) DO NOTHING;
   
   UPDATE public.users SET active_wedding_id = target_wedding_id WHERE id = auth.uid();
   
   RETURN json_build_object('success', true, 'wedding_id', target_wedding_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
