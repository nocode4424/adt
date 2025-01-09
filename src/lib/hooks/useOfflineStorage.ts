import { useState, useEffect } from 'react';
import { cache } from '../cache';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';

interface OfflineStorageOptions {
  table: string;
  syncOnReconnect?: boolean;
}

export function useOfflineStorage<T extends { id: string }>({ 
  table,
  syncOnReconnect = true
}: OfflineStorageOptions) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (syncOnReconnect) {
        syncOfflineChanges();
      }
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.warning('You are offline. Changes will be saved locally.');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncOnReconnect]);

  const saveOffline = async (data: Partial<T>, type: 'create' | 'update' | 'delete') => {
    const changes = cache.get('offline_changes') || [];
    changes.push({ table, type, data, timestamp: Date.now() });
    cache.set('offline_changes', changes);

    // Update local cache
    const localData = cache.get<T[]>(table) || [];
    
    switch (type) {
      case 'create':
        cache.set(table, [...localData, data as T]);
        break;
      case 'update':
        cache.set(table, localData.map(item => 
          item.id === (data as T).id ? { ...item, ...data } : item
        ));
        break;
      case 'delete':
        cache.set(table, localData.filter(item => item.id !== (data as T).id));
        break;
    }
  };

  const syncOfflineChanges = async () => {
    if (isSyncing) return;
    setIsSyncing(true);

    try {
      const changes = cache.get('offline_changes') || [];
      
      for (const change of changes) {
        if (change.table !== table) continue;

        switch (change.type) {
          case 'create':
            await supabase.from(table).insert(change.data);
            break;
          case 'update':
            await supabase
              .from(table)
              .update(change.data)
              .eq('id', change.data.id);
            break;
          case 'delete':
            await supabase
              .from(table)
              .delete()
              .eq('id', change.data.id);
            break;
        }
      }

      // Clear synced changes
      cache.set('offline_changes', changes.filter(change => change.table !== table));
      toast.success('Changes synced successfully');
    } catch (error) {
      console.error('Sync error:', error);
      toast.error('Failed to sync changes');
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    isSyncing,
    saveOffline,
    syncOfflineChanges
  };
}