import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { supabase } from '@/lib/supabase';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/components/auth/AuthProvider';
import { Button } from '@/components/ui/Button';
import { IncidentForm } from '@/components/incidents/IncidentForm';
import { format } from 'date-fns';
import { AlertTriangle, Clock, MapPin } from 'lucide-react';

export function Incidents() {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);

  const { data: incidents, isLoading } = useQuery(
    ['incidents', user?.id],
    async () => {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .eq('user_id', user?.id)
        .order('occurred_at', { ascending: false });

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-neutral-900">Incidents</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Close Form' : 'Record New Incident'}
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Record New Incident</h2>
          </CardHeader>
          <CardContent>
            <IncidentForm />
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6">
        {incidents?.map((incident) => (
          <Card key={incident.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">{incident.type}</h2>
                {incident.sensitivity_level === 'high' && (
                  <span className="flex items-center text-red-500">
                    <AlertTriangle className="mr-1 h-4 w-4" />
                    High Sensitivity
                  </span>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-4 text-neutral-600">{incident.description}</p>
              <div className="flex items-center space-x-4 text-sm text-neutral-500">
                <span className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {format(new Date(incident.occurred_at), 'PPpp')}
                </span>
                {incident.location && (
                  <span className="flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {incident.location}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}