import { ChartConfig } from "../ui/chart";

export const weeklyChartConfig = {
  SENSOR_1: {
    label: "Sensor 1",
    color: "hsl(var(--chart-1))",
  },
  SENSOR_2: {
    label: "Sensor 2",
    color: "hsl(var(--chart-2))",
  },
  SENSOR_3: {
    label: "Sensor 3",
    color: "hsl(var(--chart-3))",
  },
  SENSOR_4: {
    label: "Sensor 4",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;
