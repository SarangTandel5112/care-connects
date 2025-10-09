// ============================================================================
// HOOKS INDEX - Main entry point for all application hooks
// ============================================================================

// Export auth hooks from auth module
export { useCurrentUser, useLogin, useLogout } from '@/modules/auth/hooks/useAuth';

// Export API hooks
export * from './api';

// Export form hooks
export { useFormHandler } from './useFormHandler';
export { useFormValidation } from './useFormValidation';
export { usePersistentForm } from './usePersistentForm';

// Export auth utility hooks
export { useIsAuthenticated } from './useIsAuthenticated';
export { useCurrentUserData } from './useCurrentUserData';

// Export role-related hooks
export * from './useRole';

// Export permission-related hooks
export * from './usePermission';

// Export utility hooks
export { useLocalStorage } from './useLocalStorage';
export { useDebounce } from './useDebounce';
export { useThrottle } from './useThrottle';
export { useToggle } from './useToggle';
export { useClickOutside } from './useClickOutside';
export { useKeyboardShortcut } from './useKeyboardShortcut';
export { useWindowSize } from './useWindowSize';
export { usePerformanceMonitor, useApiPerformance } from './usePerformance';
