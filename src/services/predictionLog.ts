import { supabase } from "@/client/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function getWeekPredictionLog() {
  return useQuery({
    queryKey: ["weekPredictionLog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_log")
        .select("*")
        .limit(50);
      if (error) throw error;
      return data;
    },
  });
}
