
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ClassSession {
  id: string;
  classroom_id: string;
  teacher_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  student_count: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface CreateSessionData {
  classroom_id: string;
  session_date: string;
  start_time: string;
  end_time: string;
  student_count: number;
  location: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

interface UpdateSessionData extends Partial<CreateSessionData> {
  id: string;
}

export const useClassSessions = () => {
  return useQuery({
    queryKey: ['class-sessions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('class_sessions')
        .select(`
          *,
          classrooms!inner(name)
        `)
        .order('session_date', { ascending: true })
        .order('start_time', { ascending: true });

      if (error) {
        console.error('Error fetching class sessions:', error);
        throw error;
      }

      return data?.map(session => ({
        id: session.id,
        classroomId: session.classroom_id,
        classroomName: session.classrooms?.name || 'Unknown Classroom',
        date: new Date(session.session_date),
        startTime: session.start_time,
        endTime: session.end_time,
        students: session.student_count,
        location: session.location,
        status: session.status as 'scheduled' | 'completed' | 'cancelled',
        notes: session.notes
      })) || [];
    },
  });
};

export const useCreateClassSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionData: CreateSessionData) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('class_sessions')
        .insert([{
          ...sessionData,
          teacher_id: user.id
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating class session:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
      toast({
        title: "Success",
        description: "Class session scheduled successfully!",
      });
    },
    onError: (error) => {
      console.error('Failed to create class session:', error);
      toast({
        title: "Error",
        description: "Failed to schedule class session. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClassSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateSessionData) => {
      const { data, error } = await supabase
        .from('class_sessions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating class session:', error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
      toast({
        title: "Success",
        description: "Class session updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Failed to update class session:', error);
      toast({
        title: "Error",
        description: "Failed to update class session. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClassSession = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      const { error } = await supabase
        .from('class_sessions')
        .delete()
        .eq('id', sessionId);

      if (error) {
        console.error('Error deleting class session:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['class-sessions'] });
      toast({
        title: "Success",
        description: "Class session deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Failed to delete class session:', error);
      toast({
        title: "Error",
        description: "Failed to delete class session. Please try again.",
        variant: "destructive",
      });
    },
  });
};
