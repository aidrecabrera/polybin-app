import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
  return data.map(item => ({
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
