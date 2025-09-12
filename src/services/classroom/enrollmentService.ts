import { supabase } from "@/integrations/supabase/client";

export interface ClassroomEnrollment {
  id: string;
  classroom_id: string;
  student_id: string;
  enrolled_at: string;
  status: 'active' | 'completed' | 'paused';
  classrooms?: {
    id: string;
    name: string;
    subject: string;
    duration_weeks: number;
    session_duration_minutes: number;
    sessions_per_week: number;
    level: string;
    image_url?: string;
    description?: string;
    teachers?: {
      name: string;
    };
  };
}

export class EnrollmentService {
  static async getStudentEnrollments(studentId: string): Promise<ClassroomEnrollment[]> {
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .select(`
        id,
        classroom_id,
        student_id,
        enrolled_at,
        status,
        classrooms (
          id,
          name,
          subject,
          duration_weeks,
          session_duration_minutes,
          sessions_per_week,
          level,
          image_url,
          description,
          teachers (
            name
          )
        )
      `)
      .eq('student_id', studentId)
      .order('enrolled_at', { ascending: false });

    if (error) {
      console.error('Error fetching enrollments:', error);
      throw error;
    }

    return (data || []) as unknown as ClassroomEnrollment[];
  }

  static async enrollStudent(studentId: string, classroomId: string): Promise<ClassroomEnrollment> {
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .insert({
        student_id: studentId,
        classroom_id: classroomId,
        status: 'active'
      })
      .select()
      .single();

    if (error) {
      console.error('Error enrolling student:', error);
      throw error;
    }

    return data as unknown as ClassroomEnrollment;
  }

  static async updateEnrollmentStatus(
    enrollmentId: string, 
    status: 'active' | 'completed' | 'paused'
  ): Promise<ClassroomEnrollment> {
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .update({ status })
      .eq('id', enrollmentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating enrollment status:', error);
      throw error;
    }

    return data as unknown as ClassroomEnrollment;
  }
}