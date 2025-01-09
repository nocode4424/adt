```typescript
export interface Incident {
  id: string;
  user_id: string;
  type: 'verbal' | 'physical' | 'financial' | 'other';
  description: string;
  occurred_at: string;
  location?: string;
  ai_classification?: string;
  sentiment_score?: number;
  sensitivity_level: 'high' | 'medium' | 'low';
  metadata: {
    audio_url?: string;
    attachments?: string[];
    legal_implications?: string;
  };
  created_at: string;
  updated_at: string;
}

export interface IncidentFormData {
  type: Incident['type'];
  description: string;
  occurred_at: string;
  location?: string;
  sensitivity_level: Incident['sensitivity_level'];
  metadata?: Incident['metadata'];
}
```