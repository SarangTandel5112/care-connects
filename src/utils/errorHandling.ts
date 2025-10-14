/**
 * Error handling utilities
 * Following Single Responsibility Principle - only handles error message extraction
 */

/**
 * Extract proper error message from API response
 * @param error - The error object from API call
 * @returns Formatted error message or undefined
 */
export const extractErrorMessage = (error: {
  response?: { data?: unknown };
  message?: string;
}): string | undefined => {
  if (!error) return undefined;

  // Extract proper error message from API response
  let errorMessage = 'Login failed';

  if (error.response?.data) {
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
  } else if (error.message && !error.message.includes('Request failed with status code')) {
    errorMessage = error.message;
  }

  return errorMessage;
};
