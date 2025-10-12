import { tokenStorage, jwtUtils } from '../token';

describe('tokenStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('getAccessToken', () => {
    it('should return access token from localStorage', () => {
      localStorage.setItem('access_token', 'test-token');
      expect(tokenStorage.getAccessToken()).toBe('test-token');
    });

    it('should return null if no token exists', () => {
      expect(tokenStorage.getAccessToken()).toBeNull();
    });

    it('should return null in server environment', () => {
      // Simulate server environment
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(tokenStorage.getAccessToken()).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('getRefreshToken', () => {
    it('should return refresh token from localStorage', () => {
      localStorage.setItem('refresh_token', 'refresh-token');
      expect(tokenStorage.getRefreshToken()).toBe('refresh-token');
    });

    it('should return null if no refresh token exists', () => {
      expect(tokenStorage.getRefreshToken()).toBeNull();
    });

    it('should return null in server environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(tokenStorage.getRefreshToken()).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('getTokens', () => {
    it('should return all tokens with expiry info', () => {
      const expiryTime = Date.now() + 3600000; // 1 hour from now
      localStorage.setItem('access_token', 'access');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('token_expiry', expiryTime.toString());

      const tokens = tokenStorage.getTokens();

      expect(tokens).toBeTruthy();
      expect(tokens?.accessToken).toBe('access');
      expect(tokens?.refreshToken).toBe('refresh');
      expect(tokens?.expiresIn).toBeGreaterThan(0);
    });

    it('should return null if no access token', () => {
      localStorage.setItem('refresh_token', 'refresh');

      expect(tokenStorage.getTokens()).toBeNull();
    });

    it('should handle missing refresh token', () => {
      localStorage.setItem('access_token', 'access');

      const tokens = tokenStorage.getTokens();

      expect(tokens).toBeTruthy();
      expect(tokens?.accessToken).toBe('access');
      expect(tokens?.refreshToken).toBeNull();
    });

    it('should handle missing expiry time', () => {
      localStorage.setItem('access_token', 'access');
      localStorage.setItem('refresh_token', 'refresh');

      const tokens = tokenStorage.getTokens();

      expect(tokens).toBeTruthy();
      expect(tokens?.expiresIn).toBeNull();
    });

    it('should return null in server environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(tokenStorage.getTokens()).toBeNull();

      global.window = originalWindow;
    });
  });

  describe('setTokens', () => {
    it('should store tokens in localStorage', () => {
      tokenStorage.setTokens('access-token', 'refresh-token', 3600);

      expect(localStorage.getItem('access_token')).toBe('access-token');
      expect(localStorage.getItem('refresh_token')).toBe('refresh-token');
      expect(localStorage.getItem('token_expiry')).toBeTruthy();
    });

    it('should calculate and store expiry time', () => {
      const beforeTime = Date.now();
      tokenStorage.setTokens('access', 'refresh', 3600);
      const afterTime = Date.now();

      const storedExpiry = parseInt(localStorage.getItem('token_expiry') || '0');
      const expectedMin = beforeTime + 3600000;
      const expectedMax = afterTime + 3600000;

      expect(storedExpiry).toBeGreaterThanOrEqual(expectedMin);
      expect(storedExpiry).toBeLessThanOrEqual(expectedMax);
    });

    it('should not set tokens in server environment', () => {
      // Clear any existing tokens first
      localStorage.clear();

      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      tokenStorage.setTokens('access', 'refresh', 3600);

      global.window = originalWindow;

      expect(localStorage.getItem('access_token')).toBeNull();
    });

    it('should overwrite existing tokens', () => {
      localStorage.setItem('access_token', 'old-token');

      tokenStorage.setTokens('new-token', 'new-refresh', 3600);

      expect(localStorage.getItem('access_token')).toBe('new-token');
      expect(localStorage.getItem('refresh_token')).toBe('new-refresh');
    });
  });

  describe('clearTokens', () => {
    it('should remove all tokens from localStorage', () => {
      localStorage.setItem('access_token', 'access');
      localStorage.setItem('refresh_token', 'refresh');
      localStorage.setItem('token_expiry', '123456789');

      tokenStorage.clearTokens();

      expect(localStorage.getItem('access_token')).toBeNull();
      expect(localStorage.getItem('refresh_token')).toBeNull();
      expect(localStorage.getItem('token_expiry')).toBeNull();
    });

    it('should not throw if tokens do not exist', () => {
      expect(() => tokenStorage.clearTokens()).not.toThrow();
    });

    it('should not clear tokens in server environment', () => {
      // Clear first, then set
      localStorage.clear();
      const originalWindow = global.window;
      global.window = originalWindow; // Ensure window is available
      localStorage.setItem('access_token', 'token');

      // @ts-ignore
      delete global.window;

      tokenStorage.clearTokens();

      global.window = originalWindow;

      expect(localStorage.getItem('access_token')).toBe('token');
    });
  });

  describe('isTokenExpired', () => {
    it('should return false if token is not expired', () => {
      const futureTime = Date.now() + 3600000; // 1 hour from now
      localStorage.setItem('token_expiry', futureTime.toString());

      expect(tokenStorage.isTokenExpired()).toBe(false);
    });

    it('should return true if token is expired', () => {
      const pastTime = Date.now() - 3600000; // 1 hour ago
      localStorage.setItem('token_expiry', pastTime.toString());

      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should return true if no expiry time exists', () => {
      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should return true at exact expiry time', () => {
      const now = Date.now();
      localStorage.setItem('token_expiry', now.toString());

      expect(tokenStorage.isTokenExpired()).toBe(true);
    });

    it('should return true in server environment', () => {
      const originalWindow = global.window;
      // @ts-ignore
      delete global.window;

      expect(tokenStorage.isTokenExpired()).toBe(true);

      global.window = originalWindow;
    });
  });

  describe('isTokenValid', () => {
    it('should return true for valid non-expired token', () => {
      const futureTime = Date.now() + 3600000;
      localStorage.setItem('access_token', 'valid-token');
      localStorage.setItem('token_expiry', futureTime.toString());

      expect(tokenStorage.isTokenValid()).toBe(true);
    });

    it('should return false if token does not exist', () => {
      const futureTime = Date.now() + 3600000;
      localStorage.setItem('token_expiry', futureTime.toString());

      expect(tokenStorage.isTokenValid()).toBe(false);
    });

    it('should return false if token is expired', () => {
      const pastTime = Date.now() - 3600000;
      localStorage.setItem('access_token', 'expired-token');
      localStorage.setItem('token_expiry', pastTime.toString());

      expect(tokenStorage.isTokenValid()).toBe(false);
    });

    it('should return false if both token and expiry are missing', () => {
      expect(tokenStorage.isTokenValid()).toBe(false);
    });
  });
});

describe('jwtUtils', () => {
  // Sample JWT token (payload: {"sub":"123","name":"Test","exp":9999999999})
  const sampleToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCIsImV4cCI6OTk5OTk5OTk5OX0.signature';

  describe('parseJWT', () => {
    it('should parse valid JWT token', () => {
      const payload = jwtUtils.parseJWT(sampleToken);

      expect(payload).toBeTruthy();
      expect(payload?.sub).toBe('123');
      expect(payload?.name).toBe('Test');
      expect(payload?.exp).toBe(9999999999);
    });

    it('should return null for invalid token', () => {
      // Suppress console errors for this test
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const payload = jwtUtils.parseJWT('invalid-token');

      expect(payload).toBeNull();
      consoleError.mockRestore();
    });

    it('should return null for malformed token', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const payload = jwtUtils.parseJWT('not.a.token');

      expect(payload).toBeNull();
      consoleError.mockRestore();
    });

    it('should handle token with special characters', () => {
      // Token with URL-safe characters
      const tokenWithSpecial = 'header.eyJ0ZXN0IjoidmFsdWUifQ.signature';
      const payload = jwtUtils.parseJWT(tokenWithSpecial);

      expect(payload).toBeTruthy();
    });

    it('should return null for empty string', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const payload = jwtUtils.parseJWT('');

      expect(payload).toBeNull();
      consoleError.mockRestore();
    });
  });

  describe('getTokenExpiry', () => {
    it('should return expiry time in milliseconds', () => {
      const expiry = jwtUtils.getTokenExpiry(sampleToken);

      expect(expiry).toBe(9999999999000); // exp * 1000
    });

    it('should return null for token without exp claim', () => {
      // Token without exp: {"sub":"123","name":"Test"}
      const tokenWithoutExp = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiVGVzdCJ9.signature';
      const expiry = jwtUtils.getTokenExpiry(tokenWithoutExp);

      expect(expiry).toBeNull();
    });

    it('should return null for invalid token', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation();
      const expiry = jwtUtils.getTokenExpiry('invalid-token');

      expect(expiry).toBeNull();
      consoleError.mockRestore();
    });
  });

  describe('isTokenExpiringSoon', () => {
    it('should return false if token expires in future beyond threshold', () => {
      const futureExp = Math.floor((Date.now() + 600000) / 1000); // 10 minutes from now
      const token = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      expect(jwtUtils.isTokenExpiringSoon(token, 5)).toBe(false);
    });

    it('should return true if token expires within threshold', () => {
      const nearExp = Math.floor((Date.now() + 120000) / 1000); // 2 minutes from now
      const token = `header.${btoa(JSON.stringify({ exp: nearExp }))}.signature`;

      expect(jwtUtils.isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should return true if token is already expired', () => {
      const pastExp = Math.floor((Date.now() - 600000) / 1000); // 10 minutes ago
      const token = `header.${btoa(JSON.stringify({ exp: pastExp }))}.signature`;

      expect(jwtUtils.isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should return true if no expiry in token', () => {
      const token = `header.${btoa(JSON.stringify({ sub: '123' }))}.signature`;

      expect(jwtUtils.isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should use custom threshold', () => {
      const futureExp = Math.floor((Date.now() + 180000) / 1000); // 3 minutes from now
      const token = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      // Should not expire within 2 minutes
      expect(jwtUtils.isTokenExpiringSoon(token, 2)).toBe(false);

      // Should expire within 5 minutes
      expect(jwtUtils.isTokenExpiringSoon(token, 5)).toBe(true);
    });

    it('should use default threshold of 5 minutes', () => {
      const futureExp = Math.floor((Date.now() + 180000) / 1000); // 3 minutes from now
      const token = `header.${btoa(JSON.stringify({ exp: futureExp }))}.signature`;

      expect(jwtUtils.isTokenExpiringSoon(token)).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle very long tokens', () => {
      const longPayload = { data: 'x'.repeat(10000), exp: 9999999999 };
      const token = `header.${btoa(JSON.stringify(longPayload))}.signature`;

      const payload = jwtUtils.parseJWT(token);
      expect(payload).toBeTruthy();
      expect(payload?.exp).toBe(9999999999);
    });

    it('should handle tokens with unicode characters', () => {
      const unicodePayload = { name: '测试用户', exp: 9999999999 };
      const token = `header.${btoa(JSON.stringify(unicodePayload))}.signature`;

      const payload = jwtUtils.parseJWT(token);
      expect(payload).toBeTruthy();
    });
  });
});
