import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const chartData = [
  { date: "2024-01-01", SENSOR_1: 22, SENSOR_2: 30, SENSOR_3: 25, SENSOR_4: 20 },
  { date: "2024-01-02", SENSOR_1: 25, SENSOR_2: 28, SENSOR_3: 27, SENSOR_4: 19 },
  { date: "2024-01-03", SENSOR_1: 21, SENSOR_2: 26, SENSOR_3: 23, SENSOR_4: 18 },
  { date: "2024-01-04", SENSOR_1: 24, SENSOR_2: 32, SENSOR_3: 28, SENSOR_4: 22 },
  { date: "2024-01-05", SENSOR_1: 27, SENSOR_2: 29, SENSOR_3: 24, SENSOR_4: 20 },
  { date: "2024-01-06", SENSOR_1: 23, SENSOR_2: 31, SENSOR_3: 26, SENSOR_4: 21 },
  { date: "2024-01-07", SENSOR_1: 28, SENSOR_2: 35, SENSOR_3: 30, SENSOR_4: 25 },
]

const chartConfig = {
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
} satisfies ChartConfig

export function BinLevelsDailyChart() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Bin Levels - Daily</CardTitle>
        <CardDescription>Showing daily bin levels</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="SENSOR_1" fill="var(--color-SENSOR_1)" radius={4} />
            <Bar dataKey="SENSOR_2" fill="var(--color-SENSOR_2)" radius={4} />
            <Bar dataKey="SENSOR_3" fill="var(--color-SENSOR_3)" radius={4} />
            <Bar dataKey="SENSOR_4" fill="var(--color-SENSOR_4)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="w-4 h-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing daily bin levels for the past week
        </div>
      </CardFooter>
    </Card>
  )
}
