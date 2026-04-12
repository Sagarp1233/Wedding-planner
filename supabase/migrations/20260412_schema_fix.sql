-- 1. Create App Config Table
CREATE TABLE IF NOT EXISTS public.app_config (
    id smallint PRIMARY KEY DEFAULT 1,
    free_plan_limit smallint NOT NULL DEFAULT 1,
    pro_plan_limit smallint NOT NULL DEFAULT 5,
    CONSTRAINT single_row CHECK (id = 1)
);

-- Seed initial row
INSERT INTO public.app_config (id, free_plan_limit, pro_plan_limit) 
VALUES (1, 1, 5) 
ON CONFLICT (id) DO NOTHING;

-- Revoke all to public, allow reading for authenticated users
ALTER TABLE public.app_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read access to authenticated users" ON public.app_config FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow full access to admin" ON public.app_config FOR ALL TO authenticated USING (
    auth.jwt() ->> 'email' = 'admin@wedora.in' OR 
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
);


-- 2. Create Public Users Table
CREATE TABLE IF NOT EXISTS public.users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL,
    name text,
    is_onboarded boolean NOT NULL DEFAULT false,
    active_wedding_id uuid REFERENCES public.weddings(id) ON DELETE SET NULL,
    plan text NOT NULL DEFAULT 'free',
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view their own profile" ON public.users 
    FOR SELECT TO authenticated USING (auth.uid() = id);

-- Allow users to update their own profile (e.g. for active_wedding_id or is_onboarded)
CREATE POLICY "Users can update their own profile" ON public.users 
    FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Allow admin full access
CREATE POLICY "Admin can view all users" ON public.users 
    FOR ALL TO authenticated USING (
        auth.jwt() ->> 'email' = 'admin@wedora.in' OR 
        (auth.jwt() -> 'user_metadata' ->> 'role') = 'admin'
    );

-- 3. Create Trigger to Auto-create Public User on Auth User Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, name, plan)
  VALUES (
      new.id, 
      new.email, 
      new.raw_user_meta_data->>'full_name',
      COALESCE(new.raw_user_meta_data->>'plan', 'free')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 4. Backfill existing users
INSERT INTO public.users (id, email, name, plan)
SELECT 
    id, 
    email, 
    raw_user_meta_data->>'full_name',
    COALESCE(raw_user_meta_data->>'plan', 'free')
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users);

-- Backfill 'is_onboarded' for existing users who already have weddings
UPDATE public.users u
SET is_onboarded = true
WHERE EXISTS (SELECT 1 FROM public.weddings w WHERE w.user_id = u.id);

-- Backfill 'active_wedding_id' with their first wedding if not set
UPDATE public.users u
SET active_wedding_id = subquery.id
FROM (
    SELECT DISTINCT ON (user_id) user_id, id 
    FROM public.weddings 
    ORDER BY user_id, created_at DESC
) AS subquery
WHERE u.id = subquery.user_id AND u.active_wedding_id IS NULL;


-- 5. Fix RLS on weddings table to ensure strictly user_id = auth.uid()
-- Assuming RLS is already enabled, we just want to ensure the policy exists.
-- (If it already exists, this might raise an error, but that's okay, you can ignore the duplicate policy error or execute these manually if needed)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' AND tablename = 'weddings' AND policyname = 'Enable ALL for users based on user_id'
    ) THEN
        CREATE POLICY "Enable ALL for users based on user_id" ON public.weddings
        FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
    END IF;
END
$$;
