
import { useQuery } from '@tanstack/react-query';
import { TeacherService } from '@/services/teacherService';

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  rating: number;
  reviews: number;
  price: number;
  experience: string;
  location: string;
  image_url?: string;
  specialties: string[];
  verified: boolean;
  response_time: string;
  languages: string[];
}

export const useTeachers = () => {
  return useQuery({
    queryKey: ['teachers'],
    queryFn: TeacherService.getAllTeachers,
  });
};

export const useTeachersBySubject = (subject: string) => {
  return useQuery({
    queryKey: ['teachers', 'subject', subject],
    queryFn: () => TeacherService.getTeachersBySubject(subject),
    enabled: !!subject,
  });
};

export const useSearchTeachers = (searchTerm: string) => {
  return useQuery({
    queryKey: ['teachers', 'search', searchTerm],
    queryFn: () => TeacherService.searchTeachers(searchTerm),
    enabled: !!searchTerm,
  });
};
