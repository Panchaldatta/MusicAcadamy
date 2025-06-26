
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface MusicSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  student_count: number;
}

export const useMusicSubjects = () => {
  return useQuery({
    queryKey: ['music_subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('music_subjects')
        .select('*')
        .order('student_count', { ascending: false });
      
      if (error) {
        console.error('Error fetching music subjects:', error);
        throw error;
      }
      
      return data as MusicSubject[];
    },
  });
};
