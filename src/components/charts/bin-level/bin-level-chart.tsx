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
import { TrendingUp } from "lucide-react";
import { LabelList, RadialBar, RadialBarChart } from "recharts";

const binNames = {
  "Sensor 1": "Biodegradable",
  "Sensor 2": "Non-biodegradable",
  "Sensor 3": "Recyclable",
  "Sensor 4": "Hazardous"
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
} satisfies ChartConfig

interface ChartDataItem {
  sensor: string;
  level: number;
}

export function BinLevelChart({ chartData }: { chartData: ChartDataItem[] }) {
  const processedChartData = chartData.map(item => {
    const percentage = Math.round(((40 - item.level) / 30) * 100);
    const binName = binNames[item.sensor as keyof typeof binNames];
    return {
      bin: binName,
      percentage: Math.max(0, Math.min(100, percentage)),
      binPercentageLabel: `${binName})`,
      // @ts-ignore
      fill: binLevelChartConfig[binName as keyof typeof binLevelChartConfig].color,
    };
  });

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Bin Levels</CardTitle>
        <CardDescription>Current bin fill percentages</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={binLevelChartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <RadialBarChart
            data={processedChartData}
            startAngle={-90}
            endAngle={360}
            innerRadius={30}
            outerRadius={110}
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel nameKey="bin" formatter={(value) => `Bin is ${value}% Full`} />}
            />
            <RadialBar dataKey="percentage" background>
              <LabelList
                position="insideStart"
                dataKey="binPercentageLabel"
                className="capitalize fill-white mix-blend-luminosity"
                fontSize={11}
              />
            </RadialBar>
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Bin levels are up to date <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing current bin fill percentages (100% means full bin)
        </div>
      </CardFooter>
    </Card>
  )
}
