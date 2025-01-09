import React from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

export function Profile() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900">Profile</h1>
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">Account Information</h2>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-500">Email</label>
              <p className="text-neutral-900">{user?.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}