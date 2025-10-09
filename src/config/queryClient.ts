import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Refetch when user returns to tab
      retry: 1,
      // staleTime: 0 (default - always consider data stale)
    },
  },
});
