import { supabase } from "@/client/supabaseClient";
import { getPastWeekDates } from "@/lib/utils";
import { getWeekDisposeLog } from "@/services/disposeLog";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import WeeklyDisposalChart from "./weekly-disposal-chart";

interface DisposeLog {
  created_at: string;
  bin_type: string;
}

interface ProcessedData {
  [date: string]: {
    [binType: string]: number;
  };
}

function WeeklyDisposalComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading, error } = getWeekDisposeLog();

  useEffect(() => {
    const channel = supabase
      .channel('dispose_log')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'dispose_log',
        },
        (payload) => {
          console.log(payload);
          queryClient.invalidateQueries({ queryKey: ['weekDisposeLog'] });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;
  if (!data) return <div>No data available</div>;

  const processedData: ProcessedData = data.reduce(
    (acc: ProcessedData, log: DisposeLog) => {
      const date = new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      if (!acc[date]) acc[date] = {};
      if (!acc[date][log.bin_type]) acc[date][log.bin_type] = 0;
      acc[date][log.bin_type] += 1;

      return acc;
    },
    {}
  );

  const pastWeekDates = getPastWeekDates();
  const chartData = pastWeekDates.map((date) => ({
    date,
    ...processedData[date],
  }));
  return <WeeklyDisposalChart data={data} chartData={chartData} />;
}

export default WeeklyDisposalComponent;
