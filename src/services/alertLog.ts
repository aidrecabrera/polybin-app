import { supabase } from '@/client/supabaseClient';
import { useQuery } from '@tanstack/react-query';

export function getRecentAlerts(limit = 5) {
  return useQuery({
    queryKey: ['recentAlerts', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alert_log')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data;
    },
  });
}
