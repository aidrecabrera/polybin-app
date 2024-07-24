import { DatePickerWithRange } from "@/components/date-picker";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { getAllAlerts } from "@/services/alertLog";
import { endOfYear, isWithinInterval, startOfYear } from "date-fns";
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface AlertItem {
  bin_type: string | null;
  created_at: string;
}

interface MonthlyAlerts {
  non: number;
  bio: number;
  haz: number;
  rec: number;
}

const binTypeMap: { [key: string]: string } = {
  non: "Non-Biodegradable",
  bio: "Biodegradable",
  haz: "Hazardous",
  rec: "Recyclable",
};

const months: string[] = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const binTypes: (keyof MonthlyAlerts)[] = ["non", "bio", "haz", "rec"];

const timeRanges = [
  { value: "thisYear", label: "This Year" },
  { value: "custom", label: "Custom Range" },
];

export function AlertHistoricalTable(): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = React.useState<string>(currentYear.toString());
  const [selectedRange, setSelectedRange] = React.useState<string>("thisYear");
  const [isReversed, setIsReversed] = React.useState<boolean>(true);
  const [startDate, setStartDate] = React.useState<Date>(startOfYear(new Date()));
  const [endDate, setEndDate] = React.useState<Date>(endOfYear(new Date()));

  const { data: alertLogs, isLoading, error } = getAllAlerts();

  const filteredData = React.useMemo(() => {
    if (!alertLogs) return [];
    return alertLogs.filter((item: AlertItem) => {
      const date = new Date(item.created_at);
      if (selectedRange === "thisYear") {
        return date.getFullYear().toString() === selectedYear;
      } else {
        return isWithinInterval(date, { start: startDate, end: endDate });
      }
    });
  }, [alertLogs, selectedYear, selectedRange, startDate, endDate]);

  const getMonthData = (month: number): MonthlyAlerts => {
    const monthData = filteredData.filter((item: AlertItem) => {
      const date = new Date(item.created_at);
      return date.getMonth() === month;
    });

    return {
      non: monthData.filter(item => item.bin_type === "non").length,
      bio: monthData.filter(item => item.bin_type === "bio").length,
      haz: monthData.filter(item => item.bin_type === "haz").length,
      rec: monthData.filter(item => item.bin_type === "rec").length,
    };
  };

  const monthlyData: MonthlyAlerts[] = React.useMemo(
    () => months.map((_, index) => getMonthData(index)),
    [filteredData]
  );

  const calculateTotal = (key: keyof MonthlyAlerts): number => {
    return monthlyData.reduce((sum, row) => sum + row[key], 0);
  };

  const toggleReverse = () => {
    setIsReversed(!isReversed);
  };

  const renderNormalTable = () => (
    <Table>
      <TableCaption>
        The number of alerts by bin type monthly for {selectedRange === "thisYear" ? selectedYear : "the selected date range"}.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          {binTypes.map((type) => (
            <TableHead key={type}>{binTypeMap[type]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {monthlyData.map((row, index) => (
          <TableRow key={months[index]}>
            <TableCell className="font-medium">{months[index]}</TableCell>
            {binTypes.map((type) => (
              <TableCell key={type}>{row[type]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-medium">Total</TableCell>
          {binTypes.map((type) => (
            <TableCell key={type}>{calculateTotal(type)}</TableCell>
          ))}
        </TableRow>
      </TableFooter>
    </Table>
  );

  const renderReversedTable = () => (
    <Table>
      <TableCaption>
        The number of alerts by bin type monthly for {selectedRange === "thisYear" ? selectedYear : "the selected date range"}.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Bin Type</TableHead>
          {months.map((month) => (
            <TableHead key={month}>{month}</TableHead>
          ))}
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {binTypes.map((type) => (
          <TableRow key={type}>
            <TableCell className="font-medium">
              {binTypeMap[type]}
            </TableCell>
            {monthlyData.map((row, index) => (
              <TableCell key={index}>{row[type]}</TableCell>
            ))}
            <TableCell>{calculateTotal(type)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Alert History</CardTitle>
          <CardDescription>
            Non-Biodegradable, Biodegradable, Hazardous, and Recyclable
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Select value={selectedRange} onValueChange={setSelectedRange}>
            <SelectTrigger
              className="w-[160px] rounded-lg"
              aria-label="Select time range"
            >
              <SelectValue placeholder="Select Range" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {timeRanges.map((range) => (
                <SelectItem
                  key={range.value}
                  value={range.value}
                  className="rounded-lg"
                >
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedRange === "thisYear" && (
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger
                className="w-[160px] rounded-lg"
                aria-label="Select a year"
              >
                <SelectValue placeholder="Select Year" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                {years.map((year) => (
                  <SelectItem
                    key={year}
                    value={year.toString()}
                    className="rounded-lg"
                  >
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          {selectedRange === "custom" && (
            <DatePickerWithRange
              setStartDate={setStartDate}
              setEndDate={setEndDate}
            />
          )}
          <Button onClick={toggleReverse} variant="outline" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isReversed ? renderReversedTable() : renderNormalTable()}
      </CardContent>
    </Card>
  );
}