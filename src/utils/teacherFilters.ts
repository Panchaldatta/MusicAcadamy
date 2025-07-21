
import type { Teacher } from '@/hooks/useTeachers';

export interface TeacherFilters {
  searchTerm: string;
  selectedSubject: string;
  selectedLocation: string;
  priceRange: string;
  sortBy: string;
}

export class TeacherFilterUtils {
  static filterTeachers(teachers: Teacher[], filters: TeacherFilters): Teacher[] {
    return teachers.filter(teacher => {
      const matchesSearch = this.matchesSearchCriteria(teacher, filters.searchTerm);
      const matchesSubject = this.matchesSubject(teacher, filters.selectedSubject);
      const matchesLocation = this.matchesLocation(teacher, filters.selectedLocation);
      const matchesPrice = this.matchesPriceRange(teacher, filters.priceRange);
      
      return matchesSearch && matchesSubject && matchesLocation && matchesPrice;
    });
  }

  static sortTeachers(teachers: Teacher[], sortBy: string): Teacher[] {
    return [...teachers].sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'experience':
          return b.experience.localeCompare(a.experience);
        default:
          return b.rating - a.rating;
      }
    });
  }

  private static matchesSearchCriteria(teacher: Teacher, searchTerm: string): boolean {
    if (!searchTerm) return true;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return (
      teacher.name.toLowerCase().includes(lowerSearchTerm) ||
      teacher.subject.toLowerCase().includes(lowerSearchTerm) ||
      teacher.specialties.some(specialty => 
        specialty.toLowerCase().includes(lowerSearchTerm)
      )
    );
  }

  private static matchesSubject(teacher: Teacher, selectedSubject: string): boolean {
    return selectedSubject === "all" || teacher.subject === selectedSubject;
  }

  private static matchesLocation(teacher: Teacher, selectedLocation: string): boolean {
    return selectedLocation === "all" || teacher.location === selectedLocation;
  }

  private static matchesPriceRange(teacher: Teacher, priceRange: string): boolean {
    if (priceRange === "all") return true;
    
    const [min, max] = priceRange.split('-').map(p => p.replace('+', ''));
    if (priceRange.includes('+')) {
      return teacher.price >= parseInt(min);
    }
    return teacher.price >= parseInt(min) && teacher.price <= parseInt(max);
  }
}
