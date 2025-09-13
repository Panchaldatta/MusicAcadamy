-- Fix all remaining infinite recursion issues in RLS policies across all tables

-- First, let's fix the remaining profiles policies that still have recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their profile (except role)" ON public.profiles;

-- Recreate profiles policies using the database function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

CREATE POLICY "Users can update their profile" 
ON public.profiles 
FOR UPDATE 
TO public
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Fix music_subjects policies
DROP POLICY IF EXISTS "Only admins can manage music subjects" ON public.music_subjects;
CREATE POLICY "Only admins can manage music subjects" 
ON public.music_subjects 
FOR ALL 
TO authenticated
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Fix gov_exam_roadmaps policies  
DROP POLICY IF EXISTS "Only admins can manage roadmaps" ON public.gov_exam_roadmaps;
CREATE POLICY "Only admins can manage roadmaps" 
ON public.gov_exam_roadmaps 
FOR ALL 
TO authenticated
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Fix admin_stats policies
DROP POLICY IF EXISTS "Only admins can view admin stats" ON public.admin_stats;
DROP POLICY IF EXISTS "Only admins can manage admin stats" ON public.admin_stats;

CREATE POLICY "Only admins can view admin stats" 
ON public.admin_stats 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

CREATE POLICY "Only admins can manage admin stats" 
ON public.admin_stats 
FOR ALL 
TO authenticated
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Fix teachers policies
DROP POLICY IF EXISTS "Only admins can manage teachers" ON public.teachers;
CREATE POLICY "Only admins can manage teachers" 
ON public.teachers 
FOR ALL 
TO authenticated
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');

-- Fix classroom_swipes policies
DROP POLICY IF EXISTS "Admins can view all classroom swipes" ON public.classroom_swipes;
CREATE POLICY "Admins can view all classroom swipes" 
ON public.classroom_swipes 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

-- Fix classrooms policies
DROP POLICY IF EXISTS "Admins can view all classrooms" ON public.classrooms;
CREATE POLICY "Admins can view all classrooms" 
ON public.classrooms 
FOR SELECT 
TO authenticated
USING (public.get_user_role() = 'admin');

-- Fix site_stats policies
DROP POLICY IF EXISTS "Only admins can manage site stats" ON public.site_stats;
CREATE POLICY "Only admins can manage site stats" 
ON public.site_stats 
FOR ALL 
TO authenticated
USING (public.get_user_role() = 'admin')
WITH CHECK (public.get_user_role() = 'admin');