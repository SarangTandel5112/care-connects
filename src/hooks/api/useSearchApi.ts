import { useDebounce } from '../useDebounce';
import { useApiGet } from './useApiGet';

/**
 * Hook for search with debouncing
 */
export function useApiSearch<T>(
  queryKey: string[],
  apiRoute: string,
  searchTerm: string,
  options?: {
    debounceMs?: number;
    minLength?: number;
    enabled?: boolean;
    requireAuth?: boolean;
  }
) {
  const debounceMs = options?.debounceMs || 300;
  const minLength = options?.minLength || 2;
  const enabled = options?.enabled !== false;

  const debouncedSearchTerm = useDebounce(searchTerm, debounceMs);
  const shouldSearch = enabled && debouncedSearchTerm.length >= minLength;

  return useApiGet<T>([...queryKey, debouncedSearchTerm], apiRoute, {
    enabled: shouldSearch,
    params: { search: debouncedSearchTerm },
    requireAuth: options?.requireAuth,
  });
}
