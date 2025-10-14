import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { tokenStorage } from '@/utils/token';
import toast from 'react-hot-toast';

// Create Axios instance for API calls
const Axios = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Flag to prevent multiple simultaneous refresh requests
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: Error | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

// Request Interceptor - Add Authorization header
Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenStorage.getAccessToken();

    if (token && !tokenStorage.isTokenExpired()) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token refresh
Axios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Check if we're on the login page to avoid showing toasts
    const isOnLoginPage = typeof window !== 'undefined' && window.location.pathname === '/login';

    // If error is 401 and we haven't retried yet, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return Axios(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = tokenStorage.getRefreshToken();

      if (!refreshToken) {
        // No refresh token, redirect to login
        processQueue(new Error('No refresh token available'));
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          tokenStorage.clearTokens();
          // Only redirect if not already on login page
          if (!isOnLoginPage) {
            window.location.href = '/login';
          }
        }

        return Promise.reject(error);
      }

      try {
        // Call refresh endpoint
        const response = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
          refreshToken,
        });

        const { access_token, refresh_token, expires_in } = response.data.tokens;

        // Store new tokens
        tokenStorage.setTokens(access_token, refresh_token, expires_in);

        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${access_token}`;

        // Process queued requests
        processQueue();
        isRefreshing = false;

        // Retry original request with new token
        return Axios(originalRequest);
      } catch (refreshError) {
        // Refresh failed, clear tokens and redirect to login
        processQueue(refreshError as Error);
        isRefreshing = false;

        if (typeof window !== 'undefined') {
          tokenStorage.clearTokens();
          // Only show toast and redirect if not on login page
          if (!isOnLoginPage) {
            toast.error('Session expired. Please login again.');
            window.location.href = '/login';
          }
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors (only show toasts if not on login page)
    if (!isOnLoginPage) {
      // Extract error message from response
      let errorMessage = 'An error occurred';

      if (error.response?.data) {
        // Try to get message from response data
        const responseData = error.response.data;
        if (typeof responseData === 'string') {
          errorMessage = responseData;
        } else if (responseData && typeof responseData === 'object') {
          const data = responseData as Record<string, unknown>;
          if (typeof data.message === 'string') {
            errorMessage = data.message;
          } else if (typeof data.error === 'string') {
            errorMessage = data.error;
          } else if (typeof data.details === 'string') {
            errorMessage = data.details;
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }

      // Show specific error messages based on status codes
      if (error.response?.status === 400) {
        toast.error(errorMessage || 'Bad request. Please check your input.');
      } else if (error.response?.status === 401) {
        toast.error(errorMessage || 'Authentication failed. Please login again.');
      } else if (error.response?.status === 403) {
        toast.error(errorMessage || 'You do not have permission to perform this action');
      } else if (error.response?.status === 404) {
        toast.error(errorMessage || 'Resource not found');
      } else if (error.response?.status === 422) {
        toast.error(errorMessage || 'Validation error. Please check your input.');
      } else if (error.response?.status === 429) {
        toast.error(errorMessage || 'Too many requests. Please try again later.');
      } else if (error.response?.status === 500) {
        toast.error(errorMessage || 'Server error. Please try again later.');
      } else if (error.code === 'ECONNABORTED') {
        toast.error('Request timeout. Please check your connection.');
      } else if (!error.response) {
        toast.error('Network error. Please check your internet connection.');
      } else {
        // For any other status codes, show the extracted message
        toast.error(errorMessage);
      }
    }

    return Promise.reject(error);
  }
);

export default Axios;
