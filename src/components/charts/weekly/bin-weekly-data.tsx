import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
  ChartTooltipContent
} from "@/components/ui/chart";
import { weeklyChartConfig } from "../config";

export function BinWeeklyChart({
  chartData,
}: {
  chartData: {
    date: string;
    SENSOR_1: number;
    SENSOR_2: number;
    SENSOR_3: number;
    SENSOR_4: number;
  }[];
}) {
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof weeklyChartConfig>("SENSOR_1");

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-col items-stretch p-0 space-y-0 border-b sm:flex-row">
        <div className="flex flex-col justify-center flex-1 gap-1 px-6 py-5 sm:py-6">
          <CardTitle>Daily Bin Levels</CardTitle>
          <CardDescription>
            Showing bin levels for the last 7 days
          </CardDescription>
        </div>
        <div className="flex">
          {["SENSOR_1", "SENSOR_2", "SENSOR_3", "SENSOR_4"].map((key) => {
            const chart = key as keyof typeof weeklyChartConfig;
            return (
              <button
                key={chart}
                data-active={activeChart === chart}
                className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                onClick={() => setActiveChart(chart)}
              >
                <span className="text-xs text-muted-foreground">
                  Average {weeklyChartConfig[chart].label}
                </span>
                <span className="w-full text-lg font-bold leading-none text-center sm:text-3xl">
                  {(
                    chartData.reduce((acc, curr) => acc + curr[chart], 0) /
                    chartData.length
                  ).toFixed(0) + "%"}
                </span>
              </button>
            );
          })}
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={weeklyChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey={activeChart}
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={activeChart} fill={`var(--color-${activeChart})`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
