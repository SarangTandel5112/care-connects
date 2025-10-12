import { LoginData, AuthTokens } from '@/types';

/**
 * Normalize backend token response
 *
 * @param data - LoginData from API (user + accessToken)
 * @returns Normalized AuthTokens or null
 */
export const normalizeTokens = (data: LoginData): AuthTokens | null => {
  const { accessToken, refreshToken } = data;

  if (accessToken) {
    return {
      access_token: accessToken,
      refresh_token: refreshToken || '',
      expires_in: 60 * 24 * 60 * 60, // 60 days (matching backend JWT expiry)
    };
  }

  return null;
};
