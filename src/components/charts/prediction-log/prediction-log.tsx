import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer } from "@/components/ui/chart";
import { getWeekPredictionLog } from "@/services/predictionLog";
import {
  Bar,
  BarChart,
  Label,
  Rectangle,
  ReferenceLine,
  XAxis,
} from "recharts";

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
          Over the last 7 days, the average confidence of detections was{" "}
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
                color: "hsl(var(--chart-1))",
              },
            }}
            className="w-full ml-auto h-[107px]"
          >
            <BarChart
              accessibilityLayer
              margin={{
                left: 0,
                right: 0,
                top: 20,
                bottom: 0,
              }}
              data={chartData}
            >
              <Bar
                dataKey="confidence"
                fill="var(--color-confidence)"
                radius={2}
                fillOpacity={0.2}
                activeIndex={chartData.length - 1}
                activeBar={<Rectangle fillOpacity={0.8} />}
              />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={4}
                hide
              />
              <ReferenceLine
                y={averageConfidence}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              >
                <Label
                  position="insideBottomLeft"
                  value="Average Confidence"
                  offset={10}
                  fill="hsl(var(--foreground))"
                />
                <Label
                  position="insideTopLeft"
                  value={averageConfidence.toFixed(2)}
                  className="text-lg"
                  fill="hsl(var(--foreground))"
                  offset={10}
                  startOffset={100}
                />
              </ReferenceLine>
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
