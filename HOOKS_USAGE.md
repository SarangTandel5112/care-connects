# Custom Hooks Usage Examples

This document provides examples of how to use the custom hooks we've created for better code organization and reusability.

## 🔐 Authentication Hooks

### `useAuthState` - Complete Authentication State

```tsx
import { useAuthState } from '@/hooks';

function Dashboard() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    isTokenValid,
    isTokenExpiringSoon,
    shouldShowExpiringWarning,
  } = useAuthState();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <LoginPrompt />;
  if (shouldShowExpiringWarning) return <TokenExpiringWarning />;

  return (
    <div>
      <h1>Welcome, {user?.name}!</h1>
      <p>Your session is valid: {isTokenValid ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### `useTokenManager` - Token Management

```tsx
import { useTokenManager } from '@/hooks';

function TokenStatus() {
  const { isTokenValid, isTokenExpiringSoon, checkTokenStatus, handleTokenRefresh } =
    useTokenManager();

  return (
    <div>
      <p>Token Valid: {isTokenValid ? '✅' : '❌'}</p>
      <p>Expiring Soon: {isTokenExpiringSoon ? '⚠️' : '✅'}</p>
      <button onClick={checkTokenStatus}>Check Status</button>
      <button onClick={handleTokenRefresh}>Refresh Token</button>
    </div>
  );
}
```

### `useAuthWithRefresh` - Complete Auth with Auto-Refresh

```tsx
import { useAuthWithRefresh } from '@/hooks';

function LoginForm() {
  const { login, logout, isAuthenticated, user } = useAuthWithRefresh();

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      // Token refresh is handled automatically
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <form onSubmit={handleLogin}>{/* form fields */}</form>;
}
```

## 🌐 API Hooks

### `useAuthenticatedQuery` - Authenticated Data Fetching

```tsx
import { useAuthenticatedQuery } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function UserProfile({ userId }: { userId: string }) {
  const {
    data: user,
    isLoading,
    error,
    refetch,
  } = useAuthenticatedQuery([QUERY_KEYS.USER.GET_USER_BY_ID, userId], `/users/${userId}`, {
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div>
      <h2>{user?.name}</h2>
      <p>{user?.email}</p>
      <button onClick={() => refetch()}>Refresh</button>
    </div>
  );
}
```

### `useAuthenticatedMutation` - Authenticated Data Mutations

```tsx
import { useAuthenticatedMutation } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function CreateUserForm() {
  const createUserMutation = useAuthenticatedMutation(
    async (userData) => {
      const response = await Axios.post('/users', userData);
      return response.data;
    },
    {
      successMessage: 'User created successfully!',
      errorMessage: 'Failed to create user',
      invalidateQueries: [QUERY_KEYS.USER.GET_ALL_USERS],
    }
  );

  const handleSubmit = (data) => {
    createUserMutation.mutate(data);
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

### `usePaginatedQuery` - Paginated Data

```tsx
import { usePaginatedQuery } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function UsersList() {
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: users,
    isLoading,
    error,
  } = usePaginatedQuery([QUERY_KEYS.USER.GET_ALL_USERS], '/users', {
    page,
    limit,
  });

  return (
    <div>
      {users?.map((user) => (
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

### `useSearchQuery` - Search with Debouncing

```tsx
import { useSearchQuery } from '@/hooks';
import { QUERY_KEYS } from '@/constants/queryKeys';

function SearchUsers() {
  const [searchTerm, setSearchTerm] = useState('');

  const { data: searchResults, isLoading } = useSearchQuery(
    [QUERY_KEYS.USER.SEARCH],
    '/users/search',
    searchTerm,
    {
      debounceMs: 300,
      minLength: 2,
    }
  );

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users..."
      />

      {isLoading && <LoadingSpinner />}

      {searchResults?.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## 📝 Form Hooks

### `useFormHandler` - Enhanced Form Handling

```tsx
import { useFormHandler } from '@/hooks';
import { loginSchema } from '@/modules/auth/schemas/login.schema';

function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    isSubmitting,
    submitError,
    clearError,
  } = useFormHandler({
    schema: loginSchema,
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async (data) => {
      await loginAPI(data);
    },
    successMessage: 'Login successful!',
    errorMessage: 'Login failed. Please try again.',
    debounceMs: 0, // No debouncing for login
  });

  return (
    <form onSubmit={handleSubmit}>
      <input {...register('email')} type="email" placeholder="Email" />
      {errors.email && <span>{errors.email.message}</span>}

      <input {...register('password')} type="password" placeholder="Password" />
      {errors.password && <span>{errors.password.message}</span>}

      {submitError && (
        <div>
          <span>{submitError}</span>
          <button onClick={clearError}>Clear</button>
        </div>
      )}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### `useFormValidation` - Real-time Validation

```tsx
import { useFormValidation } from '@/hooks';
import { userSchema } from '@/schemas/user.schema';

function UserForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    hasErrors,
    hasTouchedErrors,
    isValid,
    isDirty,
  } = useFormValidation(userSchema, {
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} placeholder="Name" />
      {errors.name && <span>{errors.name.message}</span>}

      <div>
        <p>Form Status:</p>
        <p>Has Errors: {hasErrors ? 'Yes' : 'No'}</p>
        <p>Has Touched Errors: {hasTouchedErrors ? 'Yes' : 'No'}</p>
        <p>Is Valid: {isValid ? 'Yes' : 'No'}</p>
        <p>Is Dirty: {isDirty ? 'Yes' : 'No'}</p>
      </div>

      <button type="submit" disabled={!isValid || hasErrors}>
        Submit
      </button>
    </form>
  );
}
```

### `usePersistentForm` - Form with Persistence

```tsx
import { usePersistentForm } from '@/hooks';

function LongForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    clearStorage,
    storedValue,
  } = usePersistentForm(
    'draft-form',
    {
      title: '',
      description: '',
      category: '',
    },
    {
      storage: 'localStorage',
      debounceMs: 1000,
    }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('title')} placeholder="Title" />

      <textarea {...register('description')} placeholder="Description" />

      <select {...register('category')}>
        <option value="">Select Category</option>
        <option value="tech">Technology</option>
        <option value="health">Health</option>
      </select>

      <div>
        <p>Form data is automatically saved to localStorage</p>
        <button type="button" onClick={clearStorage}>
          Clear Draft
        </button>
      </div>

      <button type="submit">Submit</button>
    </form>
  );
}
```

## 🔧 Utility Hooks

### `useLocalStorage` - Type-safe Local Storage

```tsx
import { useLocalStorage } from '@/hooks';

