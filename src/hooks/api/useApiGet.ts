import { useQuery } from '@tanstack/react-query';
import { Axios } from '@/setup';
import { tokenStorage } from '@/utils/token';
import { ApiResponse } from '@/types';
import toast from 'react-hot-toast';

/**
 * Hook for GET requests to Next.js API routes with authentication
 */
export function useApiGet<T>(
  queryKey: string[],
  apiRoute: string, // e.g., '/api/users' or 'api/users'
  options?: {
    enabled?: boolean;
    staleTime?: number;
    gcTime?: number;
    retry?: boolean | number;
    requireAuth?: boolean;
    params?: Record<string, string | number>; // Query parameters
  }
) {
  const getAccessToken = () => tokenStorage.getAccessToken();
  const isTokenExpired = () => tokenStorage.isTokenExpired();
  const requireAuth = options?.requireAuth !== false; // Default to true

  // Ensure the route starts with /api/
  const normalizedRoute = apiRoute.startsWith('/api/') ? apiRoute : `/api/${apiRoute}`;

  // Build query string from params
  const queryString = options?.params
    ? '?' +
      new URLSearchParams(
        Object.entries(options.params).map(([key, value]) => [key, String(value)])
      ).toString()
    : '';

  const fullUrl = `${normalizedRoute}${queryString}`;

  return useQuery({
    queryKey: [...queryKey, fullUrl],
    queryFn: async (): Promise<T> => {
      if (requireAuth) {
        const token = getAccessToken();
        if (!token || isTokenExpired()) {
          toast.error('Session expired. Please login again.');
          throw new Error('No valid token available');
        }
      }

      const response = await Axios.get<ApiResponse<T>>(fullUrl);
      return response.data.data;
    },
    enabled:
      options?.enabled !== false && (!requireAuth || (!!getAccessToken() && !isTokenExpired())),
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes default
    gcTime: options?.gcTime || 10 * 60 * 1000, // 10 minutes default
    retry: options?.retry !== false ? 2 : false, // Reduced retries
    refetchOnWindowFocus: false, // Disable for better performance
    refetchOnMount: true, // Keep this for fresh data
  });
}
