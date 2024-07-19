import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { createLazyFileRoute } from "@tanstack/react-router";
import { TrendingUp } from "lucide-react";
import { PolarGrid, RadialBar, RadialBarChart } from "recharts";

import BinWeeklyComponent from "@/components/charts/weekly/bin-weekly-component";
import { CardFooter } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";

const data = {
  binLevels: [
    {
      date: "2024-01-01",
      sensor_1: 12,
      sensor_2: 20,
      sensor_3: 15,
      sensor_4: 10,
    },
    {
      date: "2024-01-02",
      sensor_1: 14,
      sensor_2: 18,
      sensor_3: 17,
      sensor_4: 9,
    },
    {
      date: "2024-01-03",
      sensor_1: 11,
      sensor_2: 16,
      sensor_3: 13,
      sensor_4: 8,
    },
    {
      date: "2024-01-04",
      sensor_1: 16,
      sensor_2: 22,
      sensor_3: 18,
      sensor_4: 12,
    },
    {
      date: "2024-01-05",
      sensor_1: 13,
      sensor_2: 19,
      sensor_3: 14,
      sensor_4: 10,
    },
  ],
  alertLog: [
    {
      date: "2024-01-01",
      bin_type: "Bio",
      count: 2,
    },
    {
      date: "2024-01-02",
      bin_type: "Non-bio",
      count: 3,
    },
    {
      date: "2024-01-03",
      bin_type: "Recyclable",
      count: 1,
    },
    {
      date: "2024-01-04",
      bin_type: "Hazardous",
      count: 4,
    },
    {
      date: "2024-01-05",
      bin_type: "Bio",
      count: 3,
    },
  ],
  disposeLog: [
    {
      date: "2024-01-01",
      bin_type: "Bio",
      count: 5,
    },
    {
      date: "2024-01-02",
      bin_type: "Non-bio",
      count: 6,
    },
    {
      date: "2024-01-03",
      bin_type: "Recyclable",
      count: 3,
    },
    {
      date: "2024-01-04",
      bin_type: "Hazardous",
      count: 2,
    },
    {
      date: "2024-01-05",
      bin_type: "Bio",
      count: 4,
    },
  ],
  predictionLog: [
    {
      date: "2024-01-01",
      confidence: 0.95,
      class: "Plastic",
    },
    {
      date: "2024-01-02",
      confidence: 0.88,
      class: "Metal",
    },
    {
      date: "2024-01-03",
      confidence: 0.92,
      class: "Paper",
    },
    {
      date: "2024-01-04",
      confidence: 0.85,
      class: "Glass",
    },
    {
      date: "2024-01-05",
      confidence: 0.9,
      class: "Organic",
    },
  ],
};

