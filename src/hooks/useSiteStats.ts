
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface SiteStat {
  id: string;
  label: string;
  value: string;
  display_order: number;
}

export const useSiteStats = () => {
  return useQuery({
    queryKey: ['site_stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_stats')
        .select('*')
        .order('display_order', { ascending: true });
      
      if (error) {
        console.error('Error fetching site stats:', error);
        throw error;
      }
      
      return data as SiteStat[];
    },
  });
};
