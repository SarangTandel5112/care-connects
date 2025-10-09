# Next.js API Routes + React Query + Axios Integration Guide

This guide explains how to properly use Next.js API routes with our custom hooks, React Query, and Axios configuration.

## 🏗️ **Architecture Overview**

```
Frontend (React)          Next.js API Routes          External APIs
┌─────────────────┐      ┌─────────────────────┐     ┌─────────────────┐
│ Custom Hooks    │─────▶│ /api/auth/login    │     │ Third-party APIs│
│ React Query     │      │ /api/users         │     │ Payment APIs    │
│ Axios Client    │      │ /api/products      │     │ External Auth   │
└─────────────────┘      └─────────────────────┘     └─────────────────┘
```

## 🔧 **No Conflicts - Perfect Integration**

### **Why This Works Perfectly:**

1. **Next.js API Routes** - Your backend endpoints (`/api/*`)
2. **Axios** - HTTP client for making requests
3. **React Query** - Caching, synchronization, background updates
4. **Custom Hooks** - Abstraction layer for easy usage

### **The Flow:**

```
Component → Custom Hook → React Query → Axios → Next.js API Route → Database
```

## 📝 **Usage Examples**

### **1. Next.js API Routes (Recommended)**

#### **Using `useNextApiQuery` for GET requests:**

```tsx
import { useNextApiQuery } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function UsersList() {
  const {
    data: users,
    isLoading,
    error,
  } = useNextApiQuery(
    [QUERY_KEYS.USER.GET_ALL_USERS],
    '/api/users', // Next.js API route
    {
      enabled: true,
      staleTime: 5 * 60 * 1000, // 5 minutes
      requireAuth: true, // Requires authentication
    }
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      {users?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

#### **Using `useNextApiMutation` for POST/PUT/DELETE:**

```tsx
import { useNextApiMutation } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function CreateUserForm() {
  const createUserMutation = useNextApiMutation(
    '/api/users', // Next.js API route
    'POST', // HTTP method
    {
      successMessage: 'User created successfully!',
      errorMessage: 'Failed to create user',
      invalidateQueries: [QUERY_KEYS.USER.GET_ALL_USERS],
      requireAuth: true,
    }
  );

  const handleSubmit = (userData) => {
    createUserMutation.mutate(userData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={createUserMutation.isPending}>
        {createUserMutation.isPending ? 'Creating...' : 'Create User'}
      </button>
    </form>
  );
}
```

#### **Using `useNextApiPaginatedQuery` for paginated data:**

```tsx
import { useNextApiPaginatedQuery } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function PaginatedUsersList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: users,
    isLoading,
    error,
  } = useNextApiPaginatedQuery([QUERY_KEYS.USER.GET_ALL_USERS], '/api/users', {
    page,
    limit,
    requireAuth: true,
    additionalParams: {
      sort: 'name',
      order: 'asc',
    },
  });

  return (
    <div>
      {users?.data?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
      <Pagination
        currentPage={page}
        onPageChange={setPage}
        totalPages={users?.pagination?.totalPages}
      />
    </div>
  );
}
```

### **2. External APIs (When Needed)**

#### **Using `useAuthenticatedQuery` for external APIs:**

```tsx
import { useAuthenticatedQuery } from '@/hooks';

function ExternalDataComponent() {
  const { data, isLoading, error } = useAuthenticatedQuery(
    ['external-data'],
    'https://api.external-service.com/data', // External API
    {
      enabled: true,
      requireAuth: true, // Will include auth headers
    }
  );

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {data && <DataDisplay data={data} />}
    </div>
  );
}
```

## 🔐 **Authentication Integration**

### **Automatic Token Handling:**

```tsx
// All hooks automatically handle authentication
const { data } = useNextApiQuery(
  ['protected-data'],
  '/api/protected-endpoint',
  { requireAuth: true } // Automatically includes Bearer token
);

