# API Hooks Documentation

This folder contains custom React hooks for making API calls to Next.js API routes. All hooks are built on top of React Query and provide authentication, error handling, and caching out of the box.

## 📁 File Structure

```
src/hooks/api/
├── index.ts              # Barrel exports
├── useApiGet.ts          # GET requests
├── useApiGetPaginated.ts # Paginated GET requests
├── useApiPost.ts         # POST/PUT/PATCH/DELETE requests
├── useSearchApi.ts       # Search with debouncing
└── README.md            # This documentation
```

## 🚀 Available Hooks

### 1. `useApiGet` - Basic GET Requests

**Purpose:** Fetch data from Next.js API routes
**HTTP Method:** GET
**Features:** Authentication, caching, error handling, query parameters

```typescript
import { useApiGet } from '@/hooks/api';

// Basic usage
const { data, isLoading, error } = useApiGet(['users'], 'users');

// With query parameters
const { data: user } = useApiGet(['user', userId], 'users', {
  params: { id: userId, include: 'profile' },
});

// Conditional query
const { data } = useApiGet(['profile'], 'profile', {
  enabled: !!userId, // Only fetch if userId exists
  staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  requireAuth: true, // Default: true
});
```

**Options:**

- `enabled?: boolean` - Enable/disable the query
- `staleTime?: number` - How long data stays fresh (ms)
- `gcTime?: number` - How long data stays in cache (ms)
- `retry?: boolean | number` - Retry failed requests
- `requireAuth?: boolean` - Require authentication (default: true)
- `params?: Record<string, string | number>` - Query parameters

---

### 2. `useApiGetPaginated` - Paginated GET Requests

**Purpose:** Fetch paginated data from Next.js API routes
**HTTP Method:** GET
**Features:** Automatic pagination, page/limit handling

```typescript
import { useApiGetPaginated } from '@/hooks/api';

// Basic pagination
const { data, isLoading } = useApiGetPaginated(['patients'], 'patients', {
  page: 1,
  limit: 10,
});

// With additional filters
const { data } = useApiGetPaginated(['patients'], 'patients', {
  page: currentPage,
  limit: 20,
  additionalParams: {
    status: 'active',
    department: 'cardiology',
  },
});
```

**Options:**

- `page?: number` - Page number (default: 1)
- `limit?: number` - Items per page (default: 10)
- `enabled?: boolean` - Enable/disable the query
- `staleTime?: number` - Cache duration
- `requireAuth?: boolean` - Require authentication
- `additionalParams?: Record<string, string | number>` - Extra query params

---

### 3. `useApiPost` - Write Operations

**Purpose:** Create, update, or delete data via Next.js API routes
**HTTP Methods:** POST, PUT, PATCH, DELETE
**Features:** Manual triggering, success/error callbacks, toast notifications

```typescript
import { useApiPost } from '@/hooks/api';

// Create user
const createUser = useApiPost('users', 'POST', {
  successMessage: 'User created successfully!',
  invalidateQueries: [['users']], // Refresh users list
});

// Update user
const updateUser = useApiPost('users', 'PUT', {
  successMessage: 'User updated!',
  invalidateQueries: [['users'], ['user', userId]],
});

// Delete user
const deleteUser = useApiPost('users', 'DELETE', {
  successMessage: 'User deleted!',
  invalidateQueries: [['users']],
});

// Usage in component
const handleCreate = () => {
  createUser.mutate({
    name: 'John Doe',
    email: 'john@example.com',
  });
};
```

**Options:**

- `onSuccess?: (data, variables) => void` - Success callback
- `onError?: (error, variables) => void` - Error callback
- `successMessage?: string` - Success toast message
- `errorMessage?: string` - Error toast message
- `invalidateQueries?: string[][]` - Queries to refresh after success
- `requireAuth?: boolean` - Require authentication (default: true)

---

### 4. `useApiSearch` - Search with Debouncing

**Purpose:** Search data with automatic debouncing
**HTTP Method:** GET
**Features:** Debounced search, minimum length validation

```typescript
import { useApiSearch } from '@/hooks/api';

// Basic search
const { data, isLoading } = useApiSearch(['patients'], 'patients', searchTerm);

// With custom options
const { data } = useApiSearch(['patients'], 'patients', searchTerm, {
  debounceMs: 500, // Wait 500ms after user stops typing
  minLength: 3, // Minimum 3 characters to search
  enabled: !!searchTerm, // Only search if term exists
  requireAuth: true,
});
```

