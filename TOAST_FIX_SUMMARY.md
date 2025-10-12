# Toast Issue Fix Summary

## Issues Fixed

### 1. **Selector Memoization Warning**
- **Warning**: `Selector selectAllErrors returned a different result when called with the same parameters`
- **Root Cause**: The selector was creating a new array reference on every call
- **Fix**: Used `createSelector` from Redux Toolkit to memoize the selector

**File**: `src/store/selectors.ts`
```typescript
export const selectAllErrors = createSelector(
  [selectUserError, selectAuthError],
  (userError, authError): string[] => {
    const errors: string[] = [];
    if (userError) errors.push(userError);
    if (authError) errors.push(authError);
    return errors;
  }
);
```

### 2. **Continuous "Session expired" and "No valid token available" Toasts**
- **Problem**: Toast notifications kept appearing even when user wasn't logged in
- **Root Cause**: Multiple issues:
  1. `useCurrentUser` was being called on every page, including login page
  2. The hook was trying to fetch user data even without a valid token
  3. `useIsAuthenticated` was triggering API calls unnecessarily

**Fixes Applied**:

#### a. Updated `useIsAuthenticated` Hook
**File**: `src/hooks/useIsAuthenticated.ts`
- Changed from using `useCurrentUser` (which triggers API) to using Redux store directly
- Now checks Redux state + token validity WITHOUT making API calls

```typescript
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  const hasValidToken = tokenStorage.isTokenValid();
  return isAuthenticated && hasValidToken;
};
```

#### b. Updated `useCurrentUser` Hook
**File**: `src/modules/auth/hooks/useAuth.ts`
- Added token check BEFORE enabling the query
- Set `retry: false` to prevent retries when there's no token
- Query is now disabled when there's no valid token

```typescript
const hasValidToken = tokenStorage.isTokenValid();

const query = useApiGet<User>(['auth', 'current-user'], 'auth/me', {
  enabled: hasValidToken, // Don't run if no valid token
  staleTime: 5 * 60 * 1000,
  retry: false, // Don't retry on failure
});
```

#### c. Removed Aggressive Toast from `useApiGet`
**File**: `src/hooks/api/useApiGet.ts`
- Removed the `toast.error('Session expired...')` call
- Error handling should be done at component level, not in the hook

#### d. Updated Login Page
**File**: `src/app/login/page.tsx`
- Removed unnecessary `useCurrentUser()` call
- Now uses only `useIsAuthenticated()` which doesn't trigger API calls

#### e. Updated Protected Layout
**File**: `src/app/(protected)/layout.tsx`
- Changed from `useCurrentUser` to `useAuthStore` for loading state
- Prevents unnecessary API calls

#### f. Updated Home Page
**File**: `src/app/page.tsx`
- Removed `useIsAuthenticated` hook
- Uses direct `tokenStorage.isTokenValid()` check
- No API calls triggered on home page redirect

## How It Works Now

### Authentication Flow

1. **Login**:
   - User submits credentials
   - `useLogin` hook syncs tokens and user to Redux store
   - No redundant API calls

2. **Page Navigation (Unauthenticated)**:
   - Home page → checks token only, redirects to login
   - Login page → uses Redux store, NO API calls
   - Protected routes → redirect immediately if no token

3. **Page Navigation (Authenticated)**:
   - Home page → checks token, redirects to dashboard
   - Protected routes → `useCurrentUser` fetches user data ONCE
   - Dashboard → uses Redux store (no redundant fetches)

4. **Token Validation**:
   - `useIsAuthenticated` checks Redux + token validity
   - NO API calls for authentication checks
   - API calls only when explicitly fetching user data

### Benefits

✅ **No More Toast Spam**: Toasts only appear when they should
✅ **Better Performance**: Fewer unnecessary API calls
✅ **Cleaner Code**: Separation of concerns (Redux for state, React Query for data fetching)
✅ **No Re-render Issues**: Memoized selectors prevent unnecessary re-renders
✅ **Optimized UX**: Faster page loads, instant redirects

## Testing Checklist

- [x] No toasts on initial page load (when not logged in)
- [x] No toasts when navigating to login page
- [x] No toasts when navigating from home to login
- [x] Login works correctly and syncs to Redux
- [x] Protected routes redirect properly
- [x] User data loads correctly on dashboard
- [x] Logout clears Redux store
- [x] No console warnings about selector memoization

## Files Modified

1. `src/store/selectors.ts` - Memoized `selectAllErrors`
2. `src/hooks/useIsAuthenticated.ts` - Uses Redux instead of API
3. `src/modules/auth/hooks/useAuth.ts` - Smart token validation
4. `src/hooks/api/useApiGet.ts` - Removed aggressive toast
5. `src/app/login/page.tsx` - Removed unnecessary hook call
6. `src/app/(protected)/layout.tsx` - Uses Redux for loading state
7. `src/app/page.tsx` - Direct token check, no hooks
8. `src/utils/token.ts` - Added `getTokens()` helper method

## Additional Notes

- The axios interceptor (src/setup/axios.ts) still shows toasts on 401 errors during actual API calls - this is expected behavior
- Toasts should only appear when there's an actual failed API request, not during navigation
- The Redux store is now the single source of truth for auth state
- React Query is used only for fetching data, not for auth checks
