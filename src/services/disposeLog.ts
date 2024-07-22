import { supabase } from "@/client/supabaseClient";
import { useQuery } from "@tanstack/react-query";

export interface DisposalLog {
  id: number;
  created_at: string;
  bin_type: string;
}

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

export function getRecentDisposal(limit: number = 8) {
  return useQuery({
    queryKey: ["recentDisposal"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("dispose_log")
        .select("*")
        .limit(limit)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });
}

const fetchRecentDisposal = async (page: number, limit: number) => {
  const start = (page - 1) * limit;
  const end = start + limit - 1;

  const { data, error, count } = await supabase
    .from("dispose_log")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(start, end);

  if (error) throw error;
  return { data, count };
};

export const useRecentDisposal = (page: number, limit: number) => {
  return useQuery({
    queryKey: ["recentDisposal", page, limit],
    queryFn: () => fetchRecentDisposal(page, limit),
  });
};

export async function fetchDisposeLogFromSupabase(
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
    .from("dispose_log")
    .select("*", { count: "exact" })
    .range(from, to);

  if (startOfDay) {
    query = query.gte("created_at", startOfDay);
  }
  if (endOfDay) {
    query = query.lte("created_at", endOfDay);
  }

  const { data, count } = await query;

  return { data, count };
}