// For public endpoints
const { data } = useNextApiQuery(
  ['public-data'],
  '/api/public-endpoint',
  { requireAuth: false } // No auth required
);
```

### **Token Refresh Integration:**

```tsx
// Tokens are automatically refreshed when needed
const { data } = useNextApiQuery(
  ['user-profile'],
  '/api/user/profile',
  { requireAuth: true } // Auto-refreshes token if expired
);
```

## 📁 **API Route Structure**

### **Recommended File Structure:**

```
src/app/api/
├── auth/
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── me/route.ts
│   └── refresh/route.ts
├── users/
│   ├── route.ts          # GET /api/users, POST /api/users
│   ├── [id]/route.ts     # GET /api/users/[id], PUT /api/users/[id], DELETE /api/users/[id]
│   └── search/route.ts   # GET /api/users/search
├── products/
│   ├── route.ts
│   └── [id]/route.ts
└── health/route.ts       # Health check endpoint
```

### **Example API Route Implementation:**

```typescript
// src/app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const userSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  role: z.enum(['admin', 'user']),
});

export async function GET(request: NextRequest) {
  try {
    // TODO: Fetch users from database
    const users = [
      { id: '1', name: 'John Doe', email: 'john@example.com', role: 'user' },
      { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'admin' },
    ];

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const userData = userSchema.parse(body);

    // TODO: Create user in database
    const newUser = {
      id: Date.now().toString(),
      ...userData,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      {
        success: true,
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, message: 'Invalid data', errors: error.errors },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: false, message: 'Failed to create user' }, { status: 500 });
  }
}
```

## 🔄 **React Query Integration**

### **Automatic Caching:**

```tsx
// Data is automatically cached and synchronized
const { data: users } = useNextApiQuery(['users'], '/api/users');

// When you create a new user, the cache is automatically updated
const createUser = useNextApiMutation('/api/users', 'POST', {
  invalidateQueries: [['users']], // Automatically refetches users
});
```

### **Background Updates:**

```tsx
// Data is automatically refetched in the background
const { data } = useNextApiQuery(['live-data'], '/api/live-data', {
  staleTime: 30 * 1000, // Consider stale after 30 seconds
  refetchInterval: 60 * 1000, // Refetch every minute
});
```

## 🚀 **Performance Benefits**

### **1. Automatic Caching:**

- Data is cached by React Query
- Reduces unnecessary API calls
- Instant loading for cached data

### **2. Background Synchronization:**

- Data is updated in the background
- Users see fresh data without waiting
- Optimistic updates for better UX

### **3. Request Deduplication:**

- Multiple components requesting same data
- Only one API call is made
- All components get the same data

### **4. Error Handling:**

- Automatic retry on failure
- Consistent error handling
- User-friendly error messages

## 🔧 **Configuration**

### **Axios Configuration:**

```typescript
// src/axios/axios.ts
const Axios = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '', // Empty for relative URLs
  timeout: 10000,
});

// Automatic token injection
Axios.interceptors.request.use((config) => {
  const token = tokenStorage.getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### **Environment Variables:**

```bash
# .env.local
NEXT_PUBLIC_API_BASE_URL=  # Empty for Next.js API routes
JWT_SECRET=your-jwt-secret
JWT_REFRESH_SECRET=your-refresh-secret
```

## 📊 **Comparison: Next.js API vs External API**

| Feature            | Next.js API Routes       | External APIs                   |
| ------------------ | ------------------------ | ------------------------------- |
| **URL**            | `/api/users`             | `https://api.example.com/users` |
| **Authentication** | Automatic via middleware | Manual token handling           |
| **Caching**        | React Query handles both | React Query handles both        |
| **Error Handling** | Consistent with hooks    | Consistent with hooks           |
| **Type Safety**    | Full TypeScript support  | Full TypeScript support         |
| **Performance**    | Faster (same server)     | Network latency                 |
| **Deployment**     | Single deployment        | Separate backend                |

## 🎯 **Best Practices**

### **1. Use Next.js API Routes for:**

- Authentication endpoints
- Database operations
- Business logic
- Internal services

### **2. Use External APIs for:**

- Third-party services
- Payment processing
- External authentication
- Microservices

### **3. Always Use Custom Hooks:**

```tsx
// ✅ Good - Using custom hooks
const { data } = useNextApiQuery(['users'], '/api/users');

// ❌ Avoid - Direct API calls
const [users, setUsers] = useState([]);
useEffect(() => {
  fetch('/api/users')
    .then((res) => res.json())
    .then(setUsers);
}, []);
```

### **4. Proper Error Handling:**

```tsx
const { data, error, isLoading } = useNextApiQuery(['data'], '/api/data');

if (error) {
  return <ErrorBoundary error={error} />;
}
```

This integration provides the best of both worlds: the simplicity of Next.js API routes with the power of React Query and Axios for optimal performance and developer experience.
