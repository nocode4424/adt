import { AlertTriangle, XCircle, Info } from 'lucide-react';
import type { ErrorType } from '@/lib/types/common';

interface ErrorAlertProps {
  error: ErrorType;
  variant?: 'error' | 'warning' | 'info';
  className?: string;
}

const variants = {
  error: {
    icon: XCircle,
    bg: 'bg-red-50',
    text: 'text-red-800',
    border: 'border-red-200'
  },
  warning: {
    icon: AlertTriangle,
    bg: 'bg-yellow-50',
    text: 'text-yellow-800',
    border: 'border-yellow-200'
  },
  info: {
    icon: Info,
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    border: 'border-blue-200'
  }
};

export function ErrorAlert({ error, variant = 'error', className = '' }: ErrorAlertProps) {
  const styles = variants[variant];
  const Icon = styles.icon;

  return (
    <div className={`rounded-lg border p-4 ${styles.bg} ${styles.border} ${className}`}>
      <div className="flex items-start">
        <Icon className={`h-5 w-5 ${styles.text} mr-3 mt-0.5`} />
        <div>
          <h3 className={`text-sm font-medium ${styles.text}`}>
            {error.message}
          </h3>
          {error.details && (
            <div className="mt-2 text-sm opacity-75">
              {JSON.stringify(error.details)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}