import { useState, useCallback } from 'react';
import type { Status, ErrorType, AsyncState } from '../types/common';
import { toast } from 'react-hot-toast';

export function useAsync<T>() {
  const [state, setState] = useState<AsyncState<T>>({
    status: 'idle',
    data: null,
    error: null,
  });

  const setData = useCallback((data: T) => {
    setState({
      status: 'success',
      data,
      error: null,
    });
  }, []);

  const setError = useCallback((error: ErrorType) => {
    setState({
      status: 'error',
      data: null,
      error,
    });
    toast.error(error.message);
  }, []);

  const reset = useCallback(() => {
    setState({
      status: 'idle',
      data: null,
      error: null,
    });
  }, []);

  const execute = useCallback(async (promise: Promise<T>) => {
    setState({
      status: 'loading',
      data: null,
      error: null,
    });

    try {
      const data = await promise;
      setData(data);
      return data;
    } catch (error) {
      const errorObj: ErrorType = {
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        details: error
      };
      setError(errorObj);
      throw error;
    }
  }, [setData, setError]);

  return {
    execute,
    status: state.status,
    data: state.data,
    error: state.error,
    isLoading: state.status === 'loading',
    isSuccess: state.status === 'success',
    isError: state.status === 'error',
    reset,
  };
}