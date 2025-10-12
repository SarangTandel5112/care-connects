import authReducer, {
  setTokens,
  clearTokens,
  setAuthenticated,
  setLoading,
  setError,
  clearError,
  updateAccessToken,
  AuthState,
} from '../authSlice';
import { AuthTokens } from '@/types/auth';

describe('authSlice', () => {
  const initialState: AuthState = {
    isAuthenticated: false,
    tokens: null,
    isLoading: false,
    error: null,
  };

  const mockTokens: AuthTokens = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
  };

  describe('Initial State', () => {
    it('should return initial state', () => {
      expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('initial state has correct structure', () => {
      const state = authReducer(undefined, { type: 'unknown' });
      expect(state).toHaveProperty('isAuthenticated');
      expect(state).toHaveProperty('tokens');
      expect(state).toHaveProperty('isLoading');
      expect(state).toHaveProperty('error');
    });
  });

  describe('setTokens', () => {
    it('should set authentication tokens', () => {
      const state = authReducer(initialState, setTokens(mockTokens));

      expect(state.tokens).toEqual(mockTokens);
      expect(state.isAuthenticated).toBe(true);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should overwrite existing tokens', () => {
      const existingState: AuthState = {
        ...initialState,
        tokens: {
          access_token: 'old-token',
          refresh_token: 'old-refresh',
          expires_in: 1800,
        },
      };

      const state = authReducer(existingState, setTokens(mockTokens));

      expect(state.tokens).toEqual(mockTokens);
      expect(state.tokens?.access_token).toBe('mock-access-token');
    });

    it('should clear any existing errors when setting tokens', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Previous error',
      };

      const state = authReducer(stateWithError, setTokens(mockTokens));

      expect(state.error).toBeNull();
    });
  });

  describe('clearTokens', () => {
    it('should clear all tokens and auth state', () => {
      const authenticatedState: AuthState = {
        isAuthenticated: true,
        tokens: mockTokens,
        isLoading: false,
        error: null,
      };

      const state = authReducer(authenticatedState, clearTokens());

      expect(state.tokens).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
    });

    it('should clear tokens even if already null', () => {
      const state = authReducer(initialState, clearTokens());

      expect(state.tokens).toBeNull();
      expect(state.isAuthenticated).toBe(false);
    });

    it('should clear errors when clearing tokens', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error',
        tokens: mockTokens,
      };

      const state = authReducer(stateWithError, clearTokens());

      expect(state.error).toBeNull();
      expect(state.tokens).toBeNull();
    });
  });

  describe('setAuthenticated', () => {
    it('should set authenticated to true', () => {
      const state = authReducer(initialState, setAuthenticated(true));

      expect(state.isAuthenticated).toBe(true);
    });

    it('should set authenticated to false', () => {
      const authenticatedState: AuthState = {
        ...initialState,
        isAuthenticated: true,
      };

      const state = authReducer(authenticatedState, setAuthenticated(false));

      expect(state.isAuthenticated).toBe(false);
    });

    it('should toggle authentication state', () => {
      let state = authReducer(initialState, setAuthenticated(true));
      expect(state.isAuthenticated).toBe(true);

      state = authReducer(state, setAuthenticated(false));
      expect(state.isAuthenticated).toBe(false);
    });
  });

  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = authReducer(initialState, setLoading(true));

      expect(state.isLoading).toBe(true);
    });

    it('should set loading to false', () => {
      const loadingState: AuthState = {
        ...initialState,
        isLoading: true,
      };

      const state = authReducer(loadingState, setLoading(false));

      expect(state.isLoading).toBe(false);
    });

    it('should toggle loading state', () => {
      let state = authReducer(initialState, setLoading(true));
      expect(state.isLoading).toBe(true);

      state = authReducer(state, setLoading(false));
      expect(state.isLoading).toBe(false);
    });
  });

  describe('setError', () => {
    it('should set error message', () => {
      const errorMessage = 'Authentication failed';
      const state = authReducer(initialState, setError(errorMessage));

      expect(state.error).toBe(errorMessage);
      expect(state.isLoading).toBe(false);
    });

    it('should set loading to false when setting error', () => {
      const loadingState: AuthState = {
        ...initialState,
        isLoading: true,
      };

      const state = authReducer(loadingState, setError('Error occurred'));

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe('Error occurred');
    });

    it('should overwrite existing error', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Old error',
      };

      const state = authReducer(stateWithError, setError('New error'));

      expect(state.error).toBe('New error');
    });
  });

  describe('clearError', () => {
    it('should clear error message', () => {
      const stateWithError: AuthState = {
        ...initialState,
        error: 'Some error message',
      };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
    });

    it('should not affect other state when clearing error', () => {
      const stateWithError: AuthState = {
        isAuthenticated: true,
        tokens: mockTokens,
        isLoading: false,
        error: 'Error',
      };

      const state = authReducer(stateWithError, clearError());

      expect(state.error).toBeNull();
      expect(state.isAuthenticated).toBe(true);
      expect(state.tokens).toEqual(mockTokens);
      expect(state.isLoading).toBe(false);
    });
  });

  describe('updateAccessToken', () => {
    it('should update only the access token', () => {
      const stateWithTokens: AuthState = {
        ...initialState,
        tokens: mockTokens,
      };

      const newAccessToken = 'new-access-token';
      const state = authReducer(stateWithTokens, updateAccessToken(newAccessToken));

      expect(state.tokens?.access_token).toBe(newAccessToken);
      expect(state.tokens?.refresh_token).toBe(mockTokens.refresh_token);
      expect(state.tokens?.expires_in).toBe(mockTokens.expires_in);
    });

    it('should not update if tokens are null', () => {
      const state = authReducer(initialState, updateAccessToken('new-token'));

      expect(state.tokens).toBeNull();
    });

    it('should preserve other token properties', () => {
      const stateWithTokens: AuthState = {
        ...initialState,
        tokens: {
          ...mockTokens,
          expires_in: 7200,
        },
      };

      const state = authReducer(stateWithTokens, updateAccessToken('updated-token'));

      expect(state.tokens?.access_token).toBe('updated-token');
      expect(state.tokens?.expires_in).toBe(7200);
    });
  });

  describe('Complex State Transitions', () => {
    it('should handle login flow', () => {
      // Start with initial state
      let state = initialState;

      // Set loading
      state = authReducer(state, setLoading(true));
      expect(state.isLoading).toBe(true);

      // Set tokens (success)
      state = authReducer(state, setTokens(mockTokens));
      expect(state.tokens).toEqual(mockTokens);
      expect(state.isAuthenticated).toBe(true);
      expect(state.isLoading).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle login error flow', () => {
      let state = initialState;

      // Set loading
      state = authReducer(state, setLoading(true));
      expect(state.isLoading).toBe(true);

      // Set error
      state = authReducer(state, setError('Invalid credentials'));
      expect(state.error).toBe('Invalid credentials');
      expect(state.isLoading).toBe(false);
      expect(state.tokens).toBeNull();
    });

    it('should handle logout flow', () => {
      let state: AuthState = {
        isAuthenticated: true,
        tokens: mockTokens,
        isLoading: false,
        error: null,
      };

      // Clear tokens (logout)
      state = authReducer(state, clearTokens());
      expect(state.tokens).toBeNull();
      expect(state.isAuthenticated).toBe(false);
      expect(state.error).toBeNull();
    });

    it('should handle token refresh flow', () => {
      let state: AuthState = {
        ...initialState,
        tokens: mockTokens,
        isAuthenticated: true,
      };

      // Update access token
      state = authReducer(state, updateAccessToken('refreshed-token'));
      expect(state.tokens?.access_token).toBe('refreshed-token');
      expect(state.tokens?.refresh_token).toBe(mockTokens.refresh_token);
      expect(state.isAuthenticated).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty string error', () => {
      const state = authReducer(initialState, setError(''));
      expect(state.error).toBe('');
    });

    it('should handle multiple consecutive token updates', () => {
      let state = authReducer(initialState, setTokens(mockTokens));
      state = authReducer(state, setTokens({
        ...mockTokens,
        access_token: 'token2',
      }));
      state = authReducer(state, setTokens({
        ...mockTokens,
        access_token: 'token3',
      }));

      expect(state.tokens?.access_token).toBe('token3');
    });

    it('should handle rapid state changes', () => {
      let state = initialState;
      state = authReducer(state, setLoading(true));
      state = authReducer(state, setError('Error'));
      state = authReducer(state, clearError());
      state = authReducer(state, setTokens(mockTokens));

      expect(state.tokens).toEqual(mockTokens);
      expect(state.error).toBeNull();
      expect(state.isLoading).toBe(false);
      expect(state.isAuthenticated).toBe(true);
    });
  });
});
