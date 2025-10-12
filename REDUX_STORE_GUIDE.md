# Redux Store Guide

Complete guide for using the Redux store in the Care Connects Next.js boilerplate.

## 📚 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [Store Structure](#store-structure)
- [Usage Examples](#usage-examples)
- [API Reference](#api-reference)
- [Best Practices](#best-practices)
- [Migration Guide](#migration-guide)

---

## Overview

The Redux store is set up using **Redux Toolkit** with TypeScript for type-safe state management. It manages:

- **User state**: Current user data, profile information, permissions
- **Auth state**: Authentication tokens, login status

The store is integrated with React Query for server state, creating a hybrid approach where:
- **Redux**: Manages global client state (user data, auth status)
- **React Query**: Manages server state and API caching

---

## Architecture

### File Structure

```
src/
├── store/
│   ├── index.ts                 # Store configuration
│   ├── hooks.ts                 # Typed Redux hooks
│   ├── actions.ts               # Centralized action exports
│   ├── selectors.ts             # Selector functions
│   └── slices/
│       ├── userSlice.ts         # User state management
│       └── authSlice.ts         # Auth state management
├── hooks/
│   └── useStore.ts              # Custom hooks combining selectors + actions
└── providers/
    └── StoreProvider.tsx        # Redux Provider component
```

### State Shape

```typescript
{
  user: {
    currentUser: User | null;
    isLoading: boolean;
    error: string | null;
  },
  auth: {
    isAuthenticated: boolean;
    tokens: AuthTokens | null;
    isLoading: boolean;
    error: string | null;
  }
}
```

---

## Quick Start

### 1. Basic Usage with Custom Hooks (Recommended)

The easiest way to use the store is with the custom hooks:

```tsx
import { useUserStore, useAuthStore, useCombinedStore } from '@/hooks/useStore';

function MyComponent() {
  // Get user data and actions
  const { user, setCurrentUser, updateCurrentUser } = useUserStore();

  // Get auth data and actions
  const { isAuthenticated, tokens, setAuthTokens } = useAuthStore();

  // Or use combined hook for both
  const { user, isAuthenticated, login, logout } = useCombinedStore();

  return (
    <div>
      {user && <p>Welcome, {user.name}!</p>}
      {isAuthenticated && <p>You are logged in</p>}
    </div>
  );
}
```

### 2. Using Selectors and Dispatch (Advanced)

For more control, use typed hooks and selectors:

```tsx
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { selectCurrentUser, selectIsAuthenticated } from '@/store/selectors';
import { setUser, clearUser } from '@/store/actions';

function MyComponent() {
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  const handleUpdateUser = () => {
    dispatch(setUser({ ...userData }));
  };

  return <div>...</div>;
}
```

---

## Store Structure

### User Slice (`userSlice.ts`)

Manages current user information.

#### State
```typescript
interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Actions
- `setUser(user: User)` - Set current user
- `updateUser(partial: Partial<User>)` - Update specific user fields
- `clearUser()` - Clear user data
- `setLoading(boolean)` - Set loading state
- `setError(string)` - Set error message
- `clearError()` - Clear error message

### Auth Slice (`authSlice.ts`)

Manages authentication state and tokens.

#### State
```typescript
interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
}
```

#### Actions
- `setTokens(tokens: AuthTokens)` - Set auth tokens
- `clearTokens()` - Clear tokens (logout)
- `setAuthenticated(boolean)` - Set auth status
- `updateAccessToken(string)` - Update access token only
- `setLoading(boolean)` - Set loading state
- `setError(string)` - Set error message
- `clearError()` - Clear error message

---

## Usage Examples

### Example 1: User Profile Component

```tsx
import { useUserStore } from '@/hooks/useStore';

function UserProfile() {
  const { user, updateCurrentUser, isLoading, error } = useUserStore();

  const handleUpdateName = async (newName: string) => {
    try {
      // Call API to update on server
      await updateUserApi({ name: newName });

      // Update Redux store
      updateCurrentUser({ name: newName });
    } catch (err) {
      console.error('Failed to update user', err);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user data</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Role: {user.role}</p>
      <button onClick={() => handleUpdateName('New Name')}>
        Update Name
      </button>
    </div>
  );
}
```

### Example 2: Login Component

```tsx
import { useLogin } from '@/modules/auth/hooks/useAuth';
import { useCombinedStore } from '@/hooks/useStore';

function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const { isAuthenticated } = useCombinedStore();

  const handleSubmit = (data: { email: string; password: string }) => {
    login(data); // Automatically syncs to Redux store
  };

  if (isAuthenticated) {
    return <div>Already logged in</div>;
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <button type="submit" disabled={isPending}>
        {isPending ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Example 3: Permission-Based Rendering

```tsx
import { usePermissions } from '@/hooks/useStore';

function AdminPanel() {
  const { hasPermission, hasRole, hasAnyRole } = usePermissions();

  if (!hasAnyRole(['admin', 'doctor'])) {
    return <div>Access Denied</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>

      {hasPermission('users:create') && (
        <button>Create User</button>
      )}

      {hasPermission('users:delete') && (
        <button>Delete User</button>
      )}

      {hasRole('admin') && (
        <div>Super Admin Controls</div>
      )}
    </div>
  );
}
```

### Example 4: Navbar with User Info

```tsx
import { useCombinedStore } from '@/hooks/useStore';
import { useLogout } from '@/modules/auth/hooks/useAuth';

function Navbar() {
  const { user, isAuthenticated } = useCombinedStore();
  const { mutate: logout } = useLogout();

  return (
    <nav>
      <div>Care Connects</div>

      {isAuthenticated && user && (
        <div>
          <span>Welcome, {user.name}</span>
          <span>Role: {user.role}</span>
          <button onClick={() => logout()}>Logout</button>
        </div>
      )}
    </nav>
  );
}
```

### Example 5: Protected Route

```tsx
import { useAuthStore } from '@/hooks/useStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return null;

  return <div>Protected Content</div>;
}
```

### Example 6: Updating User Data from API

```tsx
import { useUserStore } from '@/hooks/useStore';
import { useEffect } from 'react';

function UserDataSync() {
  const { setCurrentUser, setLoading, setError } = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/auth/me');
        const userData = await response.json();
        setCurrentUser(userData);
      } catch (err) {
        setError('Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  return null; // This is a sync component
}
```

---

## API Reference

### Custom Hooks

#### `useUserStore()`
Returns user state and actions.

**Returns:**
```typescript
{
  // State
  user: User | null;
  isLoading: boolean;
  error: string | null;
  role: User['role'] | undefined;
  permissions: string[];
  email: string | undefined;
  name: string | undefined;
  userId: string | undefined;

  // Actions
  setCurrentUser: (user: User) => void;
  updateCurrentUser: (user: Partial<User>) => void;
  clearCurrentUser: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}
```

#### `useAuthStore()`
Returns auth state and actions.

**Returns:**
```typescript
{
  // State
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  accessToken: string | undefined;
  refreshToken: string | undefined;
  isLoading: boolean;
  error: string | null;

  // Actions
  setAuthTokens: (tokens: AuthTokens) => void;
  clearAuthTokens: () => void;
  setIsAuthenticated: (authenticated: boolean) => void;
  updateToken: (accessToken: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string) => void;
  clearError: () => void;
}
```

#### `useCombinedStore()`
Returns combined user and auth state.

**Returns:**
```typescript
{
  // State
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  allErrors: string[];

  // Actions
  login: (user: User, tokens: AuthTokens) => void;
  logout: () => void;
}
```

#### `usePermissions()`
Returns permission checking utilities.

**Returns:**
```typescript
{
  permissions: string[];
  role: User['role'] | undefined;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  hasRole: (role: User['role']) => boolean;
  hasAnyRole: (roles: User['role'][]) => boolean;
}
```

### Selectors

All selectors are available in `@/store/selectors`:

```typescript
// User selectors
selectCurrentUser(state) => User | null
selectUserLoading(state) => boolean
selectUserError(state) => string | null
selectUserRole(state) => User['role'] | undefined
selectUserPermissions(state) => string[]
selectUserEmail(state) => string | undefined
selectUserName(state) => string | undefined
selectUserId(state) => string | undefined

// Auth selectors
selectIsAuthenticated(state) => boolean
selectAuthTokens(state) => AuthTokens | null
selectAccessToken(state) => string | undefined
selectRefreshToken(state) => string | undefined
selectAuthLoading(state) => boolean
selectAuthError(state) => string | null

// Combined selectors
selectIsLoading(state) => boolean
selectAllErrors(state) => string[]
selectHasPermission(permission: string)(state) => boolean
selectHasRole(role: User['role'])(state) => boolean
```

---

## Best Practices

### 1. Use Custom Hooks (Preferred)
```tsx
// ✅ Good - Easy to use and understand
const { user, setCurrentUser } = useUserStore();

// ⚠️ Also fine - More control
const user = useAppSelector(selectCurrentUser);
const dispatch = useAppDispatch();
dispatch(setUser(userData));
```

### 2. Keep Redux for Global Client State Only
```tsx
// ✅ Good - Global state in Redux
const { user } = useUserStore();

// ✅ Good - Server state in React Query
const { data: patients } = usePatients();

// ❌ Bad - Don't put server data in Redux
// dispatch(setPatients(patientsData)); // Use React Query instead
```

### 3. Always Use Typed Hooks
```tsx
// ✅ Good - Type safe
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// ❌ Bad - Not type safe
import { useSelector, useDispatch } from 'react-redux';
```

### 4. Combine Actions When Possible
```tsx
// ✅ Good - Single action for related updates
const { login } = useCombinedStore();
login(userData, tokens);

// ⚠️ Less ideal - Multiple dispatches
dispatch(setUser(userData));
dispatch(setTokens(tokens));
```

### 5. Handle Errors Properly
```tsx
const { error, clearError } = useUserStore();

useEffect(() => {
  if (error) {
    toast.error(error);
    clearError(); // Clear after displaying
  }
}, [error]);
```

---

## Migration Guide

### Migrating from React Query Only

If you were using only React Query before:

**Before:**
```tsx
const { data: user } = useCurrentUser();
```

**After:**
```tsx
// Option 1: Use Redux-synced hook (recommended)
const { user } = useUserStore();

// Option 2: Use existing hook (auto-syncs to Redux)
const { data: user } = useCurrentUser(); // Now syncs to Redux automatically
```

### Migrating from Context API

If you were using Context API:

**Before:**
```tsx
const { user, setUser } = useAuthContext();
```

**After:**
```tsx
const { user, setCurrentUser } = useUserStore();
```

---

## Redux DevTools

Redux DevTools are enabled in development mode. Install the browser extension:

- [Chrome](https://chrome.google.com/webstore/detail/redux-devtools/)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/reduxdevtools/)

You can inspect state, track actions, and time-travel debug your application.

---

## Troubleshooting

### Issue: State not persisting across page refresh

**Solution**: Redux state is in-memory. For persistence:
- Use `tokenStorage` for tokens (already implemented)
- Use `localStorage` or cookies for user preferences
- Fetch user data on app load

### Issue: TypeScript errors with selectors

**Solution**: Use typed hooks:
```tsx
import { useAppSelector } from '@/store/hooks';
// Not: import { useSelector } from 'react-redux';
```

### Issue: Actions not updating state

**Solution**: Make sure you're dispatching correctly:
```tsx
const dispatch = useAppDispatch();
dispatch(setUser(userData)); // ✅
setUser(userData); // ❌ Won't work without dispatch
```

---

## Additional Resources

- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Redux Hooks](https://react-redux.js.org/api/hooks)
- [TypeScript with Redux](https://redux.js.org/usage/usage-with-typescript)

---

## Summary

- ✅ Redux store is set up and ready to use
- ✅ User and Auth slices manage global state
- ✅ Custom hooks provide easy access to state and actions
- ✅ Fully type-safe with TypeScript
- ✅ Integrated with existing auth hooks
- ✅ Redux DevTools enabled for debugging

**Use the custom hooks in `@/hooks/useStore` for the easiest and cleanest code!**
