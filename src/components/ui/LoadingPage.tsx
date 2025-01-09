import { LoadingSpinner } from './LoadingSpinner';

export function LoadingPage() {
  return (
    <div className="min-h-[400px] flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-neutral-600">Loading...</p>
    </div>
  );
}