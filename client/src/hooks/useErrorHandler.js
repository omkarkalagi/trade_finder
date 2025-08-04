import { useState, useCallback } from 'react';

const useErrorHandler = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleError = useCallback((error, context = '') => {
    console.error(`Error in ${context}:`, error);
    
    let errorMessage = 'An unexpected error occurred';
    
    if (error?.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error?.message) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    // Specific error handling for common HTTP status codes
    if (error?.response?.status) {
      switch (error.response.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input and try again.';
          break;
        case 401:
          errorMessage = 'Authentication required. Please log in again.';
          // Redirect to login or refresh token
          break;
        case 403:
          errorMessage = 'You don\'t have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'The requested resource was not found.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please wait a moment and try again.';
          break;
        case 500:
          errorMessage = 'Server error. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        default:
          errorMessage = `Request failed with status ${error.response.status}`;
      }
    }

    // Network errors
    if (error?.code === 'NETWORK_ERROR' || error?.message === 'Network Error') {
      errorMessage = 'Network connection error. Please check your internet connection.';
    }

    setError({
      message: errorMessage,
      originalError: error,
      context,
      timestamp: new Date().toISOString()
    });

    // Auto-clear error after 10 seconds
    setTimeout(() => {
      setError(null);
    }, 10000);

    return errorMessage;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const asyncHandler = useCallback(async (asyncFunction, context = '') => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      const errorMessage = handleError(error, context);
      throw new Error(errorMessage);
    }
  }, [handleError]);

  const safeAsyncHandler = useCallback(async (asyncFunction, context = '', defaultValue = null) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await asyncFunction();
      setIsLoading(false);
      return result;
    } catch (error) {
      setIsLoading(false);
      handleError(error, context);
      return defaultValue;
    }
  }, [handleError]);

  const retryHandler = useCallback(async (asyncFunction, maxRetries = 3, delay = 1000, context = '') => {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        setIsLoading(true);
        const result = await asyncFunction();
        setIsLoading(false);
        return result;
      } catch (error) {
        lastError = error;
        console.warn(`Attempt ${attempt} failed for ${context}:`, error);
        
        if (attempt === maxRetries) {
          setIsLoading(false);
          const errorMessage = handleError(error, context);
          throw new Error(errorMessage);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, delay * attempt));
      }
    }
  }, [handleError]);

  return {
    error,
    isLoading,
    handleError,
    clearError,
    asyncHandler,
    safeAsyncHandler,
    retryHandler
  };
};

export default useErrorHandler;