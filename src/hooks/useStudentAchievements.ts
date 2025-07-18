
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export const useStudentAchievements = () => {
  const { profile } = useAuth();
  const [achievementsCount, setAchievementsCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAchievementsCount = async () => {
      if (!profile?.id) {
        setIsLoading(false);
        return;
      }

      try {
        const { count, error } = await supabase
          .from('student_achievements')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', profile.id);

        if (error) {
          console.error('Error fetching achievements count:', error);
        } else {
          setAchievementsCount(count || 0);
        }
      } catch (error) {
        console.error('Error fetching achievements count:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAchievementsCount();
  }, [profile?.id]);

  return { achievementsCount, isLoading };
};
