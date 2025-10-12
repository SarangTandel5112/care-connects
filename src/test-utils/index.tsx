import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/store/slices/authSlice';
import userReducer from '@/store/slices/userSlice';

/**
 * Create a test query client with disabled retries
 */
export const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
      mutations: {
        retry: false,
      },
    },
  });

/**
 * Create a test Redux store
 */
export const createTestStore = (preloadedState?: unknown) =>
  configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
    },
    preloadedState,
  });

/**
 * Custom render function with all providers
 */
interface AllProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
  store?: ReturnType<typeof createTestStore>;
}

export const AllProviders: React.FC<AllProvidersProps> = ({ children, queryClient, store }) => {
  const testQueryClient = queryClient || createTestQueryClient();
  const testStore = store || createTestStore();

  return (
    <Provider store={testStore}>
      <QueryClientProvider client={testQueryClient}>{children}</QueryClientProvider>
    </Provider>
  );
};

/**
 * Custom render with all providers
 */
export const renderWithProviders = (
  ui: React.ReactElement,
  {
    queryClient,
    store,
    ...renderOptions
  }: RenderOptions & {
    queryClient?: QueryClient;
    store?: ReturnType<typeof createTestStore>;
  } = {}
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <AllProviders queryClient={queryClient} store={store}>
      {children}
    </AllProviders>
  );

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

/**
 * Mock user data for testing
 */
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  name: 'Test User',
  role: 'doctor' as const,
  permissions: ['patients:read', 'patients:write'],
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
};

/**
 * Mock auth tokens for testing
 */
export const mockTokens = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  expires_in: 3600,
};

/**
 * Mock auth response for testing
 */
export const mockAuthResponse = {
  user: mockUser,
  tokens: mockTokens,
};

/**
 * Wait for async operations to complete
 */
export const waitForAsync = () => new Promise((resolve) => setTimeout(resolve, 0));

// Re-export everything from React Testing Library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
