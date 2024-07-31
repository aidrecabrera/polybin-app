import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { DatePickerWithRange } from "@/components/date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChartContainer, ChartTooltipContent } from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getAllAlerts } from "@/services/alertLog";
import { endOfDay, isWithinInterval, startOfDay } from "date-fns";

interface AlertItemProps {
  bin_type: string | null;
  created_at: string;
}

const binTypeMap: { [key: string]: string } = {
  non: "Non-Biodegradable",
  bio: "Biodegradable",
  haz: "Hazardous",
  rec: "Recyclable",
};

const chartConfig = {
  non: { label: "Non-Biodegradable", color: "hsl(var(--chart-1))" },
  bio: { label: "Biodegradable", color: "hsl(var(--chart-2))" },
  haz: { label: "Hazardous", color: "hsl(var(--chart-3))" },
  rec: { label: "Recyclable", color: "hsl(var(--chart-4))" },
};

const timeRanges = [
  { value: "today", label: "Today" },
  { value: "last7days", label: "Last 7 Days" },
  { value: "thisMonth", label: "This Month" },
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export function AlertHistoricalChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [selectedRange, setSelectedRange] = useState("today");
  const [startDate, setStartDate] = useState<Date>(startOfDay(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfDay(new Date()));
  const { data: alertLogs, isLoading, error } = getAllAlerts();

  useEffect(() => {
    console.log("Raw alert logs:", alertLogs);
    if (alertLogs) {
      const processedData = processAlertData(
        alertLogs,
        selectedRange,
        startDate,
        endDate
      );
      console.log("Processed chart data:", processedData);
      setChartData(processedData);
    }
  }, [alertLogs, selectedRange, startDate, endDate]);

  const processAlertData = (
    data: AlertItemProps[],
    range: string,
    start: Date,
    end: Date
  ) => {
    const now = new Date();
    const filteredData = (data || []).filter((alert) => {
      if (!alert || !alert.created_at) return false;
      const alertDate = new Date(alert.created_at);
      switch (range) {
        case "today":
          return alertDate.toDateString() === now.toDateString();
        case "last7days":
          return (
            (now.getTime() - alertDate.getTime()) / (1000 * 3600 * 24) <= 7
          );
        case "thisMonth":
          return (
            alertDate.getMonth() === now.getMonth() &&
            alertDate.getFullYear() === now.getFullYear()
          );
        case "thisYear":
          return alertDate.getFullYear() === now.getFullYear();
        case "custom":
          return isWithinInterval(alertDate, { start, end });
        default:
          return true;
      }
    });

    console.log("Filtered data:", filteredData);

    const groupedData: { [key: string]: { [key: string]: number } } = {};

    switch (range) {
      case "today":
        for (let i = 0; i < 24; i++) {
          const key = `${i.toString().padStart(2, "0")}:00`;
          groupedData[key] = { non: 0, bio: 0, haz: 0, rec: 0 };
        }
        break;
      case "last7days":
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const key = date.toISOString().split("T")[0];
          groupedData[key] = { non: 0, bio: 0, haz: 0, rec: 0 };
        }
        break;
      case "thisMonth":
        const daysInMonth = new Date(
          now.getFullYear(),
          now.getMonth() + 1,
          0
        ).getDate();
        for (let i = 1; i <= daysInMonth; i++) {
          const key = i.toString().padStart(2, "0");
          groupedData[key] = { non: 0, bio: 0, haz: 0, rec: 0 };
        }
        break;
      case "thisYear":
      case "custom":
        for (let i = 0; i < 12; i++) {
          const key = (i + 1).toString().padStart(2, "0");
          groupedData[key] = { non: 0, bio: 0, haz: 0, rec: 0 };
        }
        break;
    }

    filteredData.forEach((alert) => {
      if (!alert || !alert.created_at) return;
      let key;
      const date = new Date(alert.created_at);

      switch (range) {
        case "today":
          key = date.getHours().toString().padStart(2, "0") + ":00";
          break;
        case "last7days":
          key = date.toISOString().split("T")[0];
          break;
        case "thisMonth":
          key = date.getDate().toString().padStart(2, "0");
          break;
        case "thisYear":
        case "custom":
          key = (date.getMonth() + 1).toString().padStart(2, "0");
          break;
        default:
          key = date.toISOString().split("T")[0];
      }

      if (alert.bin_type && groupedData[key]) {
        groupedData[key][alert.bin_type] =
          (groupedData[key][alert.bin_type] || 0) + 1;
      }
    });

    console.log("Grouped data:", groupedData);

    return Object.entries(groupedData)
      .map(([key, counts]) => ({
        key,
        ...counts,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data: {error.toString()}</div>;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>
            Visualization of Waste Management Data for Different Bin Types
          </CardTitle>
          <CardDescription></CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger className="w-[160px] rounded-lg sm:ml-auto">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRange === "custom" && (
            <DatePickerWithRange
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 ssm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="key"
                tickFormatter={(value) => {
                  if (
                    selectedRange === "thisYear" ||
                    selectedRange === "custom"
                  ) {
                    const monthNames = [
                      "Jan",
                      "Feb",
                      "Mar",
                      "Apr",
                      "May",
                      "Jun",
                      "Jul",
                      "Aug",
                      "Sep",
                      "Oct",
                      "Nov",
                      "Dec",
                    ];
                    return monthNames[parseInt(value) - 1] || value;
                  }
                  return value;
                }}
              />
              <YAxis />
              <Tooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      if (
                        selectedRange === "thisYear" ||
                        selectedRange === "custom"
                      ) {
                        const monthNames = [
                          "January",
                          "February",
                          "March",
                          "April",
                          "May",
                          "June",
                          "July",
                          "August",
                          "September",
                          "October",
                          "November",
                          "December",
                        ];
                        return monthNames[parseInt(value) - 1] || value;
                      }
                      return value;
                    }}
                    indicator="dot"
                  />
                }
              />
              <Legend />
              {Object.entries(binTypeMap).map(([key, value]) => (
                <Bar
                  key={key}
                  dataKey={key}
                  name={value}
                  fill={
                    chartConfig[key as keyof typeof chartConfig]?.color ||
                    "#000000"
                  }
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
