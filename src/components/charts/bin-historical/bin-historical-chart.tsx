// bin-historical-chart.tsx
// @ts-nocheck
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
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export const chartConfig = {
  binLevels: {
    label: "Bin Levels",
  },
  Biodegradable: {
    label: "Biodegradable",
    color: "hsl(var(--chart-1))",
  },
  NonBiodegradable: {
    label: "Non-Biodegradable",
    color: "hsl(var(--chart-2))",
  },
  Recyclable: {
    label: "Recyclable",
    color: "hsl(var(--chart-3))",
  },
  Hazardous: {
    label: "Hazardous",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig;

export interface ProcessedBinLevelData {
  created_at: string;
  Biodegradable: number;
  NonBiodegradable: number;
  Recyclable: number;
  Hazardous: number;
}

interface BinHistoricalChartProps {
  data: ProcessedBinLevelData[];
  timeRange: string;
  setTimeRange: (range: string) => void;
  isLoading: boolean;
  error: Error | null;
}

export function BinHistoricalChart({
  data,
  timeRange,
  setTimeRange,
  isLoading,
  error,
}: BinHistoricalChartProps) {
  if (isLoading)
    return (
      <Card>
        <div class="animate-pulse">
          <div class="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
            <div class="grid flex-1 gap-1 text-center sm:text-left">
              <div class="h-4 bg-gray-200/5 rounded w-1/3"></div>
              <div class="mt-2 h-4 bg-gray-200/5 rounded w-2/3"></div>
            </div>
            <div class="w-[160px] rounded-lg sm:ml-auto h-10 bg-gray-200/5"></div>
          </div>

          <div class="px-2 pt-4 sm:px-6 sm:pt-6">
            <div class="aspect-auto h-[350px] w-full bg-gray-200/5"></div>
          </div>
        </div>
      </Card>
    );
  if (error) return <div>Error fetching data: {error.message}</div>;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Bin Levels Chart</CardTitle>
          <CardDescription>
            Showing bin levels for the selected time range
          </CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
            aria-label="Select time range"
          >
            <SelectValue placeholder="Last 7 days" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="today" className="rounded-lg">
              Today
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="3m" className="rounded-lg">
              Last 3 months
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              {Object.entries(chartConfig).map(([key, value]) => {
                if (key === "binLevels") return null;
                return (
                  <linearGradient
                    key={key}
                    id={`fill${key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor={value.color}
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor={value.color}
                      stopOpacity={0.1}
                    />
                  </linearGradient>
                );
              })}
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                });
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      hour: "numeric",
                      minute: "numeric",
                    });
                  }}
                />
              }
            />
            {Object.entries(chartConfig).map(([key, value]) => {
              if (key === "binLevels") return null;
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  stackId="1"
                  stroke={value.color}
                  fill={`url(#fill${key})`}
                />
              );
            })}
            <ChartLegend content={<ChartLegendContent />} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
