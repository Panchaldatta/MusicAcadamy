
import { useQuery } from '@tanstack/react-query';
import { MusicSubjectService } from '@/services/musicSubjectService';

export interface MusicSubject {
  id: string;
  name: string;
  icon: string;
  color: string;
  student_count: number;
}

export const useMusicSubjects = () => {
  return useQuery({
    queryKey: ['music_subjects'],
    queryFn: MusicSubjectService.getAllMusicSubjects,
  });
};

export const useMusicSubject = (id: string) => {
  return useQuery({
    queryKey: ['music_subjects', id],
    queryFn: () => MusicSubjectService.getMusicSubjectById(id),
    enabled: !!id,
  });
};
