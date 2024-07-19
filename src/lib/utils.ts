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

