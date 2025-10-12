import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setUser,
  updateUser,
  clearUser,
  setUserLoading,
  setUserError,
  clearUserError,
  setTokens,
  clearTokens,
  setAuthenticated,
  setAuthLoading,
  setAuthError,
  clearAuthError,
  updateAccessToken,
} from '@/store/actions';
import {
  selectCurrentUser,
  selectUserLoading,
  selectUserError,
  selectUserRole,
  selectUserPermissions,
  selectUserEmail,
  selectUserName,
  selectUserId,
  selectIsAuthenticated,
  selectAuthTokens,
  selectAccessToken,
  selectRefreshToken,
  selectAuthLoading,
  selectAuthError,
  selectIsLoading,
  selectAllErrors,
} from '@/store/selectors';
import type { User, AuthTokens } from '@/types/auth';

/**
 * Custom Hook: useUserStore
 *
 * Provides access to user state and actions
 *
 * @returns User state and setter functions
 *
 * @example
 * const { user, setCurrentUser, updateCurrentUser } = useUserStore();
 */
export const useUserStore = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const user = useAppSelector(selectCurrentUser);
  const isLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const role = useAppSelector(selectUserRole);
  const permissions = useAppSelector(selectUserPermissions);
  const email = useAppSelector(selectUserEmail);
  const name = useAppSelector(selectUserName);
  const userId = useAppSelector(selectUserId);

  // Action creators
  const setCurrentUser = useCallback(
    (userData: User) => {
      dispatch(setUser(userData));
    },
    [dispatch]
  );

  const updateCurrentUser = useCallback(
    (userData: Partial<User>) => {
      dispatch(updateUser(userData));
    },
    [dispatch]
  );

  const clearCurrentUser = useCallback(() => {
    dispatch(clearUser());
  }, [dispatch]);

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setUserLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (errorMessage: string) => {
      dispatch(setUserError(errorMessage));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearUserError());
  }, [dispatch]);

  return {
    // State
    user,
    isLoading,
    error,
    role,
    permissions,
    email,
    name,
    userId,
    // Actions
    setCurrentUser,
    updateCurrentUser,
    clearCurrentUser,
    setLoading,
    setError,
    clearError,
  };
};

/**
 * Custom Hook: useAuthStore
 *
 * Provides access to authentication state and actions
 *
 * @returns Auth state and setter functions
 *
 * @example
 * const { isAuthenticated, tokens, setAuthTokens } = useAuthStore();
 */
export const useAuthStore = () => {
  const dispatch = useAppDispatch();

  // Selectors
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const tokens = useAppSelector(selectAuthTokens);
  const accessToken = useAppSelector(selectAccessToken);
  const refreshToken = useAppSelector(selectRefreshToken);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);

  // Action creators
  const setAuthTokens = useCallback(
    (authTokens: AuthTokens) => {
      dispatch(setTokens(authTokens));
    },
    [dispatch]
  );

  const clearAuthTokens = useCallback(() => {
    dispatch(clearTokens());
  }, [dispatch]);

  const setIsAuthenticated = useCallback(
    (authenticated: boolean) => {
      dispatch(setAuthenticated(authenticated));
    },
    [dispatch]
  );

  const updateToken = useCallback(
    (newAccessToken: string) => {
      dispatch(updateAccessToken(newAccessToken));
    },
    [dispatch]
  );

  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setAuthLoading(loading));
    },
    [dispatch]
  );

  const setError = useCallback(
    (errorMessage: string) => {
      dispatch(setAuthError(errorMessage));
    },
    [dispatch]
  );

  const clearError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  return {
    // State
    isAuthenticated,
    tokens,
    accessToken,
    refreshToken,
    isLoading,
    error,
    // Actions
    setAuthTokens,
    clearAuthTokens,
    setIsAuthenticated,
    updateToken,
    setLoading,
    setError,
    clearError,
  };
};

/**
 * Custom Hook: useCombinedStore
 *
 * Provides combined access to both user and auth state
 *
 * @returns Combined state and actions
 *
 * @example
 * const { user, isAuthenticated, logout } = useCombinedStore();
 */
export const useCombinedStore = () => {
  const dispatch = useAppDispatch();

  // Combined selectors
  const user = useAppSelector(selectCurrentUser);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const isLoading = useAppSelector(selectIsLoading);
  const allErrors = useAppSelector(selectAllErrors);

  // Combined action: Logout (clear both user and tokens)
  const logout = useCallback(() => {
    dispatch(clearUser());
    dispatch(clearTokens());
  }, [dispatch]);

  // Combined action: Login (set both user and tokens)
  const login = useCallback(
    (userData: User, authTokens: AuthTokens) => {
      console.log('🔄 useCombinedStore.login() called with:', { userData, authTokens });
      dispatch(setUser(userData));
      console.log('✅ setUser dispatched');
      dispatch(setTokens(authTokens));
      console.log('✅ setTokens dispatched');
    },
    [dispatch]
  );

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    allErrors,
    // Actions
    login,
    logout,
  };
};

/**
 * Custom Hook: usePermissions
 *
 * Provides permission checking functionality
 *
 * @returns Permission checking functions
 *
 * @example
 * const { hasPermission, hasRole } = usePermissions();
 * if (hasPermission('patients:create')) { ... }
 */
export const usePermissions = () => {
  const permissions = useAppSelector(selectUserPermissions);
  const role = useAppSelector(selectUserRole);

  const hasPermission = useCallback(
    (permission: string): boolean => {
      return permissions.includes(permission);
    },
    [permissions]
  );

  const hasAnyPermission = useCallback(
    (permissionList: string[]): boolean => {
      return permissionList.some((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasAllPermissions = useCallback(
    (permissionList: string[]): boolean => {
      return permissionList.every((p) => permissions.includes(p));
    },
    [permissions]
  );

  const hasRole = useCallback(
    (requiredRole: User['role']): boolean => {
      return role === requiredRole;
    },
    [role]
  );

  const hasAnyRole = useCallback(
    (roles: User['role'][]): boolean => {
      return role ? roles.includes(role) : false;
    },
    [role]
  );

  return {
    permissions,
    role,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    hasRole,
    hasAnyRole,
  };
};

/**
 * Custom Hook: useStoreSelector
 *
 * Generic hook for using any selector with the store
 *
 * @param selector - Selector function
 * @returns Selected state
 *
 * @example
 * const user = useStoreSelector((state) => state.user.currentUser);
 */
export const useStoreSelector = <T,>(
  selector: (state: ReturnType<ReturnType<typeof useAppSelector<(state: unknown) => unknown>>>) => T
): T => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useAppSelector(selector as any);
};
