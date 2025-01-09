import React from 'react';
import { Loader2 } from 'lucide-react';

export function Loader() {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary-500" />
    </div>
  );
}