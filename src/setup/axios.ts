import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { config } from '@/config';
import { tokenStorage } from '@/utils/token';
import toast from 'react-hot-toast';

// Create Axios instance for Next.js API routes
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
          window.location.href = '/login';
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
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
        }

        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found');
    } else if (error.response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout. Please check your connection.');
    } else if (!error.response) {
      toast.error('Network error. Please check your internet connection.');
    }

    return Promise.reject(error);
  }
);

export default Axios;
