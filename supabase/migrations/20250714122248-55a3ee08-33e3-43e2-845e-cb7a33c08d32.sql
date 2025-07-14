
-- Create an admin_stats table for dashboard metrics
CREATE TABLE public.admin_stats (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value NUMERIC NOT NULL DEFAULT 0,
  metric_category TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create classroom_swipes table to track classroom swipe history
CREATE TABLE public.classroom_swipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  classroom_id UUID NOT NULL REFERENCES public.classrooms(id),
  swipe_direction TEXT NOT NULL CHECK (swipe_direction IN ('left', 'right')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for admin_stats
ALTER TABLE public.admin_stats ENABLE ROW LEVEL SECURITY;

-- Enable RLS for classroom_swipes
ALTER TABLE public.classroom_swipes ENABLE ROW LEVEL SECURITY;

-- RLS policies for admin_stats (only admins can access)
CREATE POLICY "Only admins can view admin stats" 
  ON public.admin_stats 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Only admins can manage admin stats" 
  ON public.admin_stats 
  FOR ALL 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- RLS policies for classroom_swipes
CREATE POLICY "Users can view their own classroom swipes" 
  ON public.classroom_swipes 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own classroom swipes" 
  ON public.classroom_swipes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all classroom swipes" 
  ON public.classroom_swipes 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role = 'admin'
  ));

-- Insert some initial admin stats
INSERT INTO public.admin_stats (metric_name, metric_value, metric_category) VALUES
('total_users', 0, 'users'),
('total_teachers', 0, 'users'),
('total_students', 0, 'users'),
('total_classrooms', 0, 'content'),
('active_classrooms', 0, 'content'),
('total_swipes', 0, 'engagement'),
('monthly_signups', 0, 'growth');
