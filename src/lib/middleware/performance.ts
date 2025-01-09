import { cache } from '../cache';

interface PaginationOptions {
  page: number;
  limit: number;
}

interface PaginatedResult<T> {
  data: T[];
  metadata: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export async function paginateQuery<T>(
  queryFn: (options: PaginationOptions) => Promise<{ data: T[]; count: number }>,
  options: PaginationOptions
): Promise<PaginatedResult<T>> {
  const { data, count } = await queryFn(options);
  
  return {
    data,
    metadata: {
      total: count,
      page: options.page,
      limit: options.limit,
      hasMore: options.page * options.limit < count
    }
  };
}

// Optimistic updates
export function optimisticUpdate<T>(
  cacheKey: string,
  updateFn: (data: T[]) => T[]
) {
  const currentData = cache.get<T[]>(cacheKey) || [];
  const updatedData = updateFn(currentData);
  cache.set(cacheKey, updatedData);
  return updatedData;
}

// Background sync for offline changes
export async function syncOfflineChanges() {
  const offlineChanges = cache.get('offline_changes') || [];
  
  for (const change of offlineChanges) {
    try {
      await processOfflineChange(change);
    } catch (error) {
      console.error('Error processing offline change:', error);
      // Keep failed changes for retry
      continue;
    }
  }

  // Clear successfully processed changes
  cache.remove('offline_changes');
}

async function processOfflineChange(change: any) {
  const supabase = createClientComponentClient();
  
  switch (change.type) {
    case 'create':
      await supabase
        .from(change.table)
        .insert(change.data);
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
}