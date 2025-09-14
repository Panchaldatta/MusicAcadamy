
#soundsync - Indian Classical Music Learning Platform

A modern web application connecting music students with expert Indian classical music teachers (gurus). Built with React, TypeScript, Tailwind CSS, and Supabase.

## 🎯 Overview

soundsync is a comprehensive platform that enables students to discover, connect with, and learn from verified Indian classical music teachers.
The application features a Tinder-like swipe interface for teacher discovery, detailed teacher profiles, and a robust filtering system.

## 🚀 Features

### Core Features
- **Teacher Discovery**: Browse and search through verified music teachers
- **Swipe Interface**: Tinder-like experience for discovering teachers
- **Advanced Filtering**: Filter by subject, location, price range, and more
- **Teacher Profiles**: Detailed profiles with ratings, reviews, and specialties
- **Responsive Design**: Fully responsive across all devices
- **Real-time Data**: Live updates using Supabase real-time subscriptions

### Music Subjects Supported
- Tabla & Percussion
- Classical Vocals & Hindustani
- Sitar & String Instruments
- Harmonium & Devotional Music
- Flute, Violin, Veena, Santoor

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI component library
- **Framer Motion** - Smooth animations and transitions
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Data fetching and state management

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL database
  - Real-time subscriptions
  - Row Level Security (RLS)
  - Authentication
  - Edge Functions

