import React from 'react';
import { useQuery } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/components/auth/AuthProvider';

export function Dashboard() {
  const { user } = useAuth();

  const { data: summary, isLoading } = useQuery(
    ['incident-summary', user?.id],
    async () => {
      const { data, error } = await supabase
        .from('monthly_incident_summary')
        .select('*')
        .eq('user_id', user?.id)
        .order('month', { ascending: false })
        .limit(1)
        .single();

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
      <h1 className="text-3xl font-bold text-neutral-900">Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Recent Incidents</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.total_incidents || 0}</p>
            <p className="text-sm text-neutral-500">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Sentiment Score</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {summary?.avg_sentiment?.toFixed(2) || 'N/A'}
            </p>
            <p className="text-sm text-neutral-500">Average this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">High Priority</h2>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{summary?.high_priority_count || 0}</p>
            <p className="text-sm text-neutral-500">This month</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}