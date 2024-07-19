import { supabase } from "@/client/supabaseClient";
import { convertSensorData } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

export function getWeeklyBinLevel() {
  return useQuery({
    queryKey: ["weeklyBinLevel"],
    queryFn: async () => {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      sevenDaysAgo.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from("bin_levels")
        .select("*")
        .order("created_at", { ascending: false })
        .gte("created_at", sevenDaysAgo.toISOString());

      if (error) throw error;

      const weeklyData = data.map((data) => ({
        date: data.created_at,
        SENSOR_1: convertSensorData(data.SENSOR_1),
        SENSOR_2: convertSensorData(data.SENSOR_2),
        SENSOR_3: convertSensorData(data.SENSOR_3),
        SENSOR_4: convertSensorData(data.SENSOR_4),
      }));

      return weeklyData;
    },
  });
}