**Options:**

- `debounceMs?: number` - Debounce delay (default: 300ms)
- `minLength?: number` - Minimum search length (default: 2)
- `enabled?: boolean` - Enable/disable search
- `requireAuth?: boolean` - Require authentication

---

## 🔐 Authentication

All hooks automatically handle authentication by:

1. **Checking for valid JWT token** before making requests
2. **Adding Authorization header** with Bearer token
3. **Handling token expiration** with proper error messages
4. **Supporting public endpoints** with `requireAuth: false`

```typescript
// Public endpoint (no auth required)
const { data } = useApiGet(['public-data'], 'public-data', {
  requireAuth: false,
});

// Authenticated endpoint (default behavior)
const { data } = useApiGet(['private-data'], 'private-data');
```

---

## 🎯 Best Practices

### 1. **Query Keys**

Use descriptive, hierarchical query keys:

```typescript
// ✅ Good
['users'][('users', userId)][('users', userId, 'profile')][('patients', 'active')][
  ('patients', 'search', searchTerm)
][
  // ❌ Avoid
  'data'
]['stuff']['temp'];
```

### 2. **Error Handling**

Handle errors appropriately:

```typescript
const { data, error, isLoading } = useApiGet(['users'], 'users');

if (error) {
  return <div>Error: {error.message}</div>;
}

if (isLoading) {
  return <div>Loading...</div>;
}
```

### 3. **Cache Invalidation**

Invalidate related queries after mutations:

```typescript
const createUser = useApiPost('users', 'POST', {
  invalidateQueries: [
    ['users'], // Refresh users list
    ['users', 'count'], // Refresh user count
    ['dashboard'], // Refresh dashboard stats
  ],
});
```

### 4. **Conditional Queries**

Use `enabled` option for conditional queries:

```typescript
// Only fetch if user is authenticated
const { data } = useApiGet(['profile'], 'profile', {
  enabled: !!user,
});

// Only fetch if ID exists
const { data } = useApiGet(['user', userId], 'users', {
  enabled: !!userId,
});
```

---

## 🔄 Migration Guide

If you're migrating from the old API hooks:

```typescript
// Old → New
useApiQuery → useApiGet
useApiPaginatedQuery → useApiGetPaginated
useApiMutation → useApiPost
useSearchApi → useApiSearch
```

---

## 🐛 Troubleshooting

### Common Issues:

1. **"No valid token available"**
   - Check if user is logged in
   - Verify token is not expired
   - Use `requireAuth: false` for public endpoints

2. **Query not updating**
   - Check query keys are unique
   - Verify cache invalidation is working
   - Use `staleTime: 0` to always fetch fresh data

3. **Search not working**
   - Check `minLength` setting
   - Verify `debounceMs` is appropriate
   - Ensure search term is not empty

---

## 📝 Examples

### Complete User Management Example:

```typescript
import {
  useApiGet,
  useApiGetPaginated,
  useApiPost,
  useApiSearch
} from '@/hooks/api';

function UserManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Get paginated users
  const { data: users, isLoading } = useApiGetPaginated(['users'], 'users', {
    page: currentPage,
    limit: 10
  });

  // Search users
  const { data: searchResults } = useApiSearch(['users', 'search'], 'users', searchTerm);

  // Create user
  const createUser = useApiPost('users', 'POST', {
    successMessage: 'User created!',
    invalidateQueries: [['users']]
  });

  // Update user
  const updateUser = useApiPost('users', 'PUT', {
    successMessage: 'User updated!',
    invalidateQueries: [['users']]
  });

  // Delete user
  const deleteUser = useApiPost('users', 'DELETE', {
    successMessage: 'User deleted!',
    invalidateQueries: [['users']]
  });

  const handleCreate = (userData) => {
    createUser.mutate(userData);
  };

  const handleUpdate = (userId, userData) => {
    updateUser.mutate(userData);
  };

  const handleDelete = (userId) => {
    deleteUser.mutate({ id: userId });
  };

  return (
    <div>
      {/* Your component JSX */}
    </div>
  );
}
```

This documentation should help anyone understand and use the API hooks effectively! 🚀
