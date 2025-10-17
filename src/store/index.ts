import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import authReducer from './slices/authSlice';
import medicalConditionsReducer from './slices/medicalConditionsSlice';

/**
 * Redux Store Configuration
 *
 * Combines all slice reducers and configures the store with:
 * - User state management
 * - Authentication state management
 * - Medical conditions data (cached)
 * - Redux DevTools (in development)
 */
export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    medicalConditions: medicalConditionsReducer,
  },
  // Enable Redux DevTools in development
  devTools: process.env.NODE_ENV !== 'production',
  // Add middleware configuration if needed
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types if using non-serializable values
        ignoredActions: [],
        // Ignore these paths in the state
        ignoredPaths: [],
      },
    }),
});

/**
 * Infer the `RootState` and `AppDispatch` types from the store itself
 */
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
