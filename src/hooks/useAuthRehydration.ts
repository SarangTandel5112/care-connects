import { useEffect } from 'react';
import { tokenStorage } from '@/utils/token';
import { useCombinedStore } from './useStore';

/**
 * Hook to rehydrate authentication state from localStorage on app load
 * Restores both tokens AND user data to Redux store on refresh
 * This prevents redirect loops and loss of user context
 */
export const useAuthRehydration = () => {
  const { login, logout } = useCombinedStore();

  useEffect(() => {
    console.log('🔄 Auth rehydration starting...');

    // Clean up legacy 'token' key if it exists
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      console.log('🧹 Cleaning up legacy "token" key from localStorage');
      localStorage.removeItem('token');
    }

    // Get tokens and user from localStorage
    const tokens = tokenStorage.getTokens();
    const hasValidToken = tokenStorage.isTokenValid();
    const user = tokenStorage.getUser();

    if (hasValidToken && tokens && user) {
      // Rehydrate Redux state from localStorage
      console.log('✅ Valid token and user found, rehydrating store...');
      login(user, {
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken || '',
        expires_in: tokens.expiresIn || 0,
      });
      console.log('✅ Auth state rehydrated successfully');
    } else {
      // No valid token or user, ensure auth state is cleared
      console.log('❌ No valid auth data found, clearing state');
      logout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount
};
