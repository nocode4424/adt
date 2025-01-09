```typescript
'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus, Filter, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { IncidentForm } from '@/components/incidents/IncidentForm';
import { IncidentTimeline } from '@/components/incidents/IncidentTimeline';
import { getIncidents } from '@/lib/api/incidents';

export default function IncidentsPage() {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const { data: incidents = [], isLoading } = useQuery({
    queryKey: ['incidents'],
    queryFn: getIncidents
  });

  const filteredIncidents = incidents.filter(incident => 
    filter === 'all' || incident.type === filter
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif font-bold text-neutral-900 tracking-tight">
            Incidents
          </h1>
          <p className="text-neutral-500 text-lg">
            Track and document important events securely
          </p>
        </div>

        <Button 
          onClick={() => setShowForm(!showForm)}
          className="shadow-sm hover:shadow-md transition-shadow"
        >
          <Plus className="h-4 w-4 mr-2" />
          {showForm ? 'Close Form' : 'Record Incident'}
        </Button>
      </div>

      {showForm && (
        <div className="mb-12 bg-white rounded-xl shadow-sm p-8 border border-neutral-100">
          <IncidentForm onComplete={() => setShowForm(false)} />
        </div>
      )}

      <div className="flex items-center gap-4 mb-8 bg-white p-4 rounded-lg border border-neutral-100">
        <Filter className="h-5 w-5 text-neutral-400" />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="flex-1 rounded-lg border-neutral-200 bg-transparent focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-shadow"
        >
          <option value="all">All Types</option>
          <option value="verbal">Verbal</option>
          <option value="physical">Physical</option>
          <option value="financial">Financial</option>
          <option value="other">Other</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-8 w-8 text-primary-500 animate-spin" />
        </div>
      ) : filteredIncidents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-neutral-100">
          <p className="text-neutral-500 text-lg">No incidents recorded yet</p>
        </div>
      ) : (
        <IncidentTimeline incidents={filteredIncidents} />
      )}
    </div>
  );
}
```