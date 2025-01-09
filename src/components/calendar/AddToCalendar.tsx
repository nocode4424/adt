import { useState } from 'react';
import { Calendar } from 'lucide-react';
import { Button } from '../ui/Button';
import { addToCalendar, getConnectedCalendars } from '@/lib/calendar';
import type { CalendarEvent, CalendarProvider } from '@/lib/calendar/types';

interface AddToCalendarProps {
  event: CalendarEvent;
}

export function AddToCalendar({ event }: AddToCalendarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getConnectedCalendars();
      setProviders(data.filter(p => p.connected));
    } catch (error) {
      console.error('Error loading calendar providers:', error);
    }
  };

  const handleAddToCalendar = async (provider: CalendarProvider['name']) => {
    setIsLoading(true);
    try {
      await addToCalendar(provider, event);
      setIsOpen(false);
    } catch (error) {
      console.error('Add to calendar error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        onClick={() => setIsOpen(!isOpen)}
        className="space-x-2"
      >
        <Calendar className="h-4 w-4" />
        <span>Add to Calendar</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-neutral-200 py-1">
          {providers.map((provider) => (
            <button
              key={provider.name}
              onClick={() => handleAddToCalendar(provider.name)}
              disabled={isLoading}
              className="w-full px-4 py-2 text-left hover:bg-neutral-50 disabled:opacity-50"
            >
              {provider.displayName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}