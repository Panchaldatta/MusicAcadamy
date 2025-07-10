
import { supabase } from '@/integrations/supabase/client';
import type { Teacher } from '@/hooks/useTeachers';

export class TeacherService {
  static async getAllTeachers(): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error fetching teachers:', error);
      throw error;
    }
    
    return data as Teacher[];
  }

  static async getTeachersBySubject(subject: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('subject', subject)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error fetching teachers by subject:', error);
      throw error;
    }
    
    return data as Teacher[];
  }

  static async searchTeachers(searchTerm: string): Promise<Teacher[]> {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .or(`name.ilike.%${searchTerm}%,subject.ilike.%${searchTerm}%`)
      .order('rating', { ascending: false });
    
    if (error) {
      console.error('Error searching teachers:', error);
      throw error;
    }
    
    return data as Teacher[];
  }
}
