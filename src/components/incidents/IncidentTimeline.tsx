```typescript
import { format } from 'date-fns';
import { AlertTriangle, Clock, MapPin, Paperclip } from 'lucide-react';
import { Incident } from '@/lib/types/incidents';

interface IncidentTimelineProps {
  incidents: Incident[];
}

export function IncidentTimeline({ incidents }: IncidentTimelineProps) {
  return (
    <div className="space-y-6">
      {incidents.map((incident) => (
        <div key={incident.id} className="relative pl-8 pb-8 border-l border-neutral-200 last:pb-0">
          <div className="absolute -left-[5px] w-[10px] h-[10px] rounded-full bg-primary-500 ring-4 ring-white" />
          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-neutral-100 transition-shadow hover:shadow-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-neutral-900 capitalize">
                {incident.type} Incident
              </h3>
              {incident.sensitivity_level === 'high' && (
                <span className="flex items-center text-red-500 bg-red-50 px-3 py-1 rounded-full text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1.5" />
                  High Sensitivity
                </span>
              )}
            </div>

            <div className="prose prose-neutral prose-sm max-w-none mb-4" 
              dangerouslySetInnerHTML={{ __html: incident.description }} 
            />

            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              <span className="flex items-center bg-neutral-50 px-3 py-1.5 rounded-lg">
                <Clock className="h-4 w-4 mr-1.5" />
                {format(new Date(incident.occurred_at), 'PPpp')}
              </span>
              
              {incident.location && (
                <span className="flex items-center bg-neutral-50 px-3 py-1.5 rounded-lg">
                  <MapPin className="h-4 w-4 mr-1.5" />
                  {incident.location}
                </span>
              )}
            </div>

            {incident.metadata?.attachments?.length > 0 && (
              <div className="mt-4 pt-4 border-t border-neutral-100">
                <h4 className="text-sm font-medium text-neutral-700 mb-2 flex items-center">
                  <Paperclip className="h-4 w-4 mr-1.5" />
                  Attachments
                </h4>
                <div className="flex flex-wrap gap-2">
                  {incident.metadata.attachments.map((url, index) => (
                    <a
                      key={index}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700 bg-primary-50 px-3 py-1.5 rounded-lg transition-colors hover:bg-primary-100"
                    >
                      Attachment {index + 1}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
```