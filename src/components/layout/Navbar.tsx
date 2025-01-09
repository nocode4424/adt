```typescript
import { Sunrise, Home, FileText, CreditCard, Briefcase, User } from 'lucide-react';
import Link from 'next/link';
import { Button } from '../ui/Button';

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 h-16 border-b border-neutral-200 bg-white/80 backdrop-blur-sm z-50">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-6">
        <Link href="/" className="flex items-center space-x-2">
          <Sunrise className="h-8 w-8 text-primary-500" />
          <span className="text-2xl font-serif font-semibold text-neutral-900">Aurora</span>
        </Link>
        
        <div className="flex items-center space-x-1">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/incidents" className="flex items-center space-x-2">
              <FileText className="h-4 w-4" />
              <span>Incidents</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/expenses" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span>Expenses</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/assets" className="flex items-center space-x-2">
              <Briefcase className="h-4 w-4" />
              <span>Assets</span>
            </Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/profile" className="flex items-center space-x-2">
              <User className="h-4 w-4" />
              <span>Profile</span>
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
}
```