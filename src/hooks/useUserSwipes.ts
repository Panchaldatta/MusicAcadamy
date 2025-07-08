
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserSwipe {
  id: string;
  user_id: string;
  teacher_id: string;
  swipe_direction: 'left' | 'right';
  created_at: string;
}

export const useUserSwipes = () => {
  return useQuery({
    queryKey: ['user-swipes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_swipes')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user swipes:', error);
        throw error;
      }
      
      return data as UserSwipe[];
    },
  });
};

export const useCreateSwipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ teacher_id, swipe_direction }: { teacher_id: string; swipe_direction: 'left' | 'right' }) => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const { data, error } = await supabase
        .from('user_swipes')
        .upsert({
          user_id: user.id,
          teacher_id,
          swipe_direction,
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating swipe:', error);
        throw error;
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-swipes'] });
    },
  });
};

export const useSwipedTeachers = (direction?: 'left' | 'right') => {
  return useQuery({
    queryKey: ['swiped-teachers', direction],
    queryFn: async () => {
      let query = supabase
        .from('user_swipes')
        .select(`
          *,
          teachers (*)
        `)
        .order('created_at', { ascending: false });
      
      if (direction) {
        query = query.eq('swipe_direction', direction);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching swiped teachers:', error);
        throw error;
      }
      
      return data;
    },
  });
};
