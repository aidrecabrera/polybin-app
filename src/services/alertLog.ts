import { supabase } from "@/client/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function getWeekDisposeLog() {
  return useQuery({
    queryKey: ["weekDisposeLog"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);
      const { data, error } = await supabase
        .from("dispose_log")
        .select("*")
        .gte("created_at", sevenDaysAgo.toISOString());
      if (error) throw error;
      return data;
    },
  });
}
