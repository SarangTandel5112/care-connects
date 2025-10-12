/**
 * Store Actions
 *
 * This file re-exports all actions from slices for convenient importing.
 * It also provides action creator helpers for complex operations.
 */

// Re-export all user actions
export {
  setUser,
  updateUser,
  clearUser,
  setLoading as setUserLoading,
  setError as setUserError,
  clearError as clearUserError,
} from './slices/userSlice';

// Re-export all auth actions
export {
  setTokens,
  clearTokens,
  setAuthenticated,
  setLoading as setAuthLoading,
  setError as setAuthError,
  clearError as clearAuthError,
  updateAccessToken,
} from './slices/authSlice';

/**
 * Example of how to import and use:
 *
 * @example
 * import { setUser, setTokens, clearUser, clearTokens } from '@/store/actions';
 *
 * // In your component
 * const dispatch = useAppDispatch();
 * dispatch(setUser(userData));
 * dispatch(setTokens(tokens));
 */
