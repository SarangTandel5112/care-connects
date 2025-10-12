/**
 * Authentication types for the application
 * Following Interface Segregation Principle - separate interfaces for different concerns
 * Updated to match actual backend response structure
 */

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

/**
 * Clinic information nested in user object
 */
export interface Clinic {
  id: string;
  name: string;
  location: string | null;
  country: string | null;
  state: string | null;
  city: string | null;
  region: string | null;
  zipCode: string | null;
  contactNumber: string | null;
  fax: string | null;
  email: string | null;
  additionalInfo: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * User object from backend
 * Matches actual API response structure
 */
export interface User {
  id: string;
  email: string;
  fullName: string | null;
  phoneNumber: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  clinic: Clinic;
  // Optional fields for future use
  role?: string;
  avatar?: string;
}

/**
 * Login data returned from API (nested data field)
 * This is what useApiPost returns after unwrapping response.data.data
 */
export interface LoginData {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

/**
 * Full backend login API response structure
 * Actual format: { message: string, data: { user: User, accessToken: string } }
 */
export interface AuthResponse {
  message: string;
  data: LoginData;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  tokens: AuthTokens | null;
  loading: boolean;
  error: string | null;
}
