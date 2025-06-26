
-- Create teachers table
CREATE TABLE public.teachers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  subject TEXT NOT NULL,
  rating DECIMAL(2,1) NOT NULL DEFAULT 0,
  reviews INTEGER NOT NULL DEFAULT 0,
  price INTEGER NOT NULL,
  experience TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  specialties TEXT[] NOT NULL DEFAULT '{}',
  verified BOOLEAN DEFAULT false,
  response_time TEXT NOT NULL DEFAULT '< 1 hour',
  languages TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create music subjects table
CREATE TABLE public.music_subjects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  student_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create stats table for homepage statistics
CREATE TABLE public.site_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  value TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create profiles table for user management
CREATE TABLE public.profiles (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  role TEXT DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.music_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for teachers (public read, admin write)
CREATE POLICY "Anyone can view teachers" 
  ON public.teachers 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage teachers" 
  ON public.teachers 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for music subjects (public read, admin write)
CREATE POLICY "Anyone can view music subjects" 
  ON public.music_subjects 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage music subjects" 
  ON public.music_subjects 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for site stats (public read, admin write)
CREATE POLICY "Anyone can view site stats" 
  ON public.site_stats 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admins can manage site stats" 
  ON public.site_stats 
  FOR ALL 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Anyone can insert their profile" 
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, email)
  VALUES (
    new.id,
    new.raw_user_meta_data ->> 'first_name',
    new.raw_user_meta_data ->> 'last_name',
    new.email
  );
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Insert sample data for music subjects with Indian touch
INSERT INTO public.music_subjects (name, icon, color, student_count) VALUES
('Tabla', 'Drum', 'bg-orange-500', 1567),
('Sitar', 'Guitar', 'bg-yellow-500', 892),
('Harmonium', 'Piano', 'bg-red-500', 1234),
('Flute', 'Music2', 'bg-green-500', 743),
('Violin', 'Music2', 'bg-purple-500', 856),
('Classical Vocals', 'Mic', 'bg-pink-500', 1890),
('Veena', 'Guitar', 'bg-indigo-500', 456),
('Santoor', 'Piano', 'bg-blue-500', 623);

-- Insert sample data for site stats
INSERT INTO public.site_stats (label, value, display_order) VALUES
('Music Gurus', '15,000+', 1),
('Happy Students', '75,000+', 2),
('Lessons Completed', '3,00,000+', 3),
('Cities in India', '50+', 4);

-- Insert sample teachers data with Indian names and locations
INSERT INTO public.teachers (name, subject, rating, reviews, price, experience, location, image_url, specialties, verified, response_time, languages) VALUES
('Pandit Ravi Sharma', 'Tabla & Percussion', 4.9, 127, 800, '15 years', 'Mumbai, Maharashtra', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face', ARRAY['Classical', 'Folk', 'Fusion'], true, '< 30 min', ARRAY['Hindi', 'English']),
('Ustad Asha Bhosle', 'Classical Vocals & Hindustani', 5.0, 200, 1200, '20 years', 'Delhi, NCR', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face', ARRAY['Hindustani', 'Bhajan', 'Ghazal'], true, '< 15 min', ARRAY['Hindi', 'Urdu', 'English']),
('Maestro Vikram Singh', 'Sitar & String Instruments', 4.8, 156, 1000, '18 years', 'Jaipur, Rajasthan', 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face', ARRAY['Classical', 'Ragas', 'Folk'], true, '< 1 hour', ARRAY['Hindi', 'Rajasthani', 'English']),
('Guru Priya Nair', 'Harmonium & Devotional Music', 4.9, 89, 600, '12 years', 'Kochi, Kerala', 'https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=150&h=150&fit=crop&crop=face', ARRAY['Devotional', 'Classical', 'Bhajan'], true, '< 2 hours', ARRAY['Malayalam', 'Tamil', 'Hindi', 'English']);

-- Enable realtime for all tables
ALTER TABLE public.teachers REPLICA IDENTITY FULL;
ALTER TABLE public.music_subjects REPLICA IDENTITY FULL;
ALTER TABLE public.site_stats REPLICA IDENTITY FULL;
ALTER TABLE public.profiles REPLICA IDENTITY FULL;

-- Add tables to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;
ALTER PUBLICATION supabase_realtime ADD TABLE public.music_subjects;
ALTER PUBLICATION supabase_realtime ADD TABLE public.site_stats;
ALTER PUBLICATION supabase_realtime ADD TABLE public.profiles;
