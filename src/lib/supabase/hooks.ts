import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { toast } from 'react-hot-toast';
import { Database } from '../types/supabase';

const supabase = createClientComponentClient<Database>();

export function useIncidentSummary(userId: string | undefined) {
  return useQuery({
    queryKey: ['incident-summary', userId],
    queryFn: async () => {
      if (!userId) return null;
      
      const { data, error } = await supabase
        .from('monthly_incident_summary')
        .select('*')
        .eq('user_id', userId)
        .order('month', { ascending: false })
        .limit(1)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });
}

export function useRefreshSummary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { error } = await supabase.rpc('refresh_summaries');
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incident-summary'] });
      toast.success('Summary refreshed successfully');
    },
    onError: () => {
      toast.error('Failed to refresh summary');
    },
  });
}