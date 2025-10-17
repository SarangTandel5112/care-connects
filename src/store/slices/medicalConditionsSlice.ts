/**
 * Medical Conditions Slice
 * Manages medical conditions data fetched from the API
 * Data is loaded once on app initialization and cached in Redux store
 */

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Axios } from '@/setup';
import { ApiResponse } from '@/types';

// ============================================
// TYPES
// ============================================

export interface MedicalCondition {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface MedicalConditionsState {
  conditions: MedicalCondition[];
  loading: boolean;
  error: string | null;
  lastFetched: number | null; // Timestamp of last fetch
}

// ============================================
// INITIAL STATE
// ============================================

const initialState: MedicalConditionsState = {
  conditions: [],
  loading: false,
  error: null,
  lastFetched: null,
};

// ============================================
// ASYNC THUNKS
// ============================================

/**
 * Fetch medical conditions from API
 * This should be called once on app initialization
 */
export const fetchMedicalConditions = createAsyncThunk(
  'medicalConditions/fetchMedicalConditions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await Axios.get<ApiResponse<MedicalCondition[]>>('common/medical-conditions');
      return response.data.data;
    } catch (error: unknown) {
      const errorMessage =
        error && typeof error === 'object' && 'response' in error
          ? (error as { response?: { data?: { message?: string } } }).response?.data?.message
          : undefined;
      return rejectWithValue(errorMessage || 'Failed to fetch medical conditions');
    }
  }
);

// ============================================
// SLICE
// ============================================

const medicalConditionsSlice = createSlice({
  name: 'medicalConditions',
  initialState,
  reducers: {
    /**
     * Clear error message
     */
    clearError: (state) => {
      state.error = null;
    },
    /**
     * Reset the state
     */
    resetMedicalConditions: (state) => {
      state.conditions = [];
      state.loading = false;
      state.error = null;
      state.lastFetched = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch medical conditions
      .addCase(fetchMedicalConditions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMedicalConditions.fulfilled, (state, action: PayloadAction<MedicalCondition[]>) => {
        state.loading = false;
        state.conditions = action.payload;
        state.lastFetched = Date.now();
        state.error = null;
      })
      .addCase(fetchMedicalConditions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

// ============================================
// SELECTORS
// ============================================

/**
 * Selector to get medical conditions array from state
 * Handles the API response format where data is nested in { code, data, message, success }
 */
export const selectMedicalConditions = (state: { medicalConditions: MedicalConditionsState }): MedicalCondition[] => {
  const conditions = state.medicalConditions?.conditions;

  // Handle nested API response format
  if (conditions && typeof conditions === 'object' && 'data' in conditions) {
    const apiResponse = conditions as unknown as { data: MedicalCondition[] };
    return Array.isArray(apiResponse.data) ? apiResponse.data : [];
  }

  // Handle direct array format
  return Array.isArray(conditions) ? conditions : [];
};

/**
 * Selector to get loading state
 */
export const selectMedicalConditionsLoading = (state: { medicalConditions: MedicalConditionsState }): boolean => {
  return state.medicalConditions?.loading ?? false;
};

/**
 * Selector to get error state
 */
export const selectMedicalConditionsError = (state: { medicalConditions: MedicalConditionsState }): string | null => {
  return state.medicalConditions?.error ?? null;
};

/**
 * Selector to get last fetched timestamp
 */
export const selectMedicalConditionsLastFetched = (state: { medicalConditions: MedicalConditionsState }): number | null => {
  return state.medicalConditions?.lastFetched ?? null;
};

// ============================================
// EXPORTS
// ============================================

export const { clearError, resetMedicalConditions } = medicalConditionsSlice.actions;
export default medicalConditionsSlice.reducer;
