
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface UserSwipe {
  id: string;
  user_id: string;
  teacher_id: string;
  swipe_direction: 'left' | 'right';
  created_at: string;
  teacher?: {
    id: string;
    name: string;
    subject: string;
    rating: number;
    reviews: number;
    price: number;
    experience: string;
    location: string;
    image_url?: string;
    specialties: string[];
    verified: boolean;
    response_time: string;
    languages: string[];
  };
}

export const useUserSwipes = () => {
  return useQuery({
    queryKey: ['user-swipes'],
    queryFn: async () => {
      console.log('Fetching user swipes...');
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user');
        return [];
      }

      const { data, error } = await supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching user swipes:', error);
        throw error;
      }
      
      console.log('User swipes fetched:', data);
      return data as UserSwipe[];
    },
  });
};

export const useCreateSwipe = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ teacher_id, swipe_direction }: { teacher_id: string; swipe_direction: 'left' | 'right' }) => {
      console.log('Creating swipe:', { teacher_id, swipe_direction });
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('User not authenticated');
        throw new Error('User not authenticated');
      }

      console.log('User authenticated:', user.id);

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
      
      console.log('Swipe created successfully:', data);
      return data;
    },
    onSuccess: (data) => {
      console.log('Swipe mutation successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['user-swipes'] });
      queryClient.invalidateQueries({ queryKey: ['swiped-teachers'] });
    },
    onError: (error) => {
      console.error('Swipe mutation failed:', error);
    }
  });
};

export const useSwipedTeachers = (direction?: 'left' | 'right') => {
  return useQuery({
    queryKey: ['swiped-teachers', direction],
    queryFn: async () => {
      console.log('Fetching swiped teachers with direction:', direction);
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user');
        return [];
      }

      // First get the swipes
      let swipesQuery = supabase
        .from('user_swipes')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      
      if (direction) {
        swipesQuery = swipesQuery.eq('swipe_direction', direction);
      }
      
      const { data: swipes, error: swipesError } = await swipesQuery;
      
      if (swipesError) {
        console.error('Error fetching swiped teachers:', swipesError);
        throw swipesError;
      }

      if (!swipes || swipes.length === 0) {
        console.log('No swipes found');
        return [];
      }

      // Then get the teacher data for each swipe
      const teacherIds = swipes.map(swipe => swipe.teacher_id);
      
      const { data: teachers, error: teachersError } = await supabase
        .from('teachers')
        .select('*')
        .in('id', teacherIds);
      
      if (teachersError) {
        console.error('Error fetching teachers:', teachersError);
        throw teachersError;
      }

      // Combine swipes with teacher data
      const swipedTeachers = swipes.map(swipe => ({
        ...swipe,
        teacher: teachers?.find(teacher => teacher.id === swipe.teacher_id)
      }));
      
      console.log('Swiped teachers fetched:', swipedTeachers);
      return swipedTeachers as UserSwipe[];
    },
  });
};