### Additional Libraries
- **Lucide React** - Modern icon library
- **React Hook Form** - Form validation and handling
- **Sonner** - Toast notifications
- **Recharts** - Data visualization

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── common/          # Common components (LoadingState, ErrorState)
│   ├── ui/              # shadcn/ui components
│   └── ...              # Feature-specific components
├── hooks/               # Custom React hooks
├── pages/               # Page components (routes)
├── services/            # Backend service layer
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── constants/           # Application constants
├── integrations/        # Third-party integrations
│   └── supabase/        # Supabase configuration
└── lib/                 # Utility libraries
```

## 🔧 Architecture & Design Patterns

### Clean Architecture
The application follows clean architecture principles:

1. **Service Layer** (`src/services/`): Handles all backend communication
2. **Custom Hooks** (`src/hooks/`): Business logic and state management
3. **Components** (`src/components/`): Pure UI components
4. **Utils** (`src/utils/`): Pure functions for data transformation

### Key Design Patterns
- **Repository Pattern**: Service classes abstract database operations
- **Custom Hooks Pattern**: Encapsulate business logic and state
- **Component Composition**: Reusable, focused components
- **Separation of Concerns**: Clear boundaries between layers

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Supabase Account**


## 🗄️ Database Schema

### Core Tables

#### `teachers`
- Teacher profiles with ratings, reviews, and specialties
- Columns: id, name, subject, rating, reviews, price, experience, location, etc.

#### `music_subjects`
- Available music subjects/instruments
- Columns: id, name, icon, color, student_count

#### `user_swipes`
- User swipe history for teacher recommendations
- Columns: id, user_id, teacher_id, swipe_direction

#### `profiles`
- Extended user profiles
- Columns: id, first_name, last_name, email, role

#### `site_stats`
- Homepage statistics
- Columns: id, label, value, display_order

### Row Level Security (RLS)
All tables implement Row Level Security policies to ensure data access control:
- Users can only access their own data
- Public data (teachers, subjects) is readable by all
- Admin-only operations for managing content

## 🔐 Authentication

- **Provider**: Supabase Auth
- **Methods**: Email/Password, Google OAuth
- **Features**: 
  - User registration and login
  - Profile management
  - Role-based access control
  - Teacher and Student registration flows

### Admin Credentials
For testing the admin dashboard, use these pre-configured credentials:
- **Email**: admin@soundsync.com
- **Password**: Admin@123
- **Dashboard URL**: `/admin-dashboard`

*Alternatively, you can create a new admin account using the admin registration form with invitation code: ADMIN_INVITE_2024*

## 📱 API Integration

### Service Layer Architecture
All backend operations are abstracted through service classes:



### Custom Hooks
Business logic is encapsulated in custom hooks:

## 🎨 UI/UX Features

### Design System
- **Color Scheme**: Orange and red gradients with Indian-inspired themes
- **Typography**: Modern, readable fonts with proper hierarchy
- **Components**: Consistent, reusable UI components
- **Responsive**: Mobile-first design approach

### Key UI Components
- **Swipeable Cards**: Tinder-like interface for teacher discovery
- **Filter Bar**: Advanced filtering with multiple criteria
- **Teacher Grid**: Responsive grid layout for teacher listings
- **Loading States**: Consistent loading indicators
- **Error States**: User-friendly error handling

## 🔍 Browse Teachers Functionality

The Browse Teachers page (`/browse-teachers`) is a comprehensive teacher discovery system that allows students to search, filter, and book lessons with music teachers. Here's how it works:

### Architecture Overview

```
BrowseTeachers (Page Component)
├── Navigation
├── FilterBar (Search & Filters)
├── TeacherGrid
│   └── TeacherModernCard[] (Individual teacher cards)
│       └── PaymentDialog (Booking interface)
└── Footer
```

### Data Flow & State Management

#### 1. **Data Fetching Layer**
```typescript
// Main data hooks
const { data: teachers, isLoading, error } = useTeachers();
const { filters, filteredAndSortedTeachers, updateFilter, clearFilters } = useTeacherFilters(teachers);
```

#### 2. **Teacher Service (`src/services/teacherService.ts`)**
- **`getAllTeachers()`**: Fetches all teachers from Supabase
- **`getTeachersBySubject(subject)`**: Filters teachers by music subject
- **`searchTeachers(searchTerm)`**: Full-text search across names, subjects, and specialties

#### 3. **Filter System (`src/utils/teacherFilters.ts`)**
The filtering system uses a utility class `TeacherFilterUtils` that processes teachers through multiple criteria:

```typescript
interface TeacherFilters {
  searchTerm: string;          // Name/subject/specialty search
  selectedSubject: string;     // Music instrument filter
  selectedLocation: string;    // City-based filter
  priceRange: string;         // Budget range (e.g., "1500-2000")
  sortBy: string;             // Sort criteria (rating, price, experience)
}
```

**Filter Processing:**
- **Search Matching**: Searches across teacher name, subject, and specialties
- **Subject Filtering**: Exact match against selected instrument
- **Location Filtering**: City-based geographical filtering
- **Price Range Filtering**: Numerical range filtering with support for "above X" ranges
- **Sorting**: Multi-criteria sorting (rating, price, experience, reviews)

### Component Architecture

#### 1. **FilterBar Component**
**Location**: `src/components/FilterBar.tsx`

**Features**:
- **Search Input**: Real-time text search with debouncing
- **Subject Dropdown**: Pre-defined music subjects (Sitar, Tabla, Vocals, etc.)
- **Location Dropdown**: Major Indian cities
- **Price Range Selector**: Budget-based filtering
- **Sort Options**: Multiple sorting criteria
- **Active Filters Display**: Visual representation of applied filters
- **Clear Filters**: Reset all filters functionality

**Responsive Design**:
- Mobile: Single column layout with full-width inputs
- Tablet: 2-column grid layout
- Desktop: 4-column grid for optimal space usage

#### 2. **TeacherGrid Component**
**Location**: `src/components/TeacherGrid.tsx`

Renders filtered teachers in a responsive grid:
- **Empty State**: Displays when no teachers match filters
- **Loading State**: Skeleton loading during data fetch
- **Teacher Cards**: Individual `TeacherModernCard` components

#### 3. **TeacherModernCard Component**
**Location**: `src/components/TeacherModernCard.tsx`

**Features**:
- **Teacher Avatar**: Profile image with fallback to initials
- **Verification Badge**: Verified teacher indicator
- **Rating System**: Star rating with review count
- **Teacher Information**: Subject, location, experience, response time
- **Pricing**: Per-hour rate display
- **Action Buttons**: "View Profile" and "Pay & Book"
- **Hover Effects**: Enhanced interactions with animations

**Responsive Layout**:
- **Mobile**: Vertical card layout, full-width image
- **Desktop**: Horizontal layout with side-by-side image and content

### URL Integration & Deep Linking

The Browse Teachers page supports URL-based search parameters for shareable links:

```typescript
// URL Parameters
?search=sitar          // Pre-fill search term
?subject=Tabla         // Pre-select subject filter  
?location=Mumbai       // Pre-select location filter
```

**Implementation**:
```typescript
const [searchParams] = useSearchParams();

