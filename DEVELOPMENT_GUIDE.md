# Care Connects Frontend - Development Guide

## 🚀 **Quick Start**

```bash
# Install dependencies
npm install

# Set up environment
cp env.example .env.local
# Edit .env.local with your values

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## 📁 **Project Structure**

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected routes (requires auth)
│   │   ├── dashboard/          # Dashboard page
│   │   └── layout.tsx          # Protected layout with auth guard
│   ├── login/                   # Login page
│   ├── api/                     # API routes
│   │   ├── auth/               # Authentication endpoints
│   │   └── patients/           # Patient management endpoints
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page (redirects based on auth)
│   └── globals.css             # Global styles
│
├── components/                  # Reusable components
│   ├── ui/                     # UI component library
│   │   ├── Button/            # Button component
│   │   ├── Input/             # Input component
│   │   ├── Field/             # Form field wrapper
│   │   ├── Card/              # Card container
│   │   ├── LoadingSpinner/    # Loading indicator
│   │   ├── Modal/             # Modal dialog
│   │   └── DataTable/         # Data table component
│   ├── ErrorBoundary.tsx      # Global error boundary
│   └── index.ts               # Component exports
│
├── modules/                     # Feature modules
│   ├── auth/                   # Authentication module
│   │   ├── hooks/             # Auth hooks (useAuth.ts)
│   │   ├── schemas/           # Validation schemas
│   │   └── components/        # Auth-specific components
│   └── patient/               # Patient management module
│       ├── hooks/             # Patient hooks (usePatient.ts)
│       ├── schemas/           # Patient validation schemas
│       └── components/        # Patient components
│
├── hooks/                       # Global custom hooks
│   ├── api/                    # API hooks (useApiGet, useApiPost, etc.)
│   ├── useFormHandler.ts       # Form handling hook
│   ├── useIsAuthenticated.ts   # Auth state hook
│   └── index.ts               # Hook exports
│
├── config/                      # Configuration
│   ├── env.ts                 # Environment validation
│   ├── queryClient.ts         # React Query config
│   └── index.ts               # Config exports
│
├── types/                       # TypeScript type definitions
│   ├── auth.ts                # Auth types
│   ├── patient.ts             # Patient types
│   ├── api.ts                 # API response types
│   └── index.ts               # Type exports
│
├── utils/                       # Utility functions
│   └── token.ts               # JWT token utilities
│
└── constants/                   # Application constants
    └── queryKeys.ts            # React Query keys
```

## 🛠️ **Available Scripts**

```bash
# Development
npm run dev              # Start dev server with Turbopack
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix          # Fix ESLint issues
npm run format           # Format code with Prettier
npm run format:check      # Check code formatting
npm run type-check       # TypeScript type checking

# Testing
npm run test             # Run tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI

# Analysis
npm run build:analyze     # Build with bundle analysis
npm run validate         # Run all quality checks
```

## 🎯 **Architecture Patterns**

### **1. Module-Based Architecture**

Each feature is organized as a self-contained module:

```
modules/[feature]/
├── hooks/         # React Query hooks
├── schemas/       # Zod validation schemas
├── components/    # Feature-specific components
└── types/         # Feature types (if needed)
```

### **2. API Integration Pattern**

```typescript
// 1. Define types
export interface Patient {
  id: string;
  firstName: string;
  // ...
}

// 2. Create validation schema
export const createPatientSchema = z.object({
  firstName: z.string().min(1, 'Required'),
  // ...
});

// 3. Create API hooks
export const usePatients = (params?: PatientSearchParams) => {
  return useApiGetPaginated<PatientListResponse>(
    [QUERY_KEYS.PATIENT.GET_ALL_PATIENTS],
    'patients',
    { page: params?.page || 1, limit: params?.limit || 10 }
  );
};

// 4. Use in components
const { data, isLoading, error } = usePatients(searchParams);
```

### **3. Form Handling Pattern**

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  isSubmitting,
} = useFormHandler<FormData>({
  schema: mySchema,
  defaultValues: {
    /* ... */
  },
  onSubmit: async (data) => {
    // API call here
  },
});
```

## 🔐 **Authentication Flow**

### **JWT-Based Authentication**

1. **Login**: User submits credentials → API returns JWT tokens
2. **Token Storage**: Access token stored in localStorage
3. **API Requests**: Token included in Authorization header
4. **Token Refresh**: Automatic refresh before expiry
5. **Logout**: Tokens cleared from storage

### **Protected Routes**

- Middleware checks for valid JWT token
- Redirects to login if token missing/invalid
- Protected layout wraps authenticated pages

## 🧪 **Testing Strategy**

### **Test Structure**

```
src/
├── components/
│   └── ui/
│       └── Button/
│           ├── Button.tsx
│           └── __tests__/
│               └── Button.test.tsx
└── modules/
    └── patient/
        └── components/
            └── __tests__/
                └── PatientsList.test.tsx
