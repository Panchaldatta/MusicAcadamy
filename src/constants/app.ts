
export const APP_NAME = "SangamGuru";
export const APP_DESCRIPTION = "Connect with expert music gurus and master Indian classical music";

export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  CONTACT: '/contact',
  LOGIN: '/login',
  SIGNUP: '/signup',
  BROWSE_CLASSROOMS: '/browse-classrooms',
  BROWSE_TEACHERS: '/browse-teachers',
  TEACHER_DASHBOARD: '/teacher-dashboard',
  SWIPE_HISTORY: '/swipe-history',
} as const;

export const FILTER_OPTIONS = {
  SUBJECTS: {
    ALL: 'all',
  },
  LOCATIONS: {
    ALL: 'all',
  },
  PRICE_RANGES: {
    ALL: 'all',
    LOW: '0-500',
    MEDIUM: '500-1000',
    HIGH: '1000+',
  },
  SORT_BY: {
    RATING: 'rating',
    PRICE_LOW: 'price-low',
    PRICE_HIGH: 'price-high',
    EXPERIENCE: 'experience',
  },
} as const;
