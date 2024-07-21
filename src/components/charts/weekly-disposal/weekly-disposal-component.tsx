import { getPastWeekDates } from "@/lib/utils";
import { getWeekDisposeLog } from "@/services/disposeLog";
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
  const { data, isLoading, error } = getWeekDisposeLog();

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
