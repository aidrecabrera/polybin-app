import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { dailyChartConfig } from "../config";

function generateTimeSlots() {
  const times = [];
  for (let i = 0; i < 24; i++) {
    for (let j = 0; j < 60; j += 1) {
      const hour = i < 10 ? `0${i}` : i;
      const minute = j < 10 ? `0${j}` : j;
      times.push(`${hour}:${minute}`);
    }
  }
  return times;
}

function mergeDataWithTimeSlots(data: any[]) {
  const timeSlots = generateTimeSlots();
  const dataMap = data.reduce((acc, entry) => {
    const date = new Date(entry.created_at);
    const time = date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    acc[time] = entry.SENSOR_DATA;
    return acc;
  }, {});

  return timeSlots.map((time) => ({
    created_at: time,
    SENSOR_DATA: dataMap[time] || null,
  }));
}

export function BinDailyChart({
  data,
  header = "",
}: {
  data: {
    created_at: string;
    SENSOR_DATA: number;
  }[];
  header: string;
}) {
  const processedData = mergeDataWithTimeSlots(data);

  return (
    <Card className="w-full h-full">
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>{header} Bin Level</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={dailyChartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={processedData}>
            <defs>
              <linearGradient id="fillSensorData" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-sensor_data)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-sensor_data)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="created_at"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const [hour, minute] = value.split(":");
                const date = new Date();
                date.setHours(hour, minute);
                return date.toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                });
              }}
            />
            <ChartTooltip
              cursor={true}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(`1970-01-01T${value}:00`).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    });
                  }}
                  indicator="line"
                />
              }
            />
            <Area
              dataKey="SENSOR_DATA"
              type="natural"
              fill="url(#fillSensorData)"
              stroke="var(--color-sensor_data)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
