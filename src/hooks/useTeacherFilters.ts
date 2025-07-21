
import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Teacher } from '@/hooks/useTeachers';
import { TeacherFilterUtils, type TeacherFilters } from '@/utils/teacherFilters';

export const useTeacherFilters = (teachers: Teacher[]) => {
  const [searchParams] = useSearchParams();
  
  const [filters, setFilters] = useState<TeacherFilters>({
    searchTerm: searchParams.get('search') || "",
    selectedSubject: searchParams.get('subject') || "all",
    selectedLocation: searchParams.get('location') || "all",
    priceRange: "all",
    sortBy: "rating"
  });

  const filteredAndSortedTeachers = useMemo(() => {
    const filtered = TeacherFilterUtils.filterTeachers(teachers, filters);
    return TeacherFilterUtils.sortTeachers(filtered, filters.sortBy);
  }, [teachers, filters]);

  const updateFilter = <K extends keyof TeacherFilters>(
    key: K, 
    value: TeacherFilters[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: "",
      selectedSubject: "all",
      selectedLocation: "all",
      priceRange: "all",
      sortBy: "rating"
    });
  };

  return {
    filters,
    filteredAndSortedTeachers,
    updateFilter,
    clearFilters
  };
};
