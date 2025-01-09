import { useState, useCallback } from 'react';
import { cache } from '../cache';

// Generic state management hook with persistence
export function usePersistentState<T>(key: string, initialValue: T) {
  const [state, setState] = useState<T>(() => {
    const cached = cache.get<T>(key);
    return cached !== null ? cached : initialValue;
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setState(prev => {
      const newValue = value instanceof Function ? value(prev) : value;
      cache.set(key, newValue);
      return newValue;
    });
  }, [key]);

  return [state, setValue] as const;
}

// Form state management
export function useFormState<T extends object>(initialValues: T) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = useCallback((
    field: keyof T,
    value: T[keyof T]
  ) => {
    setValues(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
    setErrors(prev => ({ ...prev, [field]: undefined }));
  }, []);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsDirty(false);
  }, [initialValues]);

  return {
    values,
    errors,
    isDirty,
    handleChange,
    setErrors,
    reset
  };
}

// Loading state management
export function useLoadingState(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState<Error | null>(null);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
  }, []);

  const stopLoading = useCallback((error?: Error) => {
    setIsLoading(false);
    if (error) setError(error);
  }, []);

  return {
    isLoading,
    error,
    startLoading,
    stopLoading
  };
}