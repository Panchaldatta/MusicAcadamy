
-- Add additional columns to the profiles table for a complete student profile
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS date_of_birth DATE,
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS zip_code VARCHAR(20),
ADD COLUMN IF NOT EXISTS country VARCHAR(100) DEFAULT 'United States',
ADD COLUMN IF NOT EXISTS emergency_contact_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS emergency_contact_phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS emergency_contact_relationship VARCHAR(100),
ADD COLUMN IF NOT EXISTS music_experience_level VARCHAR(50) DEFAULT 'beginner',
ADD COLUMN IF NOT EXISTS preferred_instruments TEXT[],
ADD COLUMN IF NOT EXISTS learning_goals TEXT,
ADD COLUMN IF NOT EXISTS availability TEXT,
ADD COLUMN IF NOT EXISTS timezone VARCHAR(100) DEFAULT 'America/New_York';

-- Create a table for student achievements
CREATE TABLE IF NOT EXISTS public.student_achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  date_earned DATE NOT NULL,
  category VARCHAR(100) DEFAULT 'general',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_achievements
ALTER TABLE public.student_achievements ENABLE ROW LEVEL SECURITY;

-- Create policies for student achievements
CREATE POLICY "Students can view their own achievements" 
  ON public.student_achievements 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own achievements" 
  ON public.student_achievements 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own achievements" 
  ON public.student_achievements 
  FOR UPDATE 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can delete their own achievements" 
  ON public.student_achievements 
  FOR DELETE 
  USING (auth.uid() = student_id);

-- Create a table for student preferences
CREATE TABLE IF NOT EXISTS public.student_preferences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL UNIQUE,
  lesson_duration_preference INTEGER DEFAULT 60,
  preferred_lesson_time VARCHAR(50),
  communication_preference VARCHAR(50) DEFAULT 'email',
  notification_settings JSONB DEFAULT '{"email": true, "sms": false, "push": true}',
  privacy_settings JSONB DEFAULT '{"profile_visible": true, "contact_visible": false}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_preferences
ALTER TABLE public.student_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for student preferences
CREATE POLICY "Students can view their own preferences" 
  ON public.student_preferences 
  FOR SELECT 
  USING (auth.uid() = student_id);

CREATE POLICY "Students can create their own preferences" 
  ON public.student_preferences 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update their own preferences" 
  ON public.student_preferences 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_student_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language plpgsql;

CREATE TRIGGER update_student_preferences_updated_at
  BEFORE UPDATE ON public.student_preferences
  FOR EACH ROW
  EXECUTE FUNCTION public.update_student_preferences_updated_at();
