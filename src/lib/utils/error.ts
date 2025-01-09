import { toast } from 'react-hot-toast';

// Error types
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationError';
  }
}

// Error handler
export function handleError(error: unknown): void {
  console.error('Error:', error);

  if (error instanceof ValidationError) {
    toast.error(error.message);
  } else if (error instanceof NetworkError) {
    toast.error('Network error. Please check your connection.');
  } else if (error instanceof AuthenticationError) {
    toast.error('Authentication failed. Please sign in again.');
  } else if (error instanceof Error) {
    toast.error(error.message);
  } else {
    toast.error('An unexpected error occurred');
  }
}

// Error boundary fallback
export function ErrorFallback({ error }: { error: Error }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Something went wrong
        </h2>
        <p className="text-neutral-600 mb-6">
          {error.message || 'An unexpected error occurred'}
        </p>
        <div className="space-y-4">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
          >
            Reload page
          </button>
          <button
            onClick={() => window.history.back()}
            className="w-full bg-neutral-100 text-neutral-700 px-4 py-2 rounded-md hover:bg-neutral-200 transition-colors"
          >
            Go back
          </button>
        </div>
      </div>
    </div>
  );
}