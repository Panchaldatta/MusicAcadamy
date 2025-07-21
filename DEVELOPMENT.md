
# Development Guide

## 🏗️ Architecture Overview

### Clean Architecture Layers

1. **Presentation Layer** (`src/components/`, `src/pages/`)
   - React components and pages
   - UI logic and user interactions
   - No direct database calls

2. **Application Layer** (`src/hooks/`)
   - Custom hooks containing business logic
   - State management
   - Orchestrates service calls

3. **Service Layer** (`src/services/`)
   - Backend communication
   - Data transformation
   - Error handling

4. **Infrastructure Layer** (`src/integrations/`)
   - Third-party integrations
   - Database configuration
   - External API clients

### Data Flow

```
User Interaction → Component → Custom Hook → Service → Supabase → Database
                                     ↓
                              State Update → Component Re-render
```

## 🔧 Development Best Practices

### Component Development

#### 1. Component Structure
```typescript
// Component file structure
import React from 'react';
import { ComponentProps } from './types'; // Local types
import { useCustomHook } from '@/hooks/useCustomHook';

interface ComponentNameProps {
  // Props definition
}

const ComponentName = ({ prop1, prop2 }: ComponentNameProps) => {
  // Hooks at the top
  const { data, loading } = useCustomHook();
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Early returns for loading/error states
  if (loading) return <LoadingState />;
  
  // Main render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};

export default ComponentName;
```

#### 2. Custom Hooks Pattern
```typescript
// Custom hook structure
export const useFeatureName = (params?: FeatureParams) => {
  const [state, setState] = useState(initialState);
  const { data, isLoading, error } = useQuery({
    queryKey: ['feature', params],
    queryFn: () => FeatureService.getData(params),
  });
  
  const actions = {
    updateData: (newData: DataType) => {
      // Action logic
    },
    clearData: () => {
      // Clear logic
    }
  };
  
  return {
    state,
    data,
    isLoading,
    error,
    ...actions
  };
};
```

#### 3. Service Layer Pattern
```typescript
// Service class structure
export class FeatureService {
  static async getData(params: Params): Promise<DataType[]> {
    const { data, error } = await supabase
      .from('table_name')
      .select('*')
      .eq('column', params.value);
    
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    
    return data as DataType[];
  }
  
  static async createData(newData: CreateDataType): Promise<DataType> {
    // Create logic
  }
  
  static async updateData(id: string, updates: UpdateDataType): Promise<DataType> {
    // Update logic
  }
  
  static async deleteData(id: string): Promise<void> {
    // Delete logic
  }
}
```

### State Management Guidelines

#### 1. Server State (React Query)
```typescript
// Use React Query for server state
const { data, isLoading, error, refetch } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => ResourceService.getById(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

#### 2. Client State (useState/useReducer)
```typescript
// Use useState for simple local state
const [isOpen, setIsOpen] = useState(false);

// Use useReducer for complex state
const [state, dispatch] = useReducer(reducer, initialState);
```

#### 3. URL State (useSearchParams)
```typescript
// Use URL params for shareable state
const [searchParams, setSearchParams] = useSearchParams();
const searchTerm = searchParams.get('search') || '';

const updateSearch = (newTerm: string) => {
  setSearchParams(prev => ({ ...prev, search: newTerm }));
};
```

## 🎨 Styling Guidelines

### Tailwind CSS Best Practices

#### 1. Component-First Approach
```typescript
// Group related classes together
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
  <button className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700">
    Action
  </button>
</div>
```

#### 2. Responsive Design
```typescript
// Mobile-first responsive design
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Grid items */}
</div>
```

#### 3. Color Consistency
```typescript
// Use consistent color palette
const colorClasses = {
  primary: 'bg-orange-600 text-white',
  secondary: 'bg-red-600 text-white',
  accent: 'bg-yellow-500 text-gray-900',
  neutral: 'bg-gray-100 text-gray-900'
};
```

## 🔍 Testing Strategy

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders correctly', () => {
    render(<ComponentName />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    render(<ComponentName />);
    fireEvent.click(screen.getByRole('button'));
    expect(/* assertion */).toBeTruthy();
  });
});
```

