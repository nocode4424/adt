import { useState } from 'react';
import { Calendar, Check } from 'lucide-react';
import { Button } from '../ui/Button';
import { connectCalendar, disconnectCalendar, getConnectedCalendars } from '@/lib/calendar';
import type { CalendarProvider } from '@/lib/calendar/types';

export function CalendarConnect() {
  const [providers, setProviders] = useState<CalendarProvider[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadProviders();
  }, []);

  const loadProviders = async () => {
    try {
      const data = await getConnectedCalendars();
      setProviders(data);
    } catch (error) {
      console.error('Error loading calendar providers:', error);
    }
  };

  const handleConnect = async (provider: CalendarProvider['name']) => {
    setIsLoading(true);
    try {
      await connectCalendar(provider);
      await loadProviders();
    } catch (error) {
      console.error('Calendar connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisconnect = async (provider: CalendarProvider['name']) => {
    setIsLoading(true);
    try {
      await disconnectCalendar(provider);
      await loadProviders();
    } catch (error) {
      console.error('Calendar disconnect error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Calendar Integration</h3>
        <Calendar className="h-5 w-5 text-neutral-400" />
      </div>

      <div className="grid gap-4">
        {providers.map((provider) => (
          <div
            key={provider.name}
            className="flex items-center justify-between p-4 bg-white rounded-lg border border-neutral-200"
          >
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 flex items-center justify-center bg-neutral-100 rounded-lg">
                <Calendar className="h-5 w-5 text-neutral-600" />
              </div>
              <div>
                <h4 className="font-medium">{provider.displayName}</h4>
                <p className="text-sm text-neutral-500">
                  {provider.connected ? 'Connected' : 'Not connected'}
                </p>
              </div>
            </div>

            <Button
              variant={provider.connected ? 'outline' : 'default'}
              onClick={() => provider.connected ? handleDisconnect(provider.name) : handleConnect(provider.name)}
              disabled={isLoading}
            >
              {provider.connected ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Disconnect
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}