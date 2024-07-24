import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartConfig,
    ChartContainer,
    ChartLegendContent,
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
import { useState } from "react";

const chartConfig = {
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

export function DisposalHistoricalChartBar({ data }: { data: DailyTotal[] }) {
  const [timeRange, setTimeRange] = useState("90d");
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
      <CardHeader>
        <CardTitle>Disposal History</CardTitle>
        <CardDescription>
          Biodegradable, Non-Biodegradable, Recyclable, and Hazardous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart data={filteredData} barGap={5} barCategoryGap="10%">
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
            <YAxis />
            <Tooltip
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
            <Legend content={<ChartLegendContent />} />
            <Bar dataKey="bio" fill="var(--color-bio)" radius={4} />
            <Bar dataKey="non_bio" fill="var(--color-non_bio)" radius={4} />
            <Bar
              dataKey="recyclable"
              fill="var(--color-recyclable)"
              radius={4}
            />
            <Bar dataKey="hazardous" fill="var(--color-hazardous)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing disposal data for the selected time range
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
      </CardFooter>
    </Card>
  );
}
