import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { User, LoginData, AuthTokens, LoginCredentials } from '@/types';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { tokenStorage } from '@/utils/token';
import { useApiGet, useApiPost } from '@/hooks/api';
import { useCombinedStore } from '@/hooks/useStore';
import { normalizeTokens, extractLoginErrorMessage } from '../utils';

// ============================================================================
// AUTH HOOKS - Synced with Redux Store
// ============================================================================

/**
 * Get current user hook
 * Returns user data from Redux store (synced on login)
 *
 * Note: /api/auth/me endpoint is currently disabled until backend implements it
 * User data comes from login response and is stored in Redux
 */
export const useCurrentUser = () => {
  const { user, login } = useCombinedStore();

  // IMPORTANT: /auth/me API call is disabled until backend endpoint is ready
  // TODO: Re-enable when backend /auth/me endpoint is implemented
  const shouldFetch = false; // Disabled - use Redux user data from login

  const query = useApiGet<User>(['auth', 'current-user'], 'auth/me', {
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  // Sync to Redux when data is fetched (for future when API is enabled)
  React.useEffect(() => {
    if (query.data && !user) {
      const tokens = tokenStorage.getTokens();
      if (tokens) {
        login(query.data, {
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken || '',
          expires_in: tokens.expiresIn || 0,
        });
      }
    }
  }, [query.data, user, login]);

  // Return Redux user if available, otherwise query data
  return {
    ...query,
    data: user || query.data,
    isLoading: user ? false : query.isLoading,
  };
};

/**
 * Login hook
 * Handles user authentication and token/user data storage
 *
 * Flow:
 * 1. Call login API
 * 2. Normalize token response (handles backend typo)
 * 3. Store tokens in localStorage
 * 4. Store user in React Query cache
 * 5. Sync tokens and user to Redux store
 */
export const useLogin = () => {
  const queryClient = useQueryClient();
  const { login } = useCombinedStore();

  return useApiPost<LoginData, LoginCredentials>('auth/login', 'POST', {
    successMessage: 'Login successful!',
    requireAuth: false,
    onSuccess: (data) => {
      handleLoginSuccess(data, queryClient, login);
    },
    onError: (error) => {
      const errorMessage = extractLoginErrorMessage(error);
      console.warn('Login error:', errorMessage);
    },
  });
};

/**
 * Logout hook
 * Clears all authentication data (tokens, user, cache)
 * Note: Logout is handled client-side only (no backend endpoint)
 */
export const useLogout = () => {
  const queryClient = useQueryClient();
  const { logout } = useCombinedStore();

  return {
    mutate: () => {
      clearAuthData(queryClient, logout);
    },
    mutateAsync: async () => {
      clearAuthData(queryClient, logout);
    },
    isPending: false,
    isSuccess: false,
    isError: false,
    error: null,
  };
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Handle successful login
 * Extracts and stores tokens, user data, and syncs to Redux
 *
 * @param data - LoginData from API (already unwrapped by useApiPost)
 */
function handleLoginSuccess(
  data: LoginData,
  queryClient: ReturnType<typeof useQueryClient>,
  login: (user: User, tokens: AuthTokens) => void
) {
  // 1. Normalize and extract tokens
  const tokens = normalizeTokens(data);

  if (!tokens) {
    console.error('❌ No tokens in login response');
    return;
  }

  // 2. Extract user
  const { user } = data;

  if (!user) {
    console.error('❌ No user data in login response');
    return;
  }

  // 3. Store tokens in localStorage
  tokenStorage.setTokens(tokens.access_token, tokens.refresh_token, tokens.expires_in);

  // 4. Store user data in localStorage
  tokenStorage.setUser(user);

  // 5. Store user data in React Query cache
  queryClient.setQueryData([QUERY_KEYS.AUTH.GET_CURRENT_USER], user);

  // 6. Sync to Redux store
  login(user, tokens);
}

/**
 * Clear all authentication data
 * Removes tokens, user, clears cache, and resets Redux state
 */
function clearAuthData(
  queryClient: ReturnType<typeof useQueryClient>,
  logout: () => void
) {
  tokenStorage.clearAll(); // Clears both tokens and user
  queryClient.clear();
  logout();
}
