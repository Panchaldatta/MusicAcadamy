-- First, let's enhance the existing profiles table to support better authentication
-- Add missing constraints and improve the structure
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- Create an index for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_active ON public.profiles(is_active);

-- Update the trigger function to handle new user creation better
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    first_name, 
    last_name, 
    email, 
    role,
    is_active,
    email_verified
  )
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email,
    COALESCE(new.raw_user_meta_data ->> 'role', 'student'),
    true,
    COALESCE(new.email_confirmed_at IS NOT NULL, false)
  );
  RETURN new;
END;
$$;

-- Create trigger if it doesn't exist
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create a function to update profile when user email is confirmed
CREATE OR REPLACE FUNCTION public.handle_user_email_confirmed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  IF NEW.email_confirmed_at IS NOT NULL AND OLD.email_confirmed_at IS NULL THEN
    UPDATE public.profiles 
    SET email_verified = true 
    WHERE id = NEW.id;
  END IF;
  RETURN NEW;
END;
$$;

-- Create trigger for email confirmation
DROP TRIGGER IF EXISTS on_auth_user_email_confirmed ON auth.users;
CREATE TRIGGER on_auth_user_email_confirmed
  AFTER UPDATE ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_user_email_confirmed();

-- Enhanced RLS policies for profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert their profile" ON public.profiles;

-- More comprehensive RLS policies
CREATE POLICY "Users can view their own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
ON public.profiles
FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "System can insert profiles"
ON public.profiles
FOR INSERT
WITH CHECK (auth.uid() = id);

-- Teachers can view basic info of their students (for classrooms)
CREATE POLICY "Teachers can view student profiles for their classrooms"
ON public.profiles
FOR SELECT
USING (
  role = 'student' AND
  EXISTS (
    SELECT 1 FROM public.classroom_enrollments ce
    JOIN public.classrooms c ON c.id = ce.classroom_id
    WHERE ce.student_id = profiles.id 
    AND c.teacher_id = auth.uid()
  )
);

-- Create a secure function to check user roles
CREATE OR REPLACE FUNCTION public.get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role FROM public.profiles WHERE id = user_id;
$$;

-- Create a function to check if user is a teacher
CREATE OR REPLACE FUNCTION public.is_teacher(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role = 'teacher' FROM public.profiles WHERE id = user_id;
$$;

-- Create a function to check if user is a student
CREATE OR REPLACE FUNCTION public.is_student(user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT role = 'student' FROM public.profiles WHERE id = user_id;
$$;