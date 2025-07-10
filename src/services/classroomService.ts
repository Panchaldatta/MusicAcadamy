
import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type Classroom = Database['public']['Tables']['classrooms']['Row'];
type ClassroomInsert = Database['public']['Tables']['classrooms']['Insert'];
type ClassroomUpdate = Database['public']['Tables']['classrooms']['Update'];

export class ClassroomService {
  static async getTeacherClassrooms(): Promise<Classroom[]> {
    console.log('Fetching teacher classrooms...');
    
    // Check if user is authenticated
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user:', user);
    
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User must be authenticated to view classrooms');
    }

    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching teacher classrooms:', error);
      throw error;
    }

    console.log('Fetched classrooms:', data);
    return data || [];
  }

  static async createClassroom(classroom: Omit<ClassroomInsert, 'teacher_id'>): Promise<Classroom> {
    console.log('Creating classroom with data:', classroom);
    
    const { data: { user } } = await supabase.auth.getUser();
    console.log('Current user for classroom creation:', user);
    
    if (!user) {
      console.error('User not authenticated');
      throw new Error('User must be authenticated to create a classroom');
    }

    const classroomData = {
      ...classroom,
      teacher_id: user.id
    };

    console.log('Classroom data to insert:', classroomData);

    const { data, error } = await supabase
      .from('classrooms')
      .insert(classroomData)
      .select()
      .single();

    if (error) {
      console.error('Error creating classroom:', error);
      console.error('Error details:', error.details, error.hint, error.message);
      throw error;
    }

    console.log('Successfully created classroom:', data);
    return data;
  }

  static async updateClassroom(id: string, updates: ClassroomUpdate): Promise<Classroom> {
    console.log('Updating classroom:', id, 'with updates:', updates);
    
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

    console.log('Successfully updated classroom:', data);
    return data;
  }

  static async deleteClassroom(id: string): Promise<void> {
    console.log('Deleting classroom:', id);
    
    const { error } = await supabase
      .from('classrooms')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting classroom:', error);
      throw error;
    }

    console.log('Successfully deleted classroom:', id);
  }

  static async getActiveClassrooms(): Promise<Classroom[]> {
    console.log('Fetching active classrooms...');
    
    const { data, error } = await supabase
      .from('classrooms')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching active classrooms:', error);
      throw error;
    }

    console.log('Fetched active classrooms:', data);
    return data || [];
  }

  static async getClassroomEnrollments(classroomId: string) {
    console.log('Fetching classroom enrollments for:', classroomId);
    
    const { data, error } = await supabase
      .from('classroom_enrollments')
      .select('*')
      .eq('classroom_id', classroomId);

    if (error) {
      console.error('Error fetching classroom enrollments:', error);
      throw error;
    }

    console.log('Fetched enrollments:', data);
    return data || [];
  }
}
