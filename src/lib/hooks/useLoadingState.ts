import { useState, useCallback } from 'react';
import type { ErrorType } from '../types/common';

export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<ErrorType | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback((error?: ErrorType) => {
    setIsLoading(false);
    if (error) setError(error);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading,
    clearError: () => setError(null)
  };
}