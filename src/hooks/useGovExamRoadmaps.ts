import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface GovExamRoadmap {
  id: string;
  exam_name: string;
  category: string;
  description: string;
  duration_months: number;
  difficulty_level: string;
  syllabus: any;
  milestones: Array<{
    id: number;
    title: string;
    description: string;
    duration_weeks: number;
  }>;
  resources: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface UserRoadmapProgress {
  id: string;
  user_id: string;
  roadmap_id: string;
  current_milestone: number;
  completed_milestones: number[];
  started_at: string;
  last_updated: string;
}

export const useGovExamRoadmaps = () => {
  return useQuery({
    queryKey: ['gov-exam-roadmaps'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('gov_exam_roadmaps')
        .select('*')
        .eq('is_active', true)
        .ilike('category', '%music%')
        .order('exam_name');

      if (error) throw error;
      return data as GovExamRoadmap[];
    },
  });
};

export const useUserRoadmapProgress = (userId?: string) => {
  return useQuery({
    queryKey: ['user-roadmap-progress', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from('user_roadmap_progress')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;
      return data as UserRoadmapProgress[];
    },
    enabled: !!userId,
  });
};

export const useStartRoadmap = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ roadmapId, userId }: { roadmapId: string; userId: string }) => {
      const { data, error } = await supabase
        .from('user_roadmap_progress')
        .upsert({
          user_id: userId,
          roadmap_id: roadmapId,
          current_milestone: 1,
          completed_milestones: [],
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roadmap-progress'] });
    },
  });
};

export const useUpdateMilestone = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ 
      progressId, 
      milestoneId, 
      completed 
    }: { 
      progressId: string; 
      milestoneId: number; 
      completed: boolean;
    }) => {
      // First get the current progress
      const { data: currentProgress, error: fetchError } = await supabase
        .from('user_roadmap_progress')
        .select('*')
        .eq('id', progressId)
        .single();

      if (fetchError) throw fetchError;

      let completedMilestones = Array.isArray(currentProgress.completed_milestones) 
        ? currentProgress.completed_milestones as number[]
        : [];
      
      if (completed && !completedMilestones.includes(milestoneId)) {
        completedMilestones.push(milestoneId);
      } else if (!completed) {
        completedMilestones = completedMilestones.filter((id: number) => id !== milestoneId);
      }

      const { data, error } = await supabase
        .from('user_roadmap_progress')
        .update({
          completed_milestones: completedMilestones,
          current_milestone: completedMilestones.length > 0 ? Math.max(...completedMilestones) + 1 : 1,
        })
        .eq('id', progressId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-roadmap-progress'] });
    },
  });
};