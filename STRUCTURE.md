# Care Connects Frontend - Project Structure

This document outlines the project structure following the guidelines from `cursor_dev_guidelines.md`.

## 📁 Folder Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (protected)/             # Protected route group (requires authentication)
│   │   ├── dashboard/          # Dashboard page
│   │   │   └── page.tsx
│   │   └── layout.tsx          # Protected routes layout with auth check
│   ├── login/                   # Login page
│   │   └── page.tsx
│   ├── layout.tsx              # Root layout with providers
│   ├── page.tsx                # Home page (redirects based on auth)
│   └── globals.css             # Global styles with Tailwind
│
├── components/                  # Reusable components
│   └── ui/                     # UI component library
│       ├── Button/
│       │   └── Button.tsx      # Button component with variants
│       ├── Input/
│       │   └── Input.tsx       # Input component with validation
│       ├── Field/
│       │   └── Field.tsx       # Form field wrapper
│       ├── Card/
│       │   └── Card.tsx        # Card container
│       ├── LoadingSpinner/
│       │   └── LoadingSpinner.tsx
│       └── index.ts            # Barrel exports
│
├── modules/                     # Feature modules
│   └── auth/                   # Authentication module
│       ├── schemas/            # Zod validation schemas
│       │   └── login.schema.ts
│       ├── services/           # API service functions
│       │   └── auth.service.ts
│       ├── hooks/              # React Query hooks
│       │   └── useAuth.ts
│       └── components/         # Feature-specific components (TBD)
│
├── hooks/                       # Global custom hooks
│   └── useFormHandler.ts       # Reusable form handler with validation
│
├── axios/                       # HTTP client configuration
│   └── axios.ts                # Axios instance with interceptors
│
├── config/                      # App configuration
│   ├── index.ts                # Environment variables
│   └── queryClient.ts          # React Query configuration
│
├── constants/                   # Application constants
│   └── queryKeys.ts            # Query keys for React Query
│
├── providers/                   # React context providers
│   ├── QueryProvider.tsx       # React Query provider
│   └── ToastProvider.tsx       # Toast notification provider
│
├── types/                       # Global TypeScript types (TBD)
├── utils/                       # Utility functions (TBD)
├── layouts/                     # Layout components (TBD)
└── bootstrap/                   # App initialization (TBD)
```

## 🎯 Key Architectural Decisions

### 1. **Module-Based Architecture**
Each feature is organized as a self-contained module following this pattern:
```
modules/[feature]/
├── schemas/       # Zod validation schemas
├── services/      # Plain axios API functions
├── hooks/         # React Query hooks
├── components/    # Feature-specific components
├── interface/     # TypeScript types
└── constants/     # Feature constants
```

### 2. **State Management Strategy**
- **Server State**: React Query (NO custom useAxios hook)
- **Form State**: React Hook Form + Zod validation
- **Local State**: React hooks (useState, useReducer)

### 3. **Path Aliases**
Configured in `tsconfig.json`:
- `@/*` - Root src
- `@/components/*` - Components
- `@/modules/*` - Feature modules
- `@/hooks/*` - Custom hooks
- `@/axios/*` - HTTP client
- `@/config/*` - Configuration
- And more...

### 4. **Route Organization**
Using Next.js route groups:
- `(protected)` - Routes requiring authentication
- Future: `(auth)` - Authentication-related routes
- Future: `(public)` - Public landing pages

## 📦 Dependencies

### Core
- **next** (15.5.4) - React framework
- **react** (19.1.0) - UI library
- **typescript** (^5) - Type safety

### State & Data Fetching
- **@tanstack/react-query** (^5.90.2) - Server state management
- **axios** (^1.10.0) - HTTP client

### Forms & Validation
- **react-hook-form** (^7.54.2) - Form handling
- **zod** (^3.24.1) - Schema validation
- **@hookform/resolvers** (^3.9.1) - RHF + Zod integration

### UI & Styling
- **tailwindcss** (^4) - Utility-first CSS
- **clsx** (^2.1.1) - Conditional CSS classes
- **framer-motion** (^12.23.22) - Animations
- **lucide-react** (^0.468.0) - Icons

### Utilities
- **react-hot-toast** (^2.4.1) - Toast notifications

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Update values:
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_NAME=Care Connects
```

### 3. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Development Guidelines

### Creating a New Feature Module

1. **Create module structure**:
```bash
mkdir -p src/modules/[feature]/{schemas,services,hooks,components,interface}
```

2. **Create Zod schema** (`schemas/[name].schema.ts`):
```typescript
import { z } from 'zod';

export const exampleSchema = z.object({
  field: z.string().min(1, 'Required'),
});

export type ExampleFormData = z.infer<typeof exampleSchema>;
```

3. **Create API service** (`services/[feature].service.ts`):
```typescript
import Axios from '@/axios/axios';

export const getExamples = async () => {
  const response = await Axios.get('/examples');
  return response.data;
};
```

4. **Create React Query hook** (`hooks/use[Feature].ts`):
```typescript
import { useQuery } from '@tanstack/react-query';
import { getExamples } from '../services/[feature].service';
import { QUERY_KEYS } from '@/constants/queryKeys';

export const useExamples = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: [QUERY_KEYS.[FEATURE].GET_ALL],
    queryFn: getExamples,
  });

  return { examples: data?.data, isLoading, error };
};
```

### Form Handling Pattern

Use the `useFormHandler` hook with Zod schema:

```typescript
const {
  register,
  handleSubmit,
  formState: { errors },
  isSubmitting,
} = useFormHandler<FormData>({
  schema: mySchema,
  defaultValues: { /* ... */ },
  onSubmit: async (data) => {
    // API call here
  },
  onSuccess: () => {
    // Handle success
  },
});
```

### Component Pattern

Follow these principles:
- Each component in its own folder
- Props extend HTML attributes
- Use React.FC type annotation
- Handle loading states for all async operations

```typescript
interface MyComponentProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  isLoading?: boolean;
}

const MyComponent: React.FC<MyComponentProps> = ({
  title,
  isLoading,
  className,
  ...props
}) => {
  if (isLoading) return <LoadingSpinner />;

  return <div className={clsx('base-styles', className)} {...props}>{title}</div>;
};
```

## ✅ Next Steps for Migration

The following modules need to be migrated from the old frontend:

1. **Patients Module** - Patient management
2. **Appointments Module** - Appointment scheduling
3. **Consultations Module** - Medical consultations
4. **Clinic Module** - Clinic settings
5. **Users Module** - User management
6. **Layouts** - Sidebar, Header, Footer components

Each module should follow the established pattern with:
- Schemas for validation
- Services for API calls
- React Query hooks for data fetching
- Components for UI

## 📚 Reference Documents

- **cursor_dev_guidelines.md** - Comprehensive development guidelines
- **CLAUDE.md** - Project overview for AI assistance

## 🔑 Key Points

1. **ALWAYS** handle loading states - MANDATORY
2. **ALWAYS** use React Query for API calls (no custom useAxios)
3. **ALWAYS** use React Hook Form + Zod for forms
4. **NEVER** mutate state directly
5. **NEVER** skip error handling
6. Follow SOLID principles for all code
