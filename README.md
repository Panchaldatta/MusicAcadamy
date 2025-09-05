
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
For testing the admin dashboard, you can create an admin account using the admin registration form:
- **Admin Code**: ADMIN_INVITE_2024
- **Dashboard URL**: `/teacher-dashboard-admin`

*Note: The admin code is required for security. Use the admin registration form with this code to create your admin account.*

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

## 🔍 Search & Filtering

### Advanced Filtering System
- **Subject-based filtering**: Filter by music instruments/subjects
- **Location filtering**: Find teachers in specific cities
- **Price range filtering**: Budget-based teacher selection
- **Rating & experience sorting**: Sort by quality metrics

### Search Functionality
- **Full-text search**: Search across teacher names, subjects, and specialties
- **URL-based search**: Shareable search URLs with parameters
- **Real-time filtering**: Instant results as users type

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


