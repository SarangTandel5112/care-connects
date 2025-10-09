import { useCurrentUser } from '@/modules/auth/hooks/useAuth';

// Check if user is authenticated
export const useIsAuthenticated = () => {
  const { data: user, error } = useCurrentUser();
  return !!user && !error;
};
