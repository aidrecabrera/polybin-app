import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import * as React from "react"
// @ts-ignore
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

interface DatePickerWithRangeProps extends React.HTMLAttributes<HTMLDivElement> {
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

export function DatePickerWithRange({
  className,
  setStartDate,
  setEndDate,
}: DatePickerWithRangeProps) {
  const currentDate = new Date();
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
    to: addDays(new Date(currentDate.getFullYear(), currentDate.getMonth(), 1), 20),
  })

  React.useEffect(() => {
    if (date?.from) setStartDate(date.from);
    if (date?.to) setEndDate(date.to);
  }, [date, setStartDate, setEndDate]);

  return (
    <div className={cn("grid gap-2 w-auto", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "lg:w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="w-4 h-4 mr-2" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}