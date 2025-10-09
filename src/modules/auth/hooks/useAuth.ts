import { useQueryClient } from '@tanstack/react-query';
import { User, AuthResponse } from '@/types';
import { QUERY_KEYS } from '@/constants/queryKeys';
import { tokenStorage } from '@/utils/token';
import { useApiGet, useApiPost } from '@/hooks/api';
import toast from 'react-hot-toast';

// ============================================================================
// SIMPLIFIED AUTH HOOKS - Clean and easy to understand
// ============================================================================

// Get current user
export const useCurrentUser = () => {
  return useApiGet<User>(['auth', 'current-user'], 'auth/me', {
    enabled: tokenStorage.isTokenValid(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Login
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useApiPost<AuthResponse, { email: string; password: string }>('auth/login', 'POST', {
    successMessage: 'Login successful!',
    onSuccess: (data) => {
      // Store tokens
      tokenStorage.setTokens(
        data.tokens.access_token,
        data.tokens.refresh_token,
        data.tokens.expires_in
      );

      // Update user data in cache
      queryClient.setQueryData([QUERY_KEYS.AUTH.GET_CURRENT_USER], data.user);
    },
    onError: (error) => {
      const errorMessage = error.message || 'Login failed';
      toast.error(errorMessage);
    },
  });
};

// Logout
export const useLogout = () => {
  const queryClient = useQueryClient();

  return useApiPost<void, void>('auth/logout', 'POST', {
    successMessage: 'Logged out successfully',
    onSuccess: () => {
      // Clear everything
      tokenStorage.clearTokens();
      queryClient.clear();
    },
    onError: () => {
      // Even if API fails, clear local state
      tokenStorage.clearTokens();
      queryClient.clear();
      toast.error('Logout failed, but you have been signed out locally');
    },
  });
};
