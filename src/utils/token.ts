/**
 * Token management utilities for JWT-based authentication
 * Uses localStorage for client-side token storage
 */

import type { User } from '@/types/auth';

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';
const USER_KEY = 'user';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  getTokens: (): { accessToken: string; refreshToken: string | null; expiresIn: number | null } | null => {
    if (typeof window === 'undefined') return null;

    const accessToken = localStorage.getItem(TOKEN_KEY);
    if (!accessToken) return null;

    const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    const expiresIn = expiryTime ? Math.floor((parseInt(expiryTime) - Date.now()) / 1000) : null;

    return {
      accessToken,
      refreshToken,
      expiresIn,
    };
  },

  setTokens: (accessToken: string, refreshToken: string, expiresIn: number): void => {
    if (typeof window === 'undefined') return;

    const expiryTime = Date.now() + expiresIn * 1000;

    localStorage.setItem(TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  },

  clearTokens: (): void => {
    if (typeof window === 'undefined') return;

    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(TOKEN_EXPIRY_KEY);
    // Also remove legacy 'token' key if it exists
    localStorage.removeItem('token');
  },

  isTokenExpired: (): boolean => {
    if (typeof window === 'undefined') return true;

    const expiryTime = localStorage.getItem(TOKEN_EXPIRY_KEY);
    if (!expiryTime) return true;

    return Date.now() >= parseInt(expiryTime);
  },

  isTokenValid: (): boolean => {
    const token = tokenStorage.getAccessToken();
    return !!token && !tokenStorage.isTokenExpired();
  },

  // User storage methods
  getUser: (): User | null => {
    if (typeof window === 'undefined') return null;

    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (!userStr) return null;
      return JSON.parse(userStr) as User;
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
      return null;
    }
  },

  setUser: (user: User): void => {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  },

  clearUser: (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(USER_KEY);
  },

  // Combined clear method for logout
  clearAll: (): void => {
    tokenStorage.clearTokens();
    tokenStorage.clearUser();
  },
};

/**
 * JWT token utilities
 */
export const jwtUtils = {
  parseJWT: (token: string): Record<string, unknown> | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error parsing JWT:', error);
      return null;
    }
  },

  getTokenExpiry: (token: string): number | null => {
    const payload = jwtUtils.parseJWT(token);
    return payload?.exp ? (payload.exp as number) * 1000 : null;
  },

  isTokenExpiringSoon: (token: string, thresholdMinutes: number = 5): boolean => {
    const expiry = jwtUtils.getTokenExpiry(token);
    if (!expiry) return true;

    const threshold = thresholdMinutes * 60 * 1000;
    return Date.now() >= (expiry - threshold);
  },
};
