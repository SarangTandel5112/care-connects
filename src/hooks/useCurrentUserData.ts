import { useCurrentUser } from '@/modules/auth/hooks/useAuth';

// Get current user data
export const useCurrentUserData = () => {
  const { data: user } = useCurrentUser();
  return user;
};
