import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { cache } from '../cache';

export function useOffline() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      toast.success('Back online');
      
      // Sync cached data
      syncOfflineData();
    };

    const handleOffline = () => {
      setIsOffline(true);
      toast.error('You are offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineData = async () => {
    try {
      // Get cached changes
      const offlineChanges = cache.get('offline_changes') || [];
      
      if (offlineChanges.length === 0) return;

      // Process each change
      for (const change of offlineChanges) {
        switch (change.type) {
          case 'incident':
            await createIncident(change.data);
            break;
          case 'expense':
            await createExpense(change.data);
            break;
          // Add other types as needed
        }
      }

      // Clear offline changes
      cache.remove('offline_changes');
      toast.success('Offline changes synced successfully');
    } catch (error) {
      console.error('Error syncing offline changes:', error);
      toast.error('Failed to sync some offline changes');
    }
  };

  return { isOffline, syncOfflineData };
}