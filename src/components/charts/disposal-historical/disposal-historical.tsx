import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { DailyTotal } from "@/lib/utils";

const chartConfig = {
  date: {
    label: "Date",
  },
  bio: {
    label: "Biodegradable",
    color: "hsl(var(--chart-1))",
  },
  non_bio: {
    label: "Non-Biodegradable",
    color: "hsl(var(--chart-2))",
  },
  recyclable: {
    label: "Recyclable",
    color: "hsl(var(--chart-3))",
  },
  hazardous: {
    label: "Hazardous",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export function DisposalHistoricalChart({ data }: { data: DailyTotal[] }) {
  const [timeRange, setTimeRange] = React.useState("90d");
  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  });

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Disposal History</CardTitle>
          <CardDescription>
            Biodegradable, Non-Biodegradable, Recyclable, and Hazardous
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillBio" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-bio)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-bio)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillNon_Bio" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-non_bio)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-non_bio)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillRecyclable" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-recyclable)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-recyclable)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillHazardous" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-hazardous)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-hazardous)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              reversed
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
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              type="monotone"
              dataKey="bio"
              stroke="var(--color-bio)"
              fill="url(#fillBio)"
            />
            <Area
              type="monotone"
              dataKey="non_bio"
              stroke="var(--color-non_bio)"
              fill="url(#fillNonBio)"
            />
            <Area
              type="monotone"
              dataKey="recyclable"
              stroke="var(--color-recyclable)"
              fill="url(#fillRecyclable)"
            />
            <Area
              type="monotone"
              dataKey="hazardous"
              stroke="var(--color-hazardous)"
              fill="url(#fillHazardous)"
            />
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
