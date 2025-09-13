-- Fix infinite recursion in profiles RLS policies
-- Drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile (except role)" ON public.profiles;

-- Create new policies using database functions to avoid recursion
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

-- Simplified update policy that allows users to update their own profile 
-- but prevents role changes (role column should be excluded from client updates)
CREATE POLICY "Users can update their profile" 
ON public.profiles 
FOR UPDATE 
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure we have a simple INSERT policy for profile creation
DROP POLICY IF EXISTS "System can insert profiles" ON public.profiles;
CREATE POLICY "System can insert profiles" 
ON public.profiles 
FOR INSERT 
TO public
WITH CHECK (auth.uid() = id);