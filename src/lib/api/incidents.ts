```typescript
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Incident, IncidentFormData } from '../types/incidents';

const supabase = createClientComponentClient();

export async function createIncident(data: IncidentFormData) {
  const { error } = await supabase
    .from('incidents')
    .insert([data]);
  
  if (error) throw error;
}

export async function getIncidents() {
  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .order('occurred_at', { ascending: false });

  if (error) throw error;
  return data as Incident[];
}

export async function uploadAttachment(file: File) {
  const { data, error } = await supabase.storage
    .from('incident-attachments')
    .upload(`${Date.now()}-${file.name}`, file);

  if (error) throw error;
  return data.path;
}
```