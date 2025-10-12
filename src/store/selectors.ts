import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './index';
import type { User, AuthTokens } from '@/types/auth';

/**
 * Store Selectors
 *
 * These selector functions provide a clean way to access specific parts of the store.
 * They can be used with useAppSelector hook.
 *
 * @example
 * const user = useAppSelector(selectCurrentUser);
 * const isAuth = useAppSelector(selectIsAuthenticated);
 */

// ============================================
// User Selectors
// ============================================

/**
 * Select the current user from the store
 * @param state - Root state
 * @returns Current user or null
 */
export const selectCurrentUser = (state: RootState): User | null =>
  state.user.currentUser;

/**
 * Select user loading state
 * @param state - Root state
 * @returns User loading state
 */
export const selectUserLoading = (state: RootState): boolean =>
  state.user.isLoading;

/**
 * Select user error message
 * @param state - Root state
 * @returns User error message or null
 */
export const selectUserError = (state: RootState): string | null =>
  state.user.error;

/**
 * Select user role
 * @param state - Root state
 * @returns User role or undefined
 */
export const selectUserRole = (state: RootState): User['role'] | undefined =>
  state.user.currentUser?.role;

/**
 * Select user permissions
 * @param state - Root state
 * @returns User permissions array or empty array
 */
export const selectUserPermissions = (state: RootState): string[] =>
  state.user.currentUser?.permissions || [];

/**
 * Select user email
 * @param state - Root state
 * @returns User email or undefined
 */
export const selectUserEmail = (state: RootState): string | undefined =>
  state.user.currentUser?.email;

/**
 * Select user name
 * @param state - Root state
 * @returns User name or undefined
 */
export const selectUserName = (state: RootState): string | undefined =>
  state.user.currentUser?.name;

/**
 * Select user ID
 * @param state - Root state
 * @returns User ID or undefined
 */
export const selectUserId = (state: RootState): string | undefined =>
  state.user.currentUser?.id;

// ============================================
// Auth Selectors
// ============================================

/**
 * Select authentication status
 * @param state - Root state
 * @returns Authentication status
 */
export const selectIsAuthenticated = (state: RootState): boolean =>
  state.auth.isAuthenticated;

/**
 * Select authentication tokens
 * @param state - Root state
 * @returns Auth tokens or null
 */
export const selectAuthTokens = (state: RootState): AuthTokens | null =>
  state.auth.tokens;

/**
 * Select access token
 * @param state - Root state
 * @returns Access token or undefined
 */
export const selectAccessToken = (state: RootState): string | undefined =>
  state.auth.tokens?.access_token;

/**
 * Select refresh token
 * @param state - Root state
 * @returns Refresh token or undefined
 */
export const selectRefreshToken = (state: RootState): string | undefined =>
  state.auth.tokens?.refresh_token;

/**
 * Select auth loading state
 * @param state - Root state
 * @returns Auth loading state
 */
export const selectAuthLoading = (state: RootState): boolean =>
  state.auth.isLoading;

/**
 * Select auth error message
 * @param state - Root state
 * @returns Auth error message or null
 */
export const selectAuthError = (state: RootState): string | null =>
  state.auth.error;

// ============================================
// Combined/Computed Selectors
// ============================================

/**
 * Check if user has a specific permission
 * @param permission - Permission to check
 * @returns Function that checks if user has the permission
 */
export const selectHasPermission = (permission: string) => (state: RootState): boolean => {
  const permissions = selectUserPermissions(state);
  return permissions.includes(permission);
};

/**
 * Check if user has a specific role
 * @param role - Role to check
 * @returns Function that checks if user has the role
 */
export const selectHasRole = (role: User['role']) => (state: RootState): boolean => {
  const userRole = selectUserRole(state);
  return userRole === role;
};

/**
 * Check if both user and auth are loading
 * @param state - Root state
 * @returns Combined loading state
 */
export const selectIsLoading = (state: RootState): boolean =>
  state.user.isLoading || state.auth.isLoading;

/**
 * Get all errors from user and auth state (memoized)
 * @returns Array of error messages
 */
export const selectAllErrors = createSelector(
  [selectUserError, selectAuthError],
  (userError, authError): string[] => {
    const errors: string[] = [];
    if (userError) errors.push(userError);
    if (authError) errors.push(authError);
    return errors;
  }
);
