import { useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { cache } from '../cache';
import { toast } from 'react-hot-toast';

interface SyncOptions {
  tables: string[];
  syncInterval?: number;
  onSyncComplete?: () => void;
}

export function useSync({ tables, syncInterval = 5000, onSyncComplete }: SyncOptions) {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    let syncTimer: NodeJS.Timeout;

    const sync = async () => {
      if (isSyncing) return;
      setIsSyncing(true);

      try {
        // Process offline changes first
        await syncOfflineChanges();

        // Sync each table
        for (const table of tables) {
          const lastSync = cache.get(`${table}_last_sync`);
          
          const { data, error } = await supabase
            .from(table)
            .select('*')
            .gt('updated_at', lastSync || '1970-01-01');

          if (error) throw error;

          if (data.length > 0) {
            // Update cache
            const currentData = cache.get(table) || [];
            const updatedData = mergeData(currentData, data);
            cache.set(table, updatedData);
          }

          cache.set(`${table}_last_sync`, new Date().toISOString());
        }

        setLastSyncTime(new Date());
        onSyncComplete?.();
      } catch (error) {
        console.error('Sync error:', error);
        toast.error('Failed to sync some data');
      } finally {
        setIsSyncing(false);
      }
    };

    // Initial sync
    sync();

    // Set up periodic sync
    if (navigator.onLine) {
      syncTimer = setInterval(sync, syncInterval);
    }

    // Handle online/offline events
    const handleOnline = () => {
      sync();
      syncTimer = setInterval(sync, syncInterval);
    };

    const handleOffline = () => {
      clearInterval(syncTimer);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(syncTimer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [tables, syncInterval, onSyncComplete]);

  return {
    isSyncing,
    lastSyncTime,
    forceSync: async () => {
      setIsSyncing(true);
      try {
        await syncOfflineChanges();
        setLastSyncTime(new Date());
        toast.success('Sync completed');
      } catch (error) {
        toast.error('Sync failed');
      } finally {
        setIsSyncing(false);
      }
    }
  };
}

function mergeData<T extends { id: string }>(oldData: T[], newData: T[]): T[] {
  const merged = [...oldData];
  
  for (const item of newData) {
    const index = merged.findIndex(x => x.id === item.id);
    if (index >= 0) {
      merged[index] = item;
    } else {
      merged.push(item);
    }
  }

  return merged;
}

async function syncOfflineChanges() {
  const changes = cache.get('offline_changes') || [];
  const supabase = createClientComponentClient();

  for (const change of changes) {
    try {
      switch (change.type) {
        case 'create':
          await supabase.from(change.table).insert(change.data);
          break;
        case 'update':
          await supabase
            .from(change.table)
            .update(change.data)
            .eq('id', change.id);
          break;
        case 'delete':
          await supabase
            .from(change.table)
            .delete()
            .eq('id', change.id);
          break;
      }
    } catch (error) {
      console.error('Failed to sync change:', error);
      throw error;
    }
  }

  cache.remove('offline_changes');
}