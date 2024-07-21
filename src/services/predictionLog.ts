import { supabase } from "@/client/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export function getWeekPredictionLog() {
  return useQuery({
    queryKey: ["weekPredictionLog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("prediction_log")
        .select("*")
        .limit(100);
      if (error) throw error;
      return data;
    },
  });
}

export async function fetchPredictionLogFromSupabase(
  page: number,
  pageSize: number,
  startDate?: Date,
  endDate?: Date
) {
  const from = page * pageSize;
  const to = from + pageSize - 1;

  const startOfDay = startDate
    ? new Date(startDate.setUTCHours(0, 0, 0, 0)).toISOString()
    : undefined;
  const endOfDay = endDate
    ? new Date(endDate.setUTCHours(23, 59, 59, 999)).toISOString()
    : undefined;

  let query = supabase
    .from("prediction_log")
    .select("*", { count: "exact" })
    .range(from, to);

  if (startOfDay) {
    query = query.gte("created_at", startOfDay);
  }
  if (endOfDay) {
    query = query.lte("created_at", endOfDay);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error('Error fetching prediction log:', error);
    return { data: [], count: 0 };
  }

  return { data, count };
}
