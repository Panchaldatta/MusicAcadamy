import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface TeacherSession {
  id: string;
  classroom_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  student_count: number;
  location: string;
  status: string;
  notes?: string;
  classroom?: {
    name: string;
  };
}

export const useTeacherSessions = (limit?: number) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['teacher-sessions', user?.id, limit],
    queryFn: async (): Promise<TeacherSession[]> => {
      if (!user?.id) throw new Error('User not authenticated');

      let query = supabase
        .from('class_sessions')
        .select(`
          id,
          classroom_id,
          session_date,
          start_time,
          end_time,
          student_count,
          location,
          status,
          notes,
          classrooms!inner (
            name
          )
        `)
        .eq('teacher_id', user.id)
        .gte('session_date', new Date().toISOString().split('T')[0]) // Only future/today sessions
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (limit) {
        query = query.limit(limit);
      }

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(session => ({
        ...session,
        classroom: session.classrooms
      })) as TeacherSession[];
    },
    enabled: !!user?.id
  });
};

export const useUpcomingTeacherSessions = () => {
  return useTeacherSessions(5);
};