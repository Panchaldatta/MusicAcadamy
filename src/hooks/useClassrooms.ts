
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
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useActiveClassrooms = () => {
  return useQuery({
    queryKey: ['active-classrooms'],
    queryFn: ClassroomService.getActiveClassrooms,
    retry: 3,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useCreateClassroom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (classroom: Omit<ClassroomInsert, 'teacher_id'>) => 
      ClassroomService.createClassroom(classroom),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['active-classrooms'] });
      toast({
        title: "Classroom Created Successfully!",
        description: `"${data.name}" has been created and is now active.`,
      });
    },
    onError: (error: any) => {
      console.error('Error creating classroom:', error);
      toast({
        title: "Failed to Create Classroom",
        description: error.message || "Please check your information and try again.",
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
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['teacher-classrooms'] });
      queryClient.invalidateQueries({ queryKey: ['active-classrooms'] });
      toast({
        title: "Classroom Updated Successfully!",
        description: `"${data.name}" has been updated.`,
      });
    },
    onError: (error: any) => {
      console.error('Error updating classroom:', error);
      toast({
        title: "Failed to Update Classroom",
        description: error.message || "Please try again later.",
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
        description: "The classroom has been permanently removed.",
      });
    },
    onError: (error: any) => {
      console.error('Error deleting classroom:', error);
      toast({
        title: "Failed to Delete Classroom",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });
};

export const useClassroomEnrollmentCount = (classroomId: string) => {
  return useQuery({
    queryKey: ['classroom-enrollment-count', classroomId],
    queryFn: () => ClassroomService.getClassroomEnrollmentCount(classroomId),
    enabled: !!classroomId,
  });
};
