import { TableType } from "@/types/development.types";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const convertSensorData = (value: number): number => {
  const min = 10;
  const max = 40;
  const range = max - min;
  const adjustedValue = value - min;
  let percentage = (adjustedValue / range) * 100;
  percentage = Math.round(Math.max(0, Math.min(percentage, 100)));
  return percentage;
};

export function mapDailySensorData(data: any[], sensorKey: string) {
  return data.map((item) => ({
    created_at: item.created_at,
    SENSOR_DATA: Math.floor((40 - item[sensorKey]) * (100 / 30)),
  }));
}

export const getPastWeekDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay();
  const pastSunday = new Date(today);
  pastSunday.setDate(today.getDate() - dayOfWeek);
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(pastSunday);
    date.setDate(pastSunday.getDate() + i);
    dates.push(
      date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
    );
  }
  return dates;
};

export interface DailyTotal {
  date: string;
  bio: number;
  non_bio: number;
  recyclable: number;
  hazardous: number;
}

export function transformDisposalLog(logs: TableType<"dispose_log">[]): DailyTotal[] {
  const groupedData: Record<string, Record<string, number>> = {};

  logs.forEach(log => {
    const date = log.created_at.split('T')[0];
    let binType = log.bin_type.toLowerCase();

    if (binType === "non-biodegradable") {
      binType = "non_bio";
    } else if (binType === "biodegradable") {
      binType = "bio";
    }

    if (!groupedData[date]) {
      groupedData[date] = {
        bio: 0,
        non_bio: 0,
        recyclable: 0,
        hazardous: 0
      };
    }

    if (groupedData[date][binType] !== undefined) {
      groupedData[date][binType]++;
    }
  });

  return Object.keys(groupedData).map(date => ({
    date,
    bio: groupedData[date].bio,
    non_bio: groupedData[date].non_bio,
    recyclable: groupedData[date].recyclable,
    hazardous: groupedData[date].hazardous
  }));
}