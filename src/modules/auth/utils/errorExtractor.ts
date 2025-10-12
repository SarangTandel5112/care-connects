/**
 * Extract error message from API error response
 */
export const extractLoginErrorMessage = (error: any): string => {
  let errorMessage = 'Login failed';

  if (error.response?.data) {
    const responseData = error.response.data;

    if (typeof responseData === 'string') {
      errorMessage = responseData;
    } else if (responseData && typeof responseData === 'object') {
      const data = responseData as any;
      errorMessage = data.message || data.error || data.details || errorMessage;
    }
  } else if (error.message && !error.message.includes('Request failed with status code')) {
    errorMessage = error.message;
  }

  return errorMessage;
};
