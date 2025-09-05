-- Allow admins to view all profiles and classrooms for accurate admin metrics
-- Add RLS policy for admins to select all profiles
CREATE POLICY IF NOT EXISTS "Admins can view all profiles"
ON public.profiles
FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');

-- Add RLS policy for admins to select all classrooms
CREATE POLICY IF NOT EXISTS "Admins can view all classrooms"
ON public.classrooms
FOR SELECT
USING (public.get_user_role(auth.uid()) = 'admin');