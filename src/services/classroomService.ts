
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];
type ClassroomInsert = Database['public']['Tables']['classrooms']['Insert'];
type ClassroomUpdate = Database['public']['Tables']['classrooms']['Update'];
type ClassroomSwipe = Database['public']['Tables']['classroom_swipes']['Row'];
type ClassroomSwipeInsert = Database['public']['Tables']['classroom_swipes']['Insert'];

export class ClassroomService {
  static async getTeacherClassrooms(): Promise<Classroom[]> {
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      throw new Error('User must be authenticated to view classrooms');
    }

    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('teacher_id', user.user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher classrooms:', error);
      throw error;
    }

    return data || [];
  }

  static async getTeacherClassroomsWithEnrollments(): Promise<(Classroom & { enrollment_count: number })[]> {
    const { data, error } = await supabase
      .from('classrooms')
      .select(`
        *,
        classroom_enrollments(count)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher classrooms with enrollments:', error);
      throw error;
    }

    // Transform the data to include enrollment count
    return (data || []).map(classroom => ({
      ...classroom,
      enrollment_count: classroom.classroom_enrollments?.[0]?.count || 0
    }));
  }

  static async createClassroom(classroom: Omit<ClassroomInsert, 'teacher_id'>): Promise<Classroom> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to create a classroom');
    }

    const { data, error } = await supabase
      .from('classrooms')
      .insert({
        ...classroom,
        teacher_id: user.id
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating classroom:', error);
      throw error;
    }

    return data;
  }

  static async updateClassroom(id: string, updates: ClassroomUpdate): Promise<Classroom> {
    const { data, error } = await supabase
      .from('classrooms')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating classroom:', error);
      throw error;
    }

    return data;
  }

  static async deleteClassroom(id: string): Promise<void> {
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }
  }

  static async getActiveClassrooms(): Promise<Classroom[]> {
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active classrooms:', error);
      throw error;
    }

    return data || [];
  }

  static async getClassroomEnrollments(classroomId: string) {
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .select('*')
      .eq('classroom_id', classroomId);

    if (error) {
      console.error('Error fetching classroom enrollments:', error);
      throw error;
    }

    return data || [];
  }

  static async getClassroomEnrollmentCount(classroomId: string): Promise<number> {
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .select('id', { count: 'exact' })
      .eq('classroom_id', classroomId)
      .eq('status', 'active');

    if (error) {
      console.error('Error fetching classroom enrollment count:', error);
      return 0;
    }

    return data?.length || 0;
  }

  // New swipe functionality
  static async recordSwipe(classroomId: string, direction: 'left' | 'right'): Promise<ClassroomSwipe> {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to record swipes');
    }

    const { data, error } = await supabase
      .from('classroom_swipes')
      .insert({
        user_id: user.id,
        classroom_id: classroomId,
        swipe_direction: direction
      })
      .select()
      .single();

    if (error) {
      console.error('Error recording swipe:', error);
      throw error;
    }

    return data;
  }

  static async getUserSwipes(userId?: string): Promise<ClassroomSwipe[]> {
    const { data: { user } } = await supabase.auth.getUser();
    const targetUserId = userId || user?.id;
    
    if (!targetUserId) {
      throw new Error('User ID required to fetch swipes');
    }

    const { data, error } = await supabase
      .from('classroom_swipes')
      .select(`
        *,
        classrooms (*)
      `)
      .eq('user_id', targetUserId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching user swipes:', error);
      throw error;
    }

    return data || [];
  }

  static async getUserSwipedClassroomIds(userId?: string): Promise<string[]> {
    const swipes = await this.getUserSwipes(userId);
    return swipes.map(swipe => swipe.classroom_id);
  }
}
