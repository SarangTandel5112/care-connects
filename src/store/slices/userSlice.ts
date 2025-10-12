import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/auth';

/**
 * User State Interface
 * Manages the current user's information and state
 */
export interface UserState {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
}

/**
 * Initial state for user slice
 */
const initialState: UserState = {
  currentUser: null,
  isLoading: false,
  error: null,
};

/**
 * User Slice
 * Manages user-related state including current user data
 *
 * Actions:
 * - setUser: Set the current user
 * - updateUser: Update specific user fields
 * - clearUser: Clear user data (logout)
 * - setLoading: Set loading state
 * - setError: Set error message
 * - clearError: Clear error message
 */
export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    /**
     * Set the current user
     * @param state - Current user state
     * @param action - Payload containing user data
     */
    setUser: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.error = null;
      state.isLoading = false;
    },

    /**
     * Update specific fields of the current user
     * @param state - Current user state
     * @param action - Payload containing partial user data
     */
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          ...action.payload,
        };
      }
    },

    /**
     * Clear user data (used during logout)
     * @param state - Current user state
     */
    clearUser: (state) => {
      state.currentUser = null;
      state.error = null;
      state.isLoading = false;
    },

    /**
     * Set loading state
     * @param state - Current user state
     * @param action - Payload containing loading boolean
     */
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    /**
     * Set error message
     * @param state - Current user state
     * @param action - Payload containing error message
     */
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    /**
     * Clear error message
     * @param state - Current user state
     */
    clearError: (state) => {
      state.error = null;
    },
  },
});

// Export actions
export const {
  setUser,
  updateUser,
  clearUser,
  setLoading,
  setError,
  clearError,
} = userSlice.actions;

// Export reducer
export default userSlice.reducer;
