import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { getEvents } from '@/lib/calendar';
import type { CalendarEvent, CalendarFilter } from '@/lib/calendar/types';

interface EventListProps {
  filter?: CalendarFilter;
  onEventClick?: (event: CalendarEvent) => void;
}

export function EventList({ filter, onEventClick }: EventListProps) {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, [filter]);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const data = await getEvents(filter);
      setEvents(data);
    } catch (error) {
      console.error('Error loading events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500" />
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-8 text-neutral-500">
        No events found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map(event => (
        <div
          key={event.id}
          className="bg-white rounded-lg border border-neutral-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => onEventClick?.(event)}
        >
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-medium">{event.title}</h3>
              <div className="mt-2 space-y-1 text-sm text-neutral-500">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>
                    {format(new Date(event.startTime), 'PPp')}
                  </span>
                </div>
                {event.location && (
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                )}
              </div>
            </div>
            <span className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${event.type === 'court' ? 'bg-red-100 text-red-800' :
                event.type === 'meeting' ? 'bg-blue-100 text-blue-800' :
                event.type === 'deadline' ? 'bg-yellow-100 text-yellow-800' :
                'bg-neutral-100 text-neutral-800'}
            `}>
              {event.type}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}