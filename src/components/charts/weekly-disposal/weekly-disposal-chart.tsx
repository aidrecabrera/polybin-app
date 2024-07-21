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
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";

const chartConfig = {
  bin_type: {
    label: "Bin Type",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export default function WeekDisposalChart({
  data,
  chartData,
}: {
  data: any[];
  chartData: any[];
}) {
  return (
    <Card className="w-full h-auto">
      <CardHeader className="pb-2 space-y-0">
        <CardDescription>Total Disposal</CardDescription>
        <CardTitle className="text-4xl tabular-nums">
          {data.length}{" "}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            Disposals
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            margin={{
              left: -4,
              right: -4,
            }}
            data={chartData}
          >
            <Bar
              dataKey="Non-Biodegradable"
              fill="hsl(var(--chart-2))"
              radius={5}
              fillOpacity={1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <Bar
              dataKey="Biodegradable"
              fill="hsl(var(--chart-2))"
              radius={5}
              fillOpacity={1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <Bar
              dataKey="Recyclable"
              fill="hsl(var(--chart-2))"
              radius={5}
              fillOpacity={1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <Bar
              dataKey="Hazardous"
              fill="hsl(var(--chart-2))"
              radius={5}
              fillOpacity={1}
              activeBar={<Rectangle fillOpacity={0.8} />}
            />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={4}
              tickFormatter={(value) => {
                return new Date(value).toLocaleDateString("en-US", {
                  weekday: "short",
                });
              }}
            />
            <ChartTooltip
              defaultIndex={2}
              content={
                <ChartTooltipContent
                  hideIndicator
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    });
                  }}
                />
              }
              cursor={false}
            />
            <ReferenceLine
              y={
                chartData.reduce((acc, cur) => {
                  const totalDisposals = Object.values(cur)
                    .slice(1)
                    // @ts-ignore
                    .reduce((a, b) => a + Number(b || 0), 0);
                  return acc + totalDisposals;
                }, 0) / chartData.length
              }
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="3 3"
              strokeWidth={1}
            >
              <Label
                position="insideBottomLeft"
                value="Average Disposals"
                offset={15}
                fontSize={14}
                fontWeight={600}
                fill="hsl(var(--foreground))"
              />
              <Label
                position="insideTopLeft"
                value={
                  "Total " +
                  Math.round(
                    chartData.reduce((acc, cur) => {
                      const totalDisposals = Object.values(cur)
                        .slice(1)
                        //  @ts-ignore
                        .reduce((a, b) => a + Number(b || 0), 0);
                      return acc + totalDisposals;
                    }, 0) / chartData.length
                  ).toString() +
                  " waste on average"
                }
                fill="hsl(var(--foreground))"
                offset={15}
                fontSize={14}
                fontWeight={600}
              />
            </ReferenceLine>
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-1 ">
        <div>
          Over the past 7 days,{" "}
          <span className="font-medium text-foreground">
            {data.reduce((acc, log) => acc + (log.bin_type ? 1 : 0), 0)}
          </span>{" "}
          waste disposals were recorded.
        </div>
      </CardFooter>
    </Card>
  );
}
