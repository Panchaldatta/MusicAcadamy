
-- Create a table to store user swipes
CREATE TABLE public.user_swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  teacher_id UUID REFERENCES public.teachers(id) NOT NULL,
  swipe_direction TEXT NOT NULL CHECK (swipe_direction IN ('left', 'right')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, teacher_id)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.user_swipes ENABLE ROW LEVEL SECURITY;

-- Create policies for user swipes
CREATE POLICY "Users can view their own swipes" 
  ON public.user_swipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own swipes" 
  ON public.user_swipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swipes" 
  ON public.user_swipes 
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swipes" 
  ON public.user_swipes 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_user_swipes_user_id ON public.user_swipes(user_id);
CREATE INDEX idx_user_swipes_teacher_id ON public.user_swipes(teacher_id);
CREATE INDEX idx_user_swipes_direction ON public.user_swipes(swipe_direction);
