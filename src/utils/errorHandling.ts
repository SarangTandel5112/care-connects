/**
 * Error handling utilities
 * Following Single Responsibility Principle - only handles error message extraction
 */

/**
 * Extract proper error message from API response
 * @param error - The error object from API call
 * @returns Formatted error message or undefined
 */
export const extractErrorMessage = (error: any): string | undefined => {
  if (!error) return undefined;

  // Extract proper error message from API response
  let errorMessage = 'Login failed';

  if (error.response?.data) {
    const responseData = error.response.data;
    if (typeof responseData === 'string') {
      errorMessage = responseData;
    } else if (responseData && typeof responseData === 'object') {
      const data = responseData as any;
      if (data.message) {
        errorMessage = data.message;
      } else if (data.error) {
        errorMessage = data.error;
      } else if (data.details) {
        errorMessage = data.details;
      }
    }
  } else if (error.message && !error.message.includes('Request failed with status code')) {
    errorMessage = error.message;
  }

  return errorMessage;
};
