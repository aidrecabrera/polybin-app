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
import { ArrowUpDown } from "lucide-react";
import React from "react";

interface DailyTotal {
  date: string;
  recyclable: number;
  hazardous: number;
  bio: number;
  non_bio: number;
}

type MonthlyData = Record<keyof Omit<DailyTotal, "date">, number>;

interface DisposalHistoricalTableProps {
  data: DailyTotal[];
}

const months: string[] = [
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

const wasteTypes: (keyof MonthlyData)[] = [
  "recyclable",
  "hazardous",
  "bio",
  "non_bio",
];

const wasteTypeLabels: Record<keyof MonthlyData, string> = {
  recyclable: "Recyclable",
  hazardous: "Hazardous",
  bio: "Biodegradable",
  non_bio: "Non-Biodegradable",
};

export function DisposalHistoricalTable({
  data,
}: DisposalHistoricalTableProps): React.ReactElement {
  const currentYear = new Date().getFullYear();
  const years: number[] = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const [selectedYear, setSelectedYear] = React.useState<string>(
    currentYear.toString()
  );
  const [isReversed, setIsReversed] = React.useState<boolean>(true);

  const filteredData = React.useMemo(
    () =>
      data.filter((item) => {
        const date = new Date(item.date);
        return date.getFullYear().toString() === selectedYear;
      }),
    [data, selectedYear]
  );

  const getMonthData = (month: number): MonthlyData => {
    const monthData = filteredData.find((item) => {
      const date = new Date(item.date);
      return date.getMonth() === month;
    });

    return {
      recyclable: monthData?.recyclable ?? 0,
      hazardous: monthData?.hazardous ?? 0,
      bio: monthData?.bio ?? 0,
      non_bio: monthData?.non_bio ?? 0,
    };
  };

  const monthlyData: MonthlyData[] = React.useMemo(
    () => months.map((_, index) => getMonthData(index)),
    [filteredData]
  );

  const calculateTotal = (key: keyof MonthlyData): number => {
    return monthlyData.reduce((sum, row) => sum + row[key], 0);
  };

  const toggleReverse = () => {
    setIsReversed(!isReversed);
  };

  const renderNormalTable = () => (
    <Table>
      <TableCaption>
        The type of waste collected monthly for {selectedYear}.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          {wasteTypes.map((type) => (
            <TableHead key={type}>{wasteTypeLabels[type]}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {monthlyData.map((row, index) => (
          <TableRow key={months[index]}>
            <TableCell className="font-medium">{months[index]}</TableCell>
            {wasteTypes.map((type) => (
              <TableCell key={type}>{row[type]}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell className="font-medium">Total</TableCell>
          {wasteTypes.map((type) => (
            <TableCell key={type}>{calculateTotal(type)}</TableCell>
          ))}
        </TableRow>
      </TableFooter>
    </Table>
  );

  const renderReversedTable = () => (
    <Table>
      <TableCaption>
        The type of waste collected monthly for {selectedYear}.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Waste Type</TableHead>
          {months.map((month) => (
            <TableHead key={month}>{month}</TableHead>
          ))}
          <TableHead>Total</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {wasteTypes.map((type) => (
          <TableRow key={type}>
            <TableCell className="font-medium">
              {wasteTypeLabels[type]}
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

  return (
    <Card>
      <CardHeader className="flex items-center gap-2 py-5 space-y-0 border-b sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle>Disposal History</CardTitle>
          <CardDescription>
            Biodegradable, Non-Biodegradable, Recyclable, and Hazardous
          </CardDescription>
        </div>
        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger
            className="w-[160px] rounded-lg sm:ml-auto"
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
        <Button onClick={toggleReverse} variant="outline" size="icon">
          <ArrowUpDown className="w-4 h-4" />
        </Button>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {isReversed ? renderReversedTable() : renderNormalTable()}
      </CardContent>
    </Card>
  );
}
