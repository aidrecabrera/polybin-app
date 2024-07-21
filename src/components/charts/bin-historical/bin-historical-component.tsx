// bin-historical-component.tsx
import { supabase } from "@/client/supabaseClient";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import {
  BinHistoricalChart,
  ProcessedBinLevelData,
} from "./bin-historical-chart";

interface RawBinLevelData {
  created_at: string;
  SENSOR_1: number;
  SENSOR_2: number;
  SENSOR_3: number;
  SENSOR_4: number;
}

const convertSensorData = (value: number): number => {
  const clampedValue = Math.max(10, Math.min(40, value));
  return Math.floor(((40 - clampedValue) / 30) * 100);
};

const processRawData = (
  rawData: RawBinLevelData[]
): ProcessedBinLevelData[] => {
  return rawData.map((item) => ({
    created_at: item.created_at,
    Biodegradable: convertSensorData(item.SENSOR_1),
    NonBiodegradable: convertSensorData(item.SENSOR_2),
    Recyclable: convertSensorData(item.SENSOR_3),
    Hazardous: convertSensorData(item.SENSOR_4),
  }));
};

const getDateRange = (months: number) => {
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);
  startDate.setHours(0, 0, 0, 0);
  return startDate.toISOString();
};

const getWeeklyBinLevel = async () => {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from("bin_levels")
    .select("*")
    .order("created_at", { ascending: false })
    .gte("created_at", sevenDaysAgo.toISOString());

  if (error) throw error;

  return processRawData(data);
};

const getTodayBinLevel = async () => {
  const today = new Date();
  const startOfDay = new Date(today.setUTCHours(0, 0, 0, 0)).toISOString();
  const endOfDay = new Date(today.setUTCHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from("bin_levels")
    .select("created_at, SENSOR_1, SENSOR_2, SENSOR_3, SENSOR_4")
    .gte("created_at", startOfDay)
    .lte("created_at", endOfDay)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return processRawData(data);
};

const getThirtyDaysBinLevel = async () => {
  const startDate = getDateRange(1);

  const { data, error } = await supabase
    .from("bin_levels")
    .select("*")
    .order("created_at", { ascending: false })
    .gte("created_at", startDate);

  if (error) throw error;

  return processRawData(data);
};

const getThreeMonthsBinLevel = async () => {
  const startDate = getDateRange(3);

  const { data, error } = await supabase
    .from("bin_levels")
    .select("*")
    .order("created_at", { ascending: false })
    .gte("created_at", startDate);

  if (error) throw error;

  return processRawData(data);
};

const fetchBinLevels = async (
  timeRange: string
): Promise<ProcessedBinLevelData[]> => {
  switch (timeRange) {
    case "today":
      return getTodayBinLevel();
    case "7d":
      return getWeeklyBinLevel();
    case "30d":
      return getThirtyDaysBinLevel();
    case "3m":
      return getThreeMonthsBinLevel();
    default:
      return getWeeklyBinLevel();
  }
};

export function BinHistoricalComponent() {
  const [timeRange, setTimeRange] = React.useState("7d");

  const { data, isLoading, error } = useQuery({
    queryKey: ["binLevels", timeRange],
    queryFn: () => fetchBinLevels(timeRange),
  });

  return (
    <BinHistoricalChart
      data={data || []}
      timeRange={timeRange}
      setTimeRange={setTimeRange}
      isLoading={isLoading}
      error={error}
    />
  );
}