useEffect(() => {
  const searchParam = searchParams.get('search');
  const subjectParam = searchParams.get('subject');
  const locationParam = searchParams.get('location');
  
  if (searchParam) updateFilter('searchTerm', searchParam);
  if (subjectParam) updateFilter('selectedSubject', subjectParam);
  if (locationParam) updateFilter('selectedLocation', locationParam);
}, [searchParams, updateFilter]);
```

### Payment Integration

#### Payment Flow
1. **Teacher Selection**: User clicks "Pay & Book" on teacher card
2. **Payment Dialog**: `PaymentDialog` component opens with teacher details
3. **Stripe Integration**: Secure payment processing via Stripe
4. **Payment Success**: Redirect to success page with confirmation
5. **Booking Creation**: Lesson booking record created in database

#### Payment Status Handling
```typescript
useEffect(() => {
  const paymentStatus = searchParams.get('payment');
  const sessionId = searchParams.get('session_id');

  if (paymentStatus === 'success' && sessionId) {
    // Verify payment via Supabase Edge Function
    supabase.functions.invoke('verify-payment', { body: { sessionId } });
  }
}, [searchParams]);
```

### Performance Optimizations

#### 1. **React Query Caching**
- Teachers data cached with automatic background updates
- Intelligent cache invalidation
- Optimistic updates for better UX

#### 2. **Filter Optimization**
```typescript
const filteredAndSortedTeachers = useMemo(() => {
  const filtered = TeacherFilterUtils.filterTeachers(teachers, filters);
  return TeacherFilterUtils.sortTeachers(filtered, filters.sortBy);
}, [teachers, filters]);
```

#### 3. **Lazy Loading**
- Components loaded on-demand
- Images lazy-loaded with intersection observer
- Progressive enhancement for slower connections

### Error Handling & Loading States

#### Loading States
- **Initial Load**: Full-page skeleton with branded messaging
- **Filter Changes**: Maintained state during filter updates
- **Empty Results**: Helpful messaging with filter reset option

#### Error Handling
- **Network Errors**: Retry mechanism with user feedback
- **Data Errors**: Graceful degradation with error boundaries
- **Payment Errors**: Clear error messaging with recovery options

### Accessibility Features

#### Keyboard Navigation
- Full keyboard support for all interactive elements
- Proper tab order and focus management
- Screen reader optimized labels and descriptions

#### Visual Accessibility
- High contrast color schemes
- Scalable font sizes
- Alternative text for all images
- Loading indicators for screen readers

### Mobile Optimization

#### Touch Interactions
- Large touch targets (minimum 44px)
- Swipe gestures for card interactions
- Pull-to-refresh functionality

#### Performance
- Optimized images with multiple sizes
- Efficient bundle splitting
- Service worker for offline functionality

### Real-time Features

#### Live Updates
- Teacher availability status updates
- Real-time pricing changes
- Instant notification for booking confirmations

#### WebSocket Integration
```typescript
// Real-time teacher updates via Supabase
const channel = supabase
  .channel('teacher-updates')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'teachers' },
    (payload) => {
      // Update local teacher data
      queryClient.invalidateQueries(['teachers']);
    }
  )
  .subscribe();
```

This comprehensive system provides a smooth, efficient, and user-friendly way for students to discover and connect with music teachers while maintaining high performance and accessibility standards.

## 📊 Performance Optimizations

### React Query Integration
- **Caching**: Intelligent data caching for better performance
- **Background Updates**: Keep data fresh without blocking UI
- **Error Handling**: Robust error handling with retry mechanisms

### Code Splitting
- **Lazy Loading**: Components loaded on demand
- **Route-based Splitting**: Separate bundles for different pages


### Deployment Options
1. **Lovable Platform**: Direct deployment from the Lovable interface
2. **Vercel/Netlify**: Static site deployment
3. **Custom Hosting**: Deploy build files to any static hosting

### Environment Configuration
- **Supabase**: Pre-configured with project credentials
- **Domain Setup**: Custom domain configuration available
- **SSL**: Automatic HTTPS setup

## 🧪 Testing

### Testing Strategy
- **Component Testing**: Individual component functionality
- **Integration Testing**: Service layer and API integration
- **E2E Testing**: Full user workflow testing

## 🔧 Development Guidelines

### Code Standards
- **TypeScript**: Strict type checking enabled
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Conventional Commits**: Structured commit messages

### Component Guidelines
- **Single Responsibility**: Each component has one clear purpose
- **Composition over Inheritance**: Favor component composition
- **Props Interface**: Always define TypeScript interfaces for props
- **Error Boundaries**: Implement error handling at appropriate levels

### State Management
- **React Query**: Server state management
- **useState/useReducer**: Local component state
- **Custom Hooks**: Shared business logic

## 📈 Monitoring & Analytics

### Error Tracking
- **Console Logging**: Comprehensive error logging
- **Error Boundaries**: Graceful error handling
- **User Feedback**: Error reporting mechanisms

### Performance Monitoring
- **Core Web Vitals**: Track loading performance
- **User Experience**: Monitor user interactions
- **Database Performance**: Query optimization

## 🤝 Contributing

### Development Process
1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Code Review Process
- **Automated Checks**: ESLint, TypeScript, and build checks
- **Manual Review**: Code quality and architecture review
- **Testing**: Ensure all tests pass

## 📞 Support & Contact

### Getting Help
- **Documentation**: Comprehensive docs in `/docs` folder
- **Issues**: Report bugs via GitHub issues
- **Discussions**: Community discussions for feature requests

### Maintenance
- **Regular Updates**: Keep dependencies updated
- **Security Patches**: Apply security updates promptly
- **Performance Monitoring**: Regular performance audits

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase**: For the excellent backend-as-a-service platform
- **shadcn/ui**: For the beautiful and accessible UI components
- **Tailwind CSS**: For the utility-first CSS framework
- **React Community**: For the amazing ecosystem and tools


