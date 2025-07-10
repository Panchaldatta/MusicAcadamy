
-- Create a table for digital classrooms
CREATE TABLE public.classrooms (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  subject TEXT NOT NULL,
  level TEXT NOT NULL,
  schedule TEXT NOT NULL,
  price INTEGER NOT NULL DEFAULT 0,
  capacity INTEGER NOT NULL DEFAULT 20,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'draft')),
  image_url TEXT,
  materials TEXT[], -- Array of learning materials/resources
  prerequisites TEXT,
  duration_weeks INTEGER DEFAULT 12,
  sessions_per_week INTEGER DEFAULT 2,
  session_duration_minutes INTEGER DEFAULT 60,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure teachers can only manage their own classrooms
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;

-- Create policy that allows teachers to view their own classrooms
CREATE POLICY "Teachers can view their own classrooms" 
  ON public.classrooms 
  FOR SELECT 
  USING (auth.uid() = teacher_id);

-- Create policy that allows teachers to create their own classrooms
CREATE POLICY "Teachers can create their own classrooms" 
  ON public.classrooms 
  FOR INSERT 
  WITH CHECK (auth.uid() = teacher_id);

-- Create policy that allows teachers to update their own classrooms
CREATE POLICY "Teachers can update their own classrooms" 
  ON public.classrooms 
  FOR UPDATE 
  USING (auth.uid() = teacher_id);

-- Create policy that allows teachers to delete their own classrooms
CREATE POLICY "Teachers can delete their own classrooms" 
  ON public.classrooms 
  FOR DELETE 
  USING (auth.uid() = teacher_id);

-- Allow anyone to view active classrooms for browsing
CREATE POLICY "Anyone can view active classrooms" 
  ON public.classrooms 
  FOR SELECT 
  USING (status = 'active');

-- Create an enrollment table for students to join classrooms
CREATE TABLE public.classroom_enrollments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID REFERENCES public.classrooms(id) ON DELETE CASCADE NOT NULL,
  student_id UUID REFERENCES auth.users NOT NULL,
  enrolled_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE(classroom_id, student_id)
);

-- Enable RLS for enrollments
ALTER TABLE public.classroom_enrollments ENABLE ROW LEVEL SECURITY;

-- Students can view their own enrollments
CREATE POLICY "Students can view their own enrollments" 
  ON public.classroom_enrollments 
  FOR SELECT 
  USING (auth.uid() = student_id);

-- Students can enroll themselves
CREATE POLICY "Students can enroll themselves" 
  ON public.classroom_enrollments 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- Teachers can view enrollments for their classrooms
CREATE POLICY "Teachers can view their classroom enrollments" 
  ON public.classroom_enrollments 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.classrooms 
    WHERE classrooms.id = classroom_enrollments.classroom_id 
    AND classrooms.teacher_id = auth.uid()
  ));
