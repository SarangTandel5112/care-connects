import { useCurrentUser } from '@/modules/auth/hooks/useAuth';

// ============================================================================
// PERMISSION-RELATED HOOKS - All permission management hooks
// ============================================================================

// Get user permissions (if you have a permissions system)
export const useUserPermissions = () => {
  const { data: user } = useCurrentUser();
  return user?.permissions || [];
};

// Check if user has specific permission
export const useHasPermission = (permission: string) => {
  const permissions = useUserPermissions();
  return permissions.includes(permission);
};

// Check if user has any of the specified permissions
export const useHasAnyPermission = (permissions: string[]) => {
  const userPermissions = useUserPermissions();
  return permissions.some((permission) => userPermissions.includes(permission));
};

// Check if user has all of the specified permissions
export const useHasAllPermissions = (permissions: string[]) => {
  const userPermissions = useUserPermissions();
  return permissions.every((permission) => userPermissions.includes(permission));
};

// ============================================================================
// FEATURE-SPECIFIC PERMISSION HOOKS - Permission-based feature access
// ============================================================================

// Check if user can access admin features
export const useCanAccessAdmin = () => {
  return useHasAnyPermission(['admin.access', 'doctor.admin']);
};

// Check if user can manage patients
export const useCanManagePatients = () => {
  return useHasAnyPermission([
    'patients.create',
    'patients.read',
    'patients.update',
    'patients.delete',
    'admin.patients',
  ]);
};

// Check if user can view reports
export const useCanViewReports = () => {
  return useHasAnyPermission(['reports.view', 'admin.reports']);
};

// Check if user can manage appointments
export const useCanManageAppointments = () => {
  return useHasAnyPermission([
    'appointments.create',
    'appointments.read',
    'appointments.update',
    'appointments.delete',
    'admin.appointments',
  ]);
};

// Check if user can manage users
export const useCanManageUsers = () => {
  return useHasAnyPermission(['users.create', 'users.update', 'users.delete', 'admin.users']);
};

// Check if user can view analytics
export const useCanViewAnalytics = () => {
  return useHasAnyPermission(['analytics.view', 'admin.analytics']);
};

// Check if user can manage settings
export const useCanManageSettings = () => {
  return useHasPermission('admin.settings');
};

// Check if user can export data
export const useCanExportData = () => {
  return useHasAnyPermission(['data.export', 'admin.export']);
};

// Check if user can import data
export const useCanImportData = () => {
  return useHasAnyPermission(['data.import', 'admin.import']);
};
