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
import { getWeekPredictionLog } from "@/services/predictionLog";
import { Area, AreaChart, Label, ReferenceLine } from "recharts";

export default function PredictionChart() {
  const { data: prediction_log, isLoading, error } = getWeekPredictionLog();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  if (!prediction_log) return <div>No data available</div>;

  const chartData = prediction_log.map(
    (log: { created_at: string | number | Date; confidence: any }) => ({
      date: new Date(log.created_at).toLocaleDateString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }),
      confidence: log.confidence,
    })
  );

  const averageConfidence =
    chartData.reduce(
      (acc: any, cur: { confidence: any }) => acc + cur.confidence,
      0
    ) / chartData.length;

  return (
    <Card>
      <CardHeader className="p-4 pb-0">
        <CardTitle>Average Confidence</CardTitle>
        <CardDescription>
          Over the last 100 prediction, the average confidence of detections was{" "}
          {averageConfidence.toFixed(2)}.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-baseline gap-4 p-4 pt-0">
        <div className="flex items-baseline gap-1 text-6xl font-bold leading-none tabular-nums">
          {averageConfidence.toFixed(2)}
          <span className="text-sm font-normal text-muted-foreground">
            confidence
          </span>
        </div>
        <div className="w-full">
          <ChartContainer
            config={{
              confidence: {
                label: "Confidence",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="w-full ml-auto h-[107px]"
          >
            <AreaChart
              width={500}
              height={200}
              data={chartData}
              margin={{
                top: 15,
                right: 30,
                left: 0,
                bottom: 0,
              }}
            >
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideLabel />}
                formatter={(value: number) => (
                  <div className="flex min-w-[120px] items-center text-xs text-muted-foreground gap-2">
                    Confidence
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value.toFixed(2)}
                    </div>
                  </div>
                )}
              />
              <Area
                type="monotone"
                dataKey="confidence"
                stroke="var(--color-confidence)"
                fill="var(--color-confidence)"
                fillOpacity={0.2}
              />
              <ReferenceLine
                y={averageConfidence}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                <Label
                position="insideTopRight"
                value={
                  "Avg. Confidence"
                }
                fill="hsl(var(--foreground))"
                offset={15}
                fontSize={14}
                fontWeight={400}
              />
              </ReferenceLine>
            </AreaChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
