import React from 'react';
import { useQuery } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/components/auth/AuthProvider';

export function Assets() {
  const { user } = useAuth();

  const { data: assets, isLoading } = useQuery(
    ['assets', user?.id],
    async () => {
      const { data, error } = await supabase
        .from('assets')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    {
      enabled: !!user,
    }
  );

  if (isLoading) return <Loader />;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-neutral-900">Assets</h1>
      <div className="grid gap-6">
        {assets?.map((asset) => (
          <Card key={asset.id}>
            <CardHeader>
              <h2 className="text-lg font-semibold">{asset.name}</h2>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">${asset.value}</p>
              <p className="text-neutral-600">Status: {asset.status}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}