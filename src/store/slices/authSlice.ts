import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthTokens } from '@/types/auth';

/**
 * Auth State Interface
 * Manages authentication-related state
 */
export interface AuthState {
  isAuthenticated: boolean;
  tokens: AuthTokens | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for auth slice
 */
const initialState: AuthState = {
  isAuthenticated: false,
  tokens: null,
  isLoading: false,
  error: null,
};

/**
 * Auth Slice
 * Manages authentication state including tokens and auth status
 *
 * Actions:
 * - setTokens: Set authentication tokens
 * - clearTokens: Clear tokens (logout)
 * - setAuthenticated: Set authentication status
 * - setLoading: Set loading state
 * - setError: Set error message
 * - clearError: Clear error message
 * - updateAccessToken: Update only the access token (for refresh)
 */
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    /**
     * Set authentication tokens
     * @param state - Current auth state
     * @param action - Payload containing tokens
     */
    setTokens: (state, action: PayloadAction<AuthTokens>) => {
      state.tokens = action.payload;
      state.isAuthenticated = true;
      state.error = null;
      state.isLoading = false;
    },

    /**
     * Clear authentication tokens (used during logout)
     * @param state - Current auth state
     */
    clearTokens: (state) => {
      state.tokens = null;
      state.isAuthenticated = false;
      state.error = null;
      state.isLoading = false;
    },

    /**
     * Set authentication status
     * @param state - Current auth state
     * @param action - Payload containing authentication boolean
     */
    setAuthenticated: (state, action: PayloadAction<boolean>) => {
      state.isAuthenticated = action.payload;
    },

    /**
     * Set loading state
     * @param state - Current auth state
     * @param action - Payload containing loading boolean
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error message
     * @param state - Current auth state
     * @param action - Payload containing error message
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error message
     * @param state - Current auth state
     */
    clearError: (state) => {
      state.error = null;
    },

    /**
     * Update only the access token (useful for token refresh)
     * @param state - Current auth state
     * @param action - Payload containing new access token
     */
    updateAccessToken: (state, action: PayloadAction<string>) => {
      if (state.tokens) {
        state.tokens.access_token = action.payload;
      }
    },
  },
});

// Export actions
export const {
  setTokens,
  clearTokens,
  setAuthenticated,
  setLoading,
  setError,
  clearError,
  updateAccessToken,
} = authSlice.actions;

// Export reducer
export default authSlice.reducer;
