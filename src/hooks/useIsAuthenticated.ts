import { tokenStorage } from '@/utils/token';
import { useAuthStore } from './useStore';

/**
 * Hook to check if user is authenticated
 * Uses Redux store and token validation
 * Does NOT trigger API calls
 */
export const useIsAuthenticated = () => {
  const { isAuthenticated } = useAuthStore();
  const hasValidToken = tokenStorage.isTokenValid();

  // User is authenticated if Redux says so AND we have a valid token
  return isAuthenticated && hasValidToken;
};
