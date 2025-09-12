import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { EnrollmentService, ClassroomEnrollment } from '@/services/classroom/enrollmentService';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

export const useStudentEnrollments = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ['student-enrollments', user?.id],
    queryFn: () => user?.id ? EnrollmentService.getStudentEnrollments(user.id) : [],
    enabled: !!user?.id,
  });
};

export const useEnrollStudent = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentId, classroomId }: { studentId: string; classroomId: string }) =>
      EnrollmentService.enrollStudent(studentId, classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      toast({
        title: "Success",
        description: "Successfully enrolled in classroom!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to enroll in classroom",
        variant: "destructive",
      });
    },
  });
};

export const useUpdateEnrollmentStatus = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ enrollmentId, status }: { enrollmentId: string; status: 'active' | 'completed' | 'paused' }) =>
      EnrollmentService.updateEnrollmentStatus(enrollmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['student-enrollments'] });
      toast({
        title: "Success",
        description: "Enrollment status updated successfully!",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update enrollment status",
        variant: "destructive",
      });
    },
  });
};