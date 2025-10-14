import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Axios } from '@/setup';
import { tokenStorage } from '@/utils/token';
import { formatErrorMessage } from '@/utils/formatErrorMessage';
import toast from 'react-hot-toast';
import { ApiResponse, ApiError } from '@/types';

/**
 * Hook for POST/PUT/PATCH/DELETE requests to backend API
 */
export function useApiPost<TData, TVariables>(
  apiRoute: string, // e.g., 'users' or 'auth/login'
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void;
    onError?: (error: ApiError, variables: TVariables) => void;
    successMessage?: string;
    errorMessage?: string;
    invalidateQueries?: string[][];
    requireAuth?: boolean;
    constructUrl?: (variables: TVariables) => string; // Custom URL construction
  }
) {
  const queryClient = useQueryClient();
  const getAccessToken = () => tokenStorage.getAccessToken();
  const isTokenExpired = () => tokenStorage.isTokenExpired();
  const requireAuth = options?.requireAuth !== false; // Default to true

  // Use the route as-is since baseURL points to backend API, or use custom URL construction
  const getRoute = (variables: TVariables) =>
    options?.constructUrl ? options.constructUrl(variables) : apiRoute;

  return useMutation({
    retry: false, // Disable retries to prevent infinite loops
    mutationFn: async (variables: TVariables): Promise<TData> => {
      if (requireAuth) {
        const token = getAccessToken();
        if (!token || isTokenExpired()) {
          // Check if we're on login page to avoid showing toasts
          const isOnLoginPage =
            typeof window !== 'undefined' && window.location.pathname === '/login';
          if (!isOnLoginPage) {
            toast.error('Session expired. Please login again.');
          }
          // Redirect to login page
          if (typeof window !== 'undefined' && !isOnLoginPage) {
            window.location.href = '/login';
          }
          throw new Error('No valid token available');
        }
      }

      // For update operations, extract only the data part (exclude id)
      const requestData =
        typeof variables === 'object' && variables !== null && 'data' in variables
          ? (variables as { data: unknown }).data
          : variables;

      // For DELETE requests, don't send body if variables is a primitive (string/number)
      const isPrimitive =
        typeof variables === 'string' ||
        typeof variables === 'number' ||
        typeof variables === 'boolean';
      const shouldSendData = method !== 'DELETE' || !isPrimitive;

      const response = await Axios.request<ApiResponse<TData>>({
        method,
        url: getRoute(variables),
        ...(shouldSendData && { data: requestData }),
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
      // Check if we're on login page to avoid showing toasts
      const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

      if (!isOnLoginPage) {
        // Skip toast if error is about no valid token (already shown in mutationFn)
        const isTokenError = error.message === 'No valid token available';

        // Handle 401 errors separately to avoid duplicate toasts
        if (error.status === 401) {
          toast.error('Session expired. Please login again.');
        } else if (!isTokenError) {
          // Extract proper error message from API response
          let errorMessage = options?.errorMessage || 'Operation failed';

          if (error.response?.data) {
            // Try to get message from response data
            const responseData = error.response.data;
            if (typeof responseData === 'string') {
              errorMessage = responseData;
            } else if (responseData && typeof responseData === 'object') {
              const data = responseData as Record<string, unknown>;
              if (typeof data.message === 'string') {
                errorMessage = data.message;
              } else if (typeof data.error === 'string') {
                errorMessage = data.error;
              } else if (typeof data.details === 'string') {
                errorMessage = data.details;
              }
            }
          } else if (error.message && !error.message.includes('Request failed with status code')) {
            errorMessage = error.message;
          }

          // Format error message to convert ISO dates to local timezone
          toast.error(formatErrorMessage(errorMessage));
        }
      }

      options?.onError?.(error, variables);
    },
  });
}
