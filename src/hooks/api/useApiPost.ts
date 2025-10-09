import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/setup';
import { tokenStorage } from '@/utils/token';
import toast from 'react-hot-toast';
import { ApiResponse, ApiError } from '@/types';

/**
 * Hook for POST/PUT/PATCH/DELETE requests to Next.js API routes
 */
export function useApiPost<TData, TVariables>(
  apiRoute: string, // e.g., '/api/users' or 'api/users'
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: ApiError, variables: TVariables) => void;
    successMessage?: string;
    errorMessage?: string;
    invalidateQueries?: string[][];
    requireAuth?: boolean;
  }
) {
  const queryClient = useQueryClient();
  const getAccessToken = () => tokenStorage.getAccessToken();
  const isTokenExpired = () => tokenStorage.isTokenExpired();
  const requireAuth = options?.requireAuth !== false; // Default to true

  // Ensure the route starts with /api/
  const normalizedRoute = apiRoute.startsWith('/api/') ? apiRoute : `/api/${apiRoute}`;

  return useMutation({
    mutationFn: async (variables: TVariables): Promise<TData> => {
      if (requireAuth) {
        const token = getAccessToken();
        if (!token || isTokenExpired()) {
          toast.error('Session expired. Please login again.');
          throw new Error('No valid token available');
        }
      }

      const response = await Axios.request<ApiResponse<TData>>({
        method,
        url: normalizedRoute,
        data: variables,
      });

      return response.data.data;
    },
    onSuccess: (data, variables) => {
      if (options?.successMessage) {
        toast.success(options.successMessage);
      }

      if (options?.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      options?.onSuccess?.(data, variables);
    },
    onError: (error: ApiError, variables) => {
      const errorMessage = error.message || options?.errorMessage || 'Operation failed';
      toast.error(errorMessage);

      if (error.status === 401) {
        toast.error('Session expired. Please login again.');
      }

      options?.onError?.(error, variables);
    },
  });
}
