
-- Create a table for lesson bookings
CREATE TABLE public.lesson_bookings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES auth.users NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  lesson_date TIMESTAMP WITH TIME ZONE NOT NULL,
  lesson_duration INTEGER NOT NULL DEFAULT 60, -- duration in minutes
  price DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to ensure users can only see their own bookings
ALTER TABLE public.lesson_bookings ENABLE ROW LEVEL SECURITY;

-- Create policy that allows students to view their own bookings
CREATE POLICY "Students can view their own bookings" 
  ON public.lesson_bookings 
  FOR SELECT 
  USING (auth.uid() = student_id);

-- Create policy that allows students to create their own bookings
CREATE POLICY "Students can create their own bookings" 
  ON public.lesson_bookings 
  FOR INSERT 
  WITH CHECK (auth.uid() = student_id);

-- Create policy that allows students to update their own bookings
CREATE POLICY "Students can update their own bookings" 
  ON public.lesson_bookings 
  FOR UPDATE 
  USING (auth.uid() = student_id);

-- Create policy that allows students to delete their own bookings
CREATE POLICY "Students can delete their own bookings" 
  ON public.lesson_bookings 
  FOR DELETE 
  USING (auth.uid() = student_id);