function Settings() {
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');
  const [preferences, setPreferences] = useLocalStorage('preferences', {
    notifications: true,
    language: 'en',
  });

  return (
    <div>
      <select value={theme} onChange={(e) => setTheme(e.target.value)}>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>

      <button onClick={removeTheme}>Reset Theme</button>

      <div>
        <label>
          <input
            type="checkbox"
            checked={preferences.notifications}
            onChange={(e) =>
              setPreferences((prev) => ({
                ...prev,
                notifications: e.target.checked,
              }))
            }
          />
          Enable Notifications
        </label>
      </div>
    </div>
  );
}
```

### `useToggle` - Boolean State Management

```tsx
import { useToggle } from '@/hooks';

function ToggleExample() {
  const [isOpen, toggleOpen, setOpen] = useToggle(false);
  const [isLoading, toggleLoading] = useToggle();

  return (
    <div>
      <button onClick={toggleOpen}>{isOpen ? 'Close' : 'Open'}</button>

      <button onClick={() => setOpen(true)}>Force Open</button>

      <button onClick={toggleLoading}>{isLoading ? 'Stop Loading' : 'Start Loading'}</button>

      {isOpen && <div>Content is open!</div>}
      {isLoading && <div>Loading...</div>}
    </div>
  );
}
```

### `useAsync` - Async Operations

```tsx
import { useAsync } from '@/hooks';

function DataFetcher() {
  const { data, loading, error, execute } = useAsync(
    async () => {
      const response = await fetch('/api/data');
      return response.json();
    },
    false // Don't execute immediately
  );

  return (
    <div>
      <button onClick={execute} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Data'}
      </button>

      {error && <div>Error: {error.message}</div>}
      {data && <div>Data: {JSON.stringify(data)}</div>}
    </div>
  );
}
```

### `useDebounce` - Debounced Values

```tsx
import { useDebounce } from '@/hooks';

function SearchInput() {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search with debounced term
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

## 🎯 Best Practices

### 1. **Hook Composition**

```tsx
// Combine multiple hooks for complex functionality
function ComplexComponent() {
  const authState = useAuthState();
  const { data: userData } = useAuthenticatedQuery(
    ['user', authState.user?.id],
    `/users/${authState.user?.id}`,
    { enabled: !!authState.user?.id }
  );

  const { register, handleSubmit } = useFormHandler({
    schema: userUpdateSchema,
    onSubmit: async (data) => {
      await updateUserAPI(data);
    },
  });

  // Component logic...
}
```

### 2. **Error Handling**

```tsx
function RobustComponent() {
  const { data, loading, error } = useAuthenticatedQuery(['data'], '/api/data', {
    retry: 3,
    onError: (error) => {
      if (error.status === 401) {
        // Handle auth error
      } else if (error.status >= 500) {
        // Handle server error
      }
    },
  });

  if (error) {
    return <ErrorBoundary error={error} />;
  }

  // Component logic...
}
```

### 3. **Performance Optimization**

```tsx
function OptimizedComponent() {
  // Use debouncing for expensive operations
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use pagination for large datasets
  const { data } = usePaginatedQuery(['items'], '/api/items', { page, limit: 20 });

  // Use memoization for expensive calculations
  const expensiveValue = useMemo(() => {
    return calculateExpensiveValue(data);
  }, [data]);

  // Component logic...
}
```

These custom hooks provide a solid foundation for building scalable, maintainable React applications with proper error handling, authentication, and performance optimization.
