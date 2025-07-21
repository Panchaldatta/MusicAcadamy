
import { supabase } from '@/integrations/supabase/client';
import type { MusicSubject } from '@/hooks/useMusicSubjects';

export class MusicSubjectService {
  static async getAllMusicSubjects(): Promise<MusicSubject[]> {
    const { data, error } = await supabase
      .from('music_subjects')
      .select('*')
      .order('student_count', { ascending: false });
    
    if (error) {
      console.error('Error fetching music subjects:', error);
      throw error;
    }
    
    return data as MusicSubject[];
  }

  static async getMusicSubjectById(id: string): Promise<MusicSubject | null> {
    const { data, error } = await supabase
      .from('music_subjects')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    
    if (error) {
      console.error('Error fetching music subject:', error);
      throw error;
    }
    
    return data as MusicSubject | null;
  }
}
