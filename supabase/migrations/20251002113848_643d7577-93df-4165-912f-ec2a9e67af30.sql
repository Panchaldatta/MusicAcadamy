-- Step 1: Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'teacher', 'student');

-- Step 2: Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role app_role NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Step 3: Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Step 4: Create function to get user roles
CREATE OR REPLACE FUNCTION public.get_user_roles(_user_id uuid DEFAULT auth.uid())
RETURNS SETOF app_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.user_roles
  WHERE user_id = _user_id
$$;

-- Step 5: RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage all roles"
ON public.user_roles
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Step 6: Migrate existing role data from profiles to user_roles
INSERT INTO public.user_roles (user_id, role)
SELECT id, role::app_role
FROM public.profiles
WHERE role IS NOT NULL
ON CONFLICT (user_id, role) DO NOTHING;

-- Step 7: Update the handle_new_user trigger function to insert into user_roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  user_role text;
BEGIN
  -- Insert profile
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    is_active,
    email_verified,
    google_id,
    provider,
    avatar_url
  )
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'given_name'),
    COALESCE(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'family_name'),
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    true,
    COALESCE(new.email_confirmed_at IS NOT NULL, true),
    new.raw_user_meta_data ->> 'sub',
    COALESCE(new.raw_user_meta_data ->> 'provider', 'google'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Insert role into user_roles table
  user_role := COALESCE(new.raw_user_meta_data ->> 'role', 'student');
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, user_role::app_role)
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN new;
END;
$$;

-- Step 8: Update assign_user_role function to use user_roles table
CREATE OR REPLACE FUNCTION public.assign_user_role(user_id uuid, new_role text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow admins to assign roles
  IF NOT public.has_role(auth.uid(), 'admin') THEN
    RAISE EXCEPTION 'Unauthorized: Only admins can assign roles';
  END IF;

  -- Validate role
  IF new_role NOT IN ('student', 'teacher', 'admin') THEN
    RAISE EXCEPTION 'Invalid role: %', new_role;
  END IF;

  -- Update in profiles table (for backwards compatibility)
  UPDATE public.profiles 
  SET role = new_role, updated_at = now()
  WHERE id = user_id;
  
  -- Insert into user_roles table
  INSERT INTO public.user_roles (user_id, role)
  VALUES (user_id, new_role::app_role)
  ON CONFLICT (user_id, role) DO UPDATE
  SET updated_at = now();
END;
$$;

-- Step 9: Create helper function to get primary role (for backwards compatibility)
CREATE OR REPLACE FUNCTION public.get_primary_role(_user_id uuid DEFAULT auth.uid())
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role::text
  FROM public.user_roles
  WHERE user_id = _user_id
  ORDER BY 
    CASE role
      WHEN 'admin' THEN 1
      WHEN 'teacher' THEN 2
      WHEN 'student' THEN 3
    END
  LIMIT 1
$$;

-- Step 10: Update RLS policy for admin_stats to use new function
DROP POLICY IF EXISTS "Only admins can view admin stats" ON public.admin_stats;
DROP POLICY IF EXISTS "Only admins can manage admin stats" ON public.admin_stats;

CREATE POLICY "Only admins can view admin stats"
ON public.admin_stats
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can manage admin stats"
ON public.admin_stats
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));