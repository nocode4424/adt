// Common type definitions
export type Status = 'idle' | 'loading' | 'success' | 'error';

export type ErrorType = {
  message: string;
  code?: string;
  details?: unknown;
};

export type AsyncState<T> = {
  status: Status;
  data: T | null;
  error: ErrorType | null;
};

export type PaginationParams = {
  page: number;
  limit: number;
};

export type SortParams = {
  field: string;
  direction: 'asc' | 'desc';
};

export type FilterParams = {
  field: string;
  value: string | number | boolean;
  operator?: 'eq' | 'neq' | 'gt' | 'gte' | 'lt' | 'lte' | 'like';
};

export type QueryParams = {
  pagination?: PaginationParams;
  sort?: SortParams;
  filters?: FilterParams[];
};

// API Response types
export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: ErrorType;
};

export type PaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};