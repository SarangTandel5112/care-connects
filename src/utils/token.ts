/**
 * Token management utilities for JWT-based authentication
 */

const TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const TOKEN_EXPIRY_KEY = 'token_expiry';

export const tokenStorage = {
  getAccessToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(TOKEN_KEY);
  },

  getRefreshToken: (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
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
