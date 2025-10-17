'use client';

import React from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { AuthRehydration } from '@/components/AuthRehydration';
import { MedicalConditionsLoader } from '@/components/MedicalConditionsLoader';

/**
 * Store Provider Props Interface
 */
interface StoreProviderProps {
  children: React.ReactNode;
}

/**
 * Redux Store Provider Component
 *
 * Wraps the application with Redux Provider to make the store
 * available to all components in the component tree.
 * Also rehydrates auth state from localStorage on mount.
 *
 * @param {StoreProviderProps} props - Component props
 * @returns {JSX.Element} Provider component
 *
 * @example
 * ```tsx
 * <StoreProvider>
 *   <App />
 * </StoreProvider>
 * ```
 */
const StoreProvider: React.FC<StoreProviderProps> = ({ children }) => {
  return (
    <Provider store={store}>
      <AuthRehydration />
      <MedicalConditionsLoader />
      {children}
    </Provider>
  );
};

export default StoreProvider;