```

### **Testing Patterns**

```typescript
// Component Testing
describe('Button Component', () => {
  it('renders with children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });
});

// Hook Testing
describe('usePatients', () => {
  it('fetches patients data', async () => {
    const { result } = renderHook(() => usePatients());
    await waitFor(() => expect(result.current.data).toBeDefined());
  });
});
```

## 🎨 **UI Component Library**

### **Available Components**

- **Button**: Multiple variants, sizes, loading states
- **Input**: Form input with validation
- **Field**: Form field wrapper with label/error
- **Card**: Container component
- **LoadingSpinner**: Loading indicator with accessibility
- **Modal**: Accessible modal dialog
- **DataTable**: Sortable, accessible data table

### **Component Usage**

```typescript
import { Button, Card, Field, Modal, DataTable } from '@/components/ui';

// Button with variants
<Button variant="primary" size="lg" isLoading={isLoading}>
  Submit
</Button>

// Form field
<Field
  label="Email"
  type="email"
  error={errors.email?.message}
  {...register('email')}
/>

// Modal
<Modal isOpen={isOpen} onClose={onClose} title="Create Patient">
  {/* Modal content */}
</Modal>

// Data table
<DataTable
  data={patients}
  columns={columns}
  onRowClick={handleRowClick}
  onSort={handleSort}
/>
```

## 🔧 **Configuration**

### **Environment Variables**

```env
# Required
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Care Connects
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret

# Optional
NODE_ENV=development
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=900000
```

### **TypeScript Configuration**

- Strict mode enabled
- Path aliases configured (`@/*` → `src/*`)
- Next.js plugin enabled

### **Tailwind Configuration**

- Custom color palette
- Responsive breakpoints
- Utility classes

## 🚀 **Performance Optimizations**

### **Bundle Optimization**

- Tree shaking enabled
- Package imports optimized
- Console logs removed in production
- Image optimization configured

### **Runtime Performance**

- React Query for efficient data fetching
- Proper caching strategies
- Loading states for all async operations
- Error boundaries for graceful failures

### **Bundle Analysis**

```bash
npm run build:analyze
# Opens bundle analyzer in browser
```

## ♿ **Accessibility Features**

### **Implemented Features**

- ARIA labels and roles
- Keyboard navigation support
- Screen reader support
- Focus management
- Semantic HTML

### **Accessibility Utilities**

```css
.sr-only {
  /* Screen reader only content */
}

.sr-only-focusable:focus {
  /* Focusable screen reader content */
}
```

## 🛡️ **Security Features**

### **Implemented Security**

- JWT token validation
- Protected route middleware
- Input validation with Zod
- XSS protection headers
- CSRF protection ready
- Environment variable validation

### **Security Headers**

- Strict-Transport-Security
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy

## 📊 **Error Handling**

### **Error Boundary**

- Global error boundary implemented
- Graceful error recovery
- Development error details
- Production-safe error messages

### **API Error Handling**

- Consistent error responses
- Toast notifications
- Automatic retry logic
- Token expiry handling

## 🔄 **State Management**

### **React Query**

- Server state management
- Automatic caching
- Background refetching
- Optimistic updates
- Error handling

### **Form State**

- React Hook Form
- Zod validation
- Persistent form data
- Real-time validation

## 📈 **Monitoring & Analytics**

### **Development Tools**

- React Query DevTools
- Next.js built-in analytics
- Bundle analyzer
- TypeScript strict mode

### **Production Ready**

- Error boundary logging
- Performance monitoring hooks
- Bundle size optimization
- Security headers

## 🚀 **Deployment**

### **Build Process**

```bash
npm run build        # Production build
npm run validate     # Quality checks
npm run test:ci      # Test suite
```

### **Environment Setup**

1. Copy `env.example` to `.env.local`
2. Set production environment variables
3. Configure JWT secrets
4. Set API base URL

## 🤝 **Contributing**

### **Code Standards**

- TypeScript strict mode
- ESLint + Prettier
- Component testing required
- Accessibility compliance
- Performance optimization

### **Pull Request Process**

1. Run `npm run validate`
2. Ensure tests pass
3. Update documentation
4. Follow naming conventions

## 📚 **Additional Resources**

- [Next.js Documentation](https://nextjs.org/docs)
- [React Query Documentation](https://tanstack.com/query)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Testing Library Documentation](https://testing-library.com/docs)
- [Accessibility Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Last Updated**: December 2024  
**Version**: 1.0.0  
**Maintainer**: Development Team
