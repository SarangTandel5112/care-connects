import { useApiGet } from './useApiGet';

/**
 * Hook for paginated GET requests to Next.js API routes
 */
export function useApiGetPaginated<T>(
  queryKey: string[],
  apiRoute: string,
  options?: {
    page?: number;
    limit?: number;
    enabled?: boolean;
    staleTime?: number;
    requireAuth?: boolean;
    additionalParams?: Record<string, string | number>;
  }
) {
  const page = options?.page || 1;
  const limit = options?.limit || 10;
  const enabled = options?.enabled !== false;

  const params = {
    page: page.toString(),
    limit: limit.toString(),
    ...options?.additionalParams,
  };

  return useApiGet<T>([...queryKey, page.toString(), limit.toString()], apiRoute, {
    enabled,
    params,
    staleTime: options?.staleTime,
    requireAuth: options?.requireAuth,
  });
}
