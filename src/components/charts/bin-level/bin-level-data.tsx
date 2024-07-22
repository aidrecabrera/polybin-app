import { supabase } from "@/client/supabaseClient";
import { getLatestBinLevel } from "@/services/binLevel";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { BinLevelChart } from "./bin-level-chart";

function BinLevelComponent() {
  const queryClient = useQueryClient();
  const { data, isLoading } = getLatestBinLevel();

  useEffect(() => {
    const channel = supabase
      .channel("prediction_log")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bin_levels"
        },
        (payload) => {
          console.log(payload);
          queryClient.invalidateQueries({
            queryKey: ["latestBinLevel"],
          });
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [queryClient]);

  if (isLoading) return <div>Loading...</div>;

  const chartData = [
    { sensor: "Sensor 1", level: data?.SENSOR_1 ?? 0 },
    { sensor: "Sensor 2", level: data?.SENSOR_2 ?? 0 },
    { sensor: "Sensor 3", level: data?.SENSOR_3 ?? 0 },
    { sensor: "Sensor 4", level: data?.SENSOR_4 ?? 0 },
  ];

  return (
    <div>
      <BinLevelChart chartData={chartData} />
    </div>
  );
}

export default BinLevelComponent;