### Service Testing
```typescript
// Service testing with mocked Supabase
import { TeacherService } from './teacherService';
import { supabase } from '@/integrations/supabase/client';

jest.mock('@/integrations/supabase/client');

describe('TeacherService', () => {
  it('fetches teachers successfully', async () => {
    (supabase.from as jest.Mock).mockReturnValue({
      select: jest.fn().mockReturnValue({
        order: jest.fn().mockResolvedValue({
          data: mockTeachers,
          error: null
        })
      })
    });
    
    const teachers = await TeacherService.getAllTeachers();
    expect(teachers).toEqual(mockTeachers);
  });
});
```

## 🚀 Performance Optimization

### React Performance

#### 1. Memoization
```typescript
// Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// Memoize callback functions
const handleClick = useCallback((id: string) => {
  onClick(id);
}, [onClick]);

// Memoize components
const MemoizedComponent = React.memo(Component);
```

#### 2. Code Splitting
```typescript
// Lazy load components
const LazyComponent = lazy(() => import('./LazyComponent'));

// Route-based splitting
const LazyPage = lazy(() => import('../pages/LazyPage'));
```

#### 3. Virtual Scrolling
```typescript
// For large lists, consider virtual scrolling
import { FixedSizeList as List } from 'react-window';

const VirtualList = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={100}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <ItemComponent item={data[index]} />
      </div>
    )}
  </List>
);
```

### Database Performance

#### 1. Query Optimization
```sql
-- Use indexes for frequently queried columns
CREATE INDEX idx_teachers_subject ON teachers(subject);
CREATE INDEX idx_teachers_location ON teachers(location);
CREATE INDEX idx_teachers_rating ON teachers(rating DESC);
```

#### 2. Efficient Queries
```typescript
// Select only needed columns
const { data } = await supabase
  .from('teachers')
  .select('id, name, subject, rating')
  .limit(20);

// Use pagination for large datasets
const { data } = await supabase
  .from('teachers')
  .select('*')
  .range(start, end);
```

## 🔐 Security Best Practices

### Row Level Security (RLS)
```sql
-- Ensure RLS is enabled on all tables
ALTER TABLE teachers ENABLE ROW LEVEL SECURITY;

-- Create appropriate policies
CREATE POLICY "Users can view their own data" 
  ON user_data 
  FOR SELECT 
  USING (auth.uid() = user_id);
```

### Input Validation
```typescript
// Validate user inputs
import { z } from 'zod';

const TeacherSchema = z.object({
  name: z.string().min(1).max(100),
  subject: z.string().min(1),
  price: z.number().positive()
});

const validateTeacher = (data: unknown) => {
  return TeacherSchema.parse(data);
};
```

### Error Handling
```typescript
// Implement proper error boundaries
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }
  
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback />;
    }
    
    return this.props.children;
  }
}
```

## 📦 Build & Deployment

### Build Optimization
```bash
# Production build with optimizations
npm run build

# Analyze bundle size
npm run build -- --analyze
```

### Environment Configuration
```typescript
// Environment-specific configurations
const config = {
  development: {
    apiUrl: 'http://localhost:3000',
    debug: true
  },
  production: {
    apiUrl: 'https://api.sangamguru.com',
    debug: false
  }
};
```

### Deployment Checklist
- [ ] Run all tests
- [ ] Check bundle size
- [ ] Verify environment variables
- [ ] Test in production mode
- [ ] Update documentation
- [ ] Tag release version

## 🐛 Debugging Guidelines

### Development Tools
```typescript
// Use React DevTools for component debugging
// Use React Query DevTools for cache inspection
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

function App() {
  return (
    <>
      {/* Your app */}
      <ReactQueryDevtools initialIsOpen={false} />
    </>
  );
}
```

### Logging Strategy
```typescript
// Structured logging
const logger = {
  info: (message: string, data?: any) => {
    console.log(`[INFO] ${message}`, data);
  },
  error: (message: string, error?: Error) => {
    console.error(`[ERROR] ${message}`, error);
  },
  debug: (message: string, data?: any) => {
    if (process.env.NODE_ENV === 'development') {
      console.debug(`[DEBUG] ${message}`, data);
    }
  }
};
```

## 📚 Additional Resources

### Useful Links
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query/latest)

### Code Examples Repository
Check the `examples/` directory for:
- Component patterns
- Hook implementations
- Service layer examples
- Testing scenarios

---

This development guide should be updated as the project evolves and new patterns emerge.
