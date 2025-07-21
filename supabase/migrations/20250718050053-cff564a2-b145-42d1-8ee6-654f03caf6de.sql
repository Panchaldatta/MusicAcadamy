
-- Create class_sessions table for storing scheduled classes
CREATE TABLE public.class_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id) ON DELETE CASCADE,
  teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  student_count INTEGER NOT NULL DEFAULT 0,
  location TEXT NOT NULL DEFAULT 'Online',
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add RLS policies for class_sessions
ALTER TABLE public.class_sessions ENABLE ROW LEVEL SECURITY;

-- Teachers can view their own sessions
CREATE POLICY "Teachers can view their own sessions" 
  ON public.class_sessions 
  FOR SELECT 
  USING (auth.uid() = teacher_id);

-- Teachers can create their own sessions
CREATE POLICY "Teachers can create their own sessions" 
  ON public.class_sessions 
  FOR INSERT 
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can update their own sessions
CREATE POLICY "Teachers can update their own sessions" 
  ON public.class_sessions 
  FOR UPDATE 
  USING (auth.uid() = teacher_id);

-- Teachers can delete their own sessions
CREATE POLICY "Teachers can delete their own sessions" 
  ON public.class_sessions 
  FOR DELETE 
  USING (auth.uid() = teacher_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for class_sessions
CREATE TRIGGER update_class_sessions_updated_at 
  BEFORE UPDATE ON public.class_sessions 
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_class_sessions_teacher_id ON public.class_sessions(teacher_id);
CREATE INDEX idx_class_sessions_classroom_id ON public.class_sessions(classroom_id);
CREATE INDEX idx_class_sessions_date ON public.class_sessions(session_date);
CREATE INDEX idx_class_sessions_status ON public.class_sessions(status);
