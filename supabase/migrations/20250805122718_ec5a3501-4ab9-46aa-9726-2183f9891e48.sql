-- Create government exam roadmaps table
CREATE TABLE public.gov_exam_roadmaps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  exam_name TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  duration_months INTEGER NOT NULL DEFAULT 12,
  difficulty_level TEXT NOT NULL DEFAULT 'intermediate',
  syllabus JSONB,
  milestones JSONB,
  resources JSONB,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.gov_exam_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users to view roadmaps
CREATE POLICY "Authenticated users can view active roadmaps" 
ON public.gov_exam_roadmaps 
FOR SELECT 
TO authenticated
USING (is_active = true);

-- Only admins can manage roadmaps
CREATE POLICY "Only admins can manage roadmaps" 
ON public.gov_exam_roadmaps 
FOR ALL 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM profiles 
  WHERE id = auth.uid() AND role = 'admin'
));

-- Create user roadmap progress table
CREATE TABLE public.user_roadmap_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  roadmap_id UUID NOT NULL REFERENCES public.gov_exam_roadmaps(id) ON DELETE CASCADE,
  current_milestone INTEGER NOT NULL DEFAULT 1,
  completed_milestones JSONB DEFAULT '[]',
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, roadmap_id)
);

-- Enable RLS for user progress
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- Users can only manage their own progress
CREATE POLICY "Users can manage their own roadmap progress" 
ON public.user_roadmap_progress 
FOR ALL 
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Insert sample government exam roadmaps
INSERT INTO public.gov_exam_roadmaps (exam_name, category, description, duration_months, difficulty_level, syllabus, milestones, resources) VALUES
('UPSC Civil Services', 'Civil Services', 'Comprehensive preparation for UPSC Civil Services Examination', 18, 'advanced', 
  '{"prelims": ["History", "Geography", "Polity", "Economics", "Environment", "Science & Technology"], "mains": ["Essay", "General Studies I-IV", "Optional Subject"], "interview": ["Personality Test", "Current Affairs"]}',
  '[{"id": 1, "title": "Foundation Building", "description": "Build strong fundamentals in all subjects", "duration_weeks": 12}, {"id": 2, "title": "Prelims Preparation", "description": "Focus on MCQ practice and current affairs", "duration_weeks": 16}, {"id": 3, "title": "Mains Preparation", "description": "Answer writing practice and essay writing", "duration_weeks": 20}, {"id": 4, "title": "Interview Preparation", "description": "Mock interviews and personality development", "duration_weeks": 8}]',
  '{"books": ["NCERT Textbooks", "Laxmikanth Polity", "Spectrum Geography"], "websites": ["PIB", "The Hindu", "Indian Express"], "test_series": ["Vision IAS", "Insights IAS", "ForumIAS"]}'),

('SSC CGL', 'Staff Selection Commission', 'Preparation for SSC Combined Graduate Level Examination', 8, 'intermediate',
  '{"tier1": ["General Intelligence", "General Awareness", "Quantitative Aptitude", "English Comprehension"], "tier2": ["Quantitative Abilities", "English Language", "Statistics", "General Studies"]}',
  '[{"id": 1, "title": "Basic Concepts", "description": "Clear fundamentals in all four sections", "duration_weeks": 8}, {"id": 2, "title": "Practice Phase", "description": "Solve previous year papers and mock tests", "duration_weeks": 12}, {"id": 3, "title": "Revision & Test Series", "description": "Intensive revision and full-length tests", "duration_weeks": 8}, {"id": 4, "title": "Final Preparation", "description": "Last minute revision and strategy", "duration_weeks": 4}]',
  '{"books": ["RS Aggarwal Quantitative Aptitude", "Wren & Martin English", "Lucent GK"], "apps": ["SSC Adda", "Testbook", "Oliveboard"], "youtube": ["Adda247", "Study IQ", "Unacademy"]}'),

('Bank PO', 'Banking', 'Preparation for Bank Probationary Officer Examinations', 6, 'intermediate',
  '{"prelims": ["English Language", "Quantitative Aptitude", "Reasoning Ability"], "mains": ["Reasoning & Computer Aptitude", "General/Economy/Banking Awareness", "English Language", "Data Analysis & Interpretation"], "interview": ["Personal Interview", "Group Discussion"]}',
  '[{"id": 1, "title": "Conceptual Clarity", "description": "Master basic concepts in all sections", "duration_weeks": 6}, {"id": 2, "title": "Speed Building", "description": "Improve accuracy and speed through practice", "duration_weeks": 8}, {"id": 3, "title": "Mock Tests", "description": "Regular mock tests and analysis", "duration_weeks": 6}, {"id": 4, "title": "Interview Prep", "description": "Prepare for final interview round", "duration_weeks": 4}]',
  '{"books": ["Quantitative Aptitude by RS Aggarwal", "Verbal & Non-Verbal Reasoning by RS Aggarwal", "Banking Awareness by Arihant"], "websites": ["Banking Awareness Portal", "Current Affairs Today"], "coaching": ["Bankers Adda", "Oliveboard", "Testbook"]}');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_gov_exam_roadmaps_updated_at
BEFORE UPDATE ON public.gov_exam_roadmaps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roadmap_progress_updated_at
BEFORE UPDATE ON public.user_roadmap_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();