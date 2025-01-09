```tsx
'use client';

import { useEffect, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { format } from 'date-fns';
import { AlertTriangle, Clock, MapPin, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface Incident {
  id: string;
  type: string;
  description: string;
  occurred_at: string;
  location?: string;
  sensitivity_level: 'high' | 'medium' | 'low';
  ai_classification?: string;
  sentiment_score?: number;
}

export function IncidentList() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchIncidents();
  }, []);

  const fetchIncidents = async () => {
    try {
      const { data, error } = await supabase
        .from('incidents')
        .select('*')
        .order('occurred_at', { ascending: false });

      if (error) throw error;
      setIncidents(data || []);
    } catch (error) {
      console.error('Error fetching incidents:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredIncidents = incidents.filter((incident) => {
    const matchesSearch = incident.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.type.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' || incident.type === filter;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Search incidents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        >
          <option value="all">All Types</option>
          <option value="verbal">Verbal</option>
          <option value="physical">Physical</option>
          <option value="financial">Financial</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="grid gap-4">
        {filteredIncidents.map((incident) => (
          <Card key={incident.id} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold capitalize">{incident.type} Incident</h3>
                <p className="text-sm text-neutral-500">
                  {format(new Date(incident.occurred_at), 'PPpp')}
                </p>
              </div>
              {incident.sensitivity_level === 'high' && (
                <div className="flex items-center text-red-500">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  High Sensitivity
                </div>
              )}
            </div>

            <div className="prose prose-sm max-w-none mb-4" dangerouslySetInnerHTML={{ __html: incident.description }} />

            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              {incident.location && (
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  {incident.location}
                </div>
              )}
              {incident.ai_classification && (
                <div className="flex items-center">
                  <span className="font-medium">AI Classification:</span>
                  <span className="ml-1">{incident.ai_classification}</span>
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
```