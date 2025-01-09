import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  className?: string;
}

export function PageHeader({ title, description, action, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-8', className)}>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-neutral-900">
            {title}
          </h1>
          {description && (
            <p className="mt-2 text-neutral-600">{description}</p>
          )}
        </div>
        {action && (
          <Button onClick={action.onClick} className="shadow-sm">
            {action.icon && <span className="mr-2">{action.icon}</span>}
            {action.label}
          </Button>
        )}
      </div>
    </div>
  );
}