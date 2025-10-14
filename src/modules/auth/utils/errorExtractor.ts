/**
 * Extract error message from API error response
 */
export const extractLoginErrorMessage = (error: {
  response?: { data?: unknown };
  message?: string;
}): string => {
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
