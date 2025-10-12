# Redux Store

This directory contains the Redux store configuration for global state management.

## Quick Reference

### Import Paths

```typescript
// Custom hooks (recommended)
import { useUserStore, useAuthStore, useCombinedStore, usePermissions } from '@/hooks/useStore';

// Typed Redux hooks
import { useAppSelector, useAppDispatch } from '@/store/hooks';

// Selectors
import { selectCurrentUser, selectIsAuthenticated } from '@/store/selectors';

// Actions
import { setUser, setTokens, clearUser, clearTokens } from '@/store/actions';
```

### Basic Usage

```typescript
// 1. Using custom hooks (easiest)
const { user, setCurrentUser } = useUserStore();
const { isAuthenticated } = useAuthStore();

// 2. Using selectors and dispatch
const user = useAppSelector(selectCurrentUser);
const dispatch = useAppDispatch();
dispatch(setUser(userData));
```

## Files

### Core Files
- **`index.ts`** - Store configuration and types
- **`hooks.ts`** - Typed `useAppSelector` and `useAppDispatch` hooks
- **`actions.ts`** - Centralized action exports
- **`selectors.ts`** - Selector functions for accessing state

### Slices
- **`slices/userSlice.ts`** - User state management
- **`slices/authSlice.ts`** - Authentication state management

## State Structure

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

## Common Patterns

### Get User Data
```typescript
const { user } = useUserStore();
console.log(user?.name, user?.email, user?.role);
```

### Update User
```typescript
const { updateCurrentUser } = useUserStore();
updateCurrentUser({ name: 'New Name' });
```

### Check Authentication
```typescript
const { isAuthenticated } = useAuthStore();
if (isAuthenticated) {
  // User is logged in
}
```

### Check Permissions
```typescript
const { hasPermission, hasRole } = usePermissions();

if (hasPermission('users:create')) {
  // Show create button
}

if (hasRole('admin')) {
  // Show admin panel
}
```

### Login
```typescript
const { login } = useCombinedStore();
login(userData, tokens);
```

### Logout
```typescript
const { logout } = useCombinedStore();
logout(); // Clears both user and auth state
```

## Learn More

See the complete guide: **[REDUX_STORE_GUIDE.md](../../REDUX_STORE_GUIDE.md)**
