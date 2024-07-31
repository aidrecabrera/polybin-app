// @ts-nocheck

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  ResponsiveContainer,
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
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface ChartDataItem {
  sensor: string;
  level: number;
}

const binNames = {
  "Sensor 1": "Biodegradable",
  "Sensor 2": "Non-biodegradable",
  "Sensor 3": "Recyclable",
  "Sensor 4": "Hazardous",
};

const binLevelChartConfig = {
  percentage: {
    label: "Percentage",
  },
  Biodegradable: {
    label: "Biodegradable",
    color: "hsl(var(--chart-1))",
  },
  "Non-biodegradable": {
    label: "Non-biodegradable",
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

export function BinLevelChart({ chartData }: { chartData: ChartDataItem[] }) {
  const processedChartData = chartData.map((item) => {
    const level = parseFloat(item.level.toFixed(2));

    const percentage = Math.round(((40 - level) / (40 - 10)) * 100);
    const binName = binNames[item.sensor as keyof typeof binNames];
    return {
      bin: binName,
      percentage: Math.max(0, Math.min(100, percentage)),
      binPercentageLabel: `${binName}`,
      fill: binLevelChartConfig[binName as keyof typeof binLevelChartConfig]
        .color,
    };
  });
  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle>Bin Level Chart</CardTitle>
        <CardDescription>Waste Distribution by Bin Type</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={binLevelChartConfig}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={processedChartData}
              layout="vertical"
              margin={{
                left: 0,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" />
              <YAxis
                dataKey="bin"
                type="category"
                width={120}
                tickLine={false}
                axisLine={false}
                hide
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Bar
                dataKey="percentage"
                fill="var(--color-percentage)"
                radius={[0, 4, 4, 0]}
              >
                <LabelList
                  dataKey="binPercentageLabel"
                  position="insideLeft"
                  fill="white"
                  fontSize={12}
                  offset={10}
                  fontWeight={600}
                />
                <LabelList
                  dataKey="percentage"
                  position="right"
                  className="fill-foreground"
                  fontSize={12}
                  fontWeight={600}
                  formatter={(value: any) => `${value}%`}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <TrendingUp className="w-4 h-4" />
          Recyclable waste increased by 5.2% this month
        </div>
        <div className="leading-none text-muted-foreground">
          Showing waste distribution across different bin types
        </div>
      </CardFooter>
    </Card>
  );
}