const BinLevelsChart = () => (
  <Card>
    <CardHeader className="pb-2 space-y-0">
      <CardDescription>Bin Levels</CardDescription>
      <CardTitle className="text-4xl tabular-nums">Sensor Data</CardTitle>
    </CardHeader>
    <CardContent>
      <ChartContainer
        config={{
          sensor_1: { label: "Sensor 1", color: "hsl(var(--chart-1))" },
          sensor_2: { label: "Sensor 2", color: "hsl(var(--chart-2))" },
          sensor_3: { label: "Sensor 3", color: "hsl(var(--chart-3))" },
          sensor_4: { label: "Sensor 4", color: "hsl(var(--chart-4))" },
        }}
      >
        <LineChart
          accessibilityLayer
          data={data.binLevels}
          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Line
            type="monotone"
            dataKey="sensor_1"
            stroke="var(--color-sensor_1)"
          />
          <Line
            type="monotone"
            dataKey="sensor_2"
            stroke="var(--color-sensor_2)"
          />
          <Line
            type="monotone"
            dataKey="sensor_3"
            stroke="var(--color-sensor_3)"
          />
          <Line
            type="monotone"
            dataKey="sensor_4"
            stroke="var(--color-sensor_4)"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </LineChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const AlertLogChart = () => (
  <Card className="flex flex-col lg:max-w-md">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
      <div>
        <CardDescription>Alerts</CardDescription>
        <CardTitle className="text-4xl tabular-nums">Alert Log</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex items-center flex-1">
      <ChartContainer
        config={{
          bin_type: { label: "Bin Type", color: "hsl(var(--chart-1))" },
        }}
        className="w-full"
      >
        <BarChart
          accessibilityLayer
          data={data.alertLog}
          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Bar dataKey="count" fill="var(--color-bin_type)" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const DisposeLogChart = () => (
  <Card className="flex flex-col lg:max-w-md">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
      <div>
        <CardDescription>Disposals</CardDescription>
        <CardTitle className="text-4xl tabular-nums">Dispose Log</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex items-center flex-1">
      <ChartContainer
        config={{
          bin_type: { label: "Bin Type", color: "hsl(var(--chart-2))" },
        }}
        className="w-full"
      >
        <BarChart
          accessibilityLayer
          data={data.disposeLog}
          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Bar dataKey="count" fill="var(--color-bin_type)" />
          <ChartTooltip content={<ChartTooltipContent />} />
        </BarChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const PredictionLogChart = () => (
  <Card className="flex flex-col lg:max-w-md">
    <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2 [&>div]:flex-1">
      <div>
        <CardDescription>Predictions</CardDescription>
        <CardTitle className="text-4xl tabular-nums">Prediction Log</CardTitle>
      </div>
    </CardHeader>
    <CardContent className="flex items-center flex-1">
      <ChartContainer
        config={{
          confidence: { label: "Confidence", color: "hsl(var(--chart-3))" },
        }}
        className="w-full"
      >
        <AreaChart
          accessibilityLayer
          data={data.predictionLog}
          margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Area
            type="monotone"
            dataKey="confidence"
            stroke="var(--color-confidence)"
            fill="var(--color-confidence)"
          />
          <ChartTooltip content={<ChartTooltipContent />} />
        </AreaChart>
      </ChartContainer>
    </CardContent>
  </Card>
);

const chartData = [
  { sensor: "SENSOR_1", level: 40, fill: "var(--color-sensor_1)" },
  { sensor: "SENSOR_2", level: 30, fill: "var(--color-sensor_2)" },
  { sensor: "SENSOR_3", level: 20, fill: "var(--color-sensor_3)" },
  { sensor: "SENSOR_4", level: 10, fill: "var(--color-sensor_4)" },
];

const chartConfig = {
  level: {
    label: "Bin Level",
  },
  sensor_1: {
    label: "Sensor 1",
    color: "hsl(var(--chart-1))",
  },
  sensor_2: {
    label: "Sensor 2",
    color: "hsl(var(--chart-2))",
  },
  sensor_3: {
    label: "Sensor 3",
    color: "hsl(var(--chart-3))",
  },
  sensor_4: {
    label: "Sensor 4",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function BinLevelsComponent() {
  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Bin Levels</CardTitle>
        <CardDescription>Current bin levels</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart data={chartData} innerRadius={30} outerRadius={100}>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="sensor" />}
            />
            <PolarGrid gridType="circle" />
            <RadialBar dataKey="level" minAngle={15} clockWise />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Bin levels are up to date <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current bin levels (10 means full, 40 means empty)
        </div>
      </CardFooter>
    </Card>
  );
}

export function Charts() {
  return (
    <div className="flex flex-col flex-wrap items-start justify-center max-w-6xl gap-6 p-6 mx-auto chart-wrapper sm:flex-row sm:p-8">
      {/* <BinLevelsDailyChart /> */}
      <BinWeeklyComponent />
      <BinLevelsComponent />
        <BinLevelsChart />
        <AlertLogChart />
        <DisposeLogChart />
        <PredictionLogChart />
    </div>
  );
}

export const Route = createLazyFileRoute("/")({
  component: () => (
    <>
      <Charts />
    </>
  ),
});
