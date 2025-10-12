import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/setup';
import { tokenStorage } from '@/utils/token';
import { ApiResponse } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for GET requests to backend API with authentication
 */
export function useApiGet<T>(
  queryKey: string[],
  apiRoute: string, // e.g., 'users' or 'auth/me'
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    retry?: boolean | number;
    requireAuth?: boolean;
    params?: Record<string, string | number>; // Query parameters
    refetchOnWindowFocus?: boolean;
    refetchOnMount?: boolean;
    refetchOnReconnect?: boolean;
  }
) {
  const getAccessToken = () => tokenStorage.getAccessToken();
  const isTokenExpired = () => tokenStorage.isTokenExpired();
  const requireAuth = options?.requireAuth !== false; // Default to true

  // Use the route as-is since baseURL points to backend API
  const normalizedRoute = apiRoute;

  // Build query string from params
  const queryString = options?.params
    ? '?' +
      new URLSearchParams(
        Object.entries(options.params).map(([key, value]) => [key, String(value)])
      ).toString()
    : '';

  const fullUrl = `${normalizedRoute}${queryString}`;

  // Double-check enabled condition
  const isEnabled =
    options?.enabled !== false && (!requireAuth || (!!getAccessToken() && !isTokenExpired()));

  return useQuery({
    queryKey: [...queryKey, fullUrl],
    queryFn: async (): Promise<T> => {
      // This should never run if enabled is false, but double-check
      if (requireAuth) {
        const token = getAccessToken();
        if (!token || isTokenExpired()) {
          // Don't throw error, just return null to avoid toast notifications
          return null as T;
        }
      }

      const response = await Axios.get<ApiResponse<T>>(fullUrl);
      return response.data.data;
    },
    enabled: isEnabled,
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes - data is considered fresh
    gcTime: options?.gcTime || 15 * 60 * 1000, // 15 minutes - cache kept in memory (increased from 10)
    retry: options?.retry !== false ? 2 : false, // Retry failed requests twice
    refetchOnWindowFocus: options?.refetchOnWindowFocus ?? false, // Don't refetch on tab focus
    refetchOnMount: options?.refetchOnMount ?? true, // Refetch on component mount
    refetchOnReconnect: options?.refetchOnReconnect ?? true, // Refetch when network reconnects (improved)
  });
}
