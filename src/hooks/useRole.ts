import { useCurrentUser } from '@/modules/auth/hooks/useAuth';

// ============================================================================
// ROLE-RELATED HOOKS - All role and permission management hooks
// ============================================================================

// Get user role
export const useUserRole = () => {
  const { data: user } = useCurrentUser();
  return user?.role || null;
};

// Check if user has specific role
export const useHasRole = (role: string) => {
  const userRole = useUserRole();
  return userRole === role;
};

// Check if user has any of the specified roles
export const useHasAnyRole = (roles: string[]) => {
  const userRole = useUserRole();
  return userRole ? roles.includes(userRole) : false;
};

// ============================================================================
// ROLE-SPECIFIC HOOKS - Individual role checks
// ============================================================================

// Check if user is admin
export const useIsAdmin = () => {
  return useHasRole('admin');
};

// Check if user is doctor
export const useIsDoctor = () => {
  return useHasRole('doctor');
};

// Check if user is nurse
export const useIsNurse = () => {
  return useHasRole('nurse');
};

// Check if user is receptionist
export const useIsReceptionist = () => {
  return useHasRole('receptionist');
};

// Check if user is staff (doctor, nurse, or receptionist)
export const useIsStaff = () => {
  return useHasAnyRole(['doctor', 'nurse', 'receptionist']);
};
