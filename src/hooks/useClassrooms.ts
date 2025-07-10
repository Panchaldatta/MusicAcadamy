
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClassroomService } from '@/services/classroomService';
import { useToast } from '@/hooks/use-toast';
import type { Database } from "@/integrations/supabase/types";

type ClassroomInsert = Database['public']['Tables']['classrooms']['Insert'];
type ClassroomUpdate = Database['public']['Tables']['classrooms']['Update'];

export const useTeacherClassrooms = () => {
  return useQuery({
    queryKey: ['teacher-classrooms'],
    queryFn: ClassroomService.getTeacherClassrooms,
  });
};

export const useActiveClassrooms = () => {
  return useQuery({
    queryKey: ['active-classrooms'],
    queryFn: ClassroomService.getActiveClassrooms,
  });
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (classroom: Omit<ClassroomInsert, 'teacher_id'>) => 
      ClassroomService.createClassroom(classroom),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['active-classrooms'] });
      toast({
        title: "Classroom Created",
        description: "Your new classroom has been created successfully!",
      });
    },
    onError: (error) => {
      console.error('Error creating classroom:', error);
      toast({
        title: "Error",
        description: "Failed to create classroom. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ClassroomUpdate }) =>
      ClassroomService.updateClassroom(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['active-classrooms'] });
      toast({
        title: "Classroom Updated",
        description: "Your classroom has been updated successfully!",
      });
    },
    onError: (error) => {
      console.error('Error updating classroom:', error);
      toast({
        title: "Error",
        description: "Failed to update classroom. Please try again.",
        variant: "destructive",
      });
    },
  });
};

export const useDeleteClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ClassroomService.deleteClassroom,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['active-classrooms'] });
      toast({
        title: "Classroom Deleted",
        description: "Your classroom has been deleted successfully!",
      });
    },
    onError: (error) => {
      console.error('Error deleting classroom:', error);
      toast({
        title: "Error",
        description: "Failed to delete classroom. Please try again.",
        variant: "destructive",
      });
    },
  });
};
