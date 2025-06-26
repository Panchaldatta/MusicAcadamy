
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Teacher {
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
}

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .order('rating', { ascending: false });
      
      if (error) {
        console.error('Error fetching teachers:', error);
        throw error;
      }
      
      return data as Teacher[];
    },
  });
};
