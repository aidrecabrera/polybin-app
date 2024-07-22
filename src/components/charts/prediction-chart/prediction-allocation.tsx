"use client"

import * as React from "react"
import { Label, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent
} from "@/components/ui/chart"
import { fetchPredictionLogFromSupabase } from "@/services/predictionLog"

interface ChartData {
  class: string;
  percentage: number;
  fill: string;
}

const chartConfig = {
  confidence: {
    label: "Confidence",
    color: "hsl(var(--chart-2))",
  },
} as const

export default function PredictionLogPieChart() {
  const [data, setData] = React.useState<ChartData[]>([])
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await fetchPredictionLogFromSupabase(0, 100)
      const processedData = (data as { class: string; confidence: number }[]).reduce<
        Record<string, { totalConfidence: number; count: number }>
      >((acc, item) => {
        if (!acc[item.class]) {
          acc[item.class] = { totalConfidence: 0, count: 0 }
        }
        acc[item.class].totalConfidence += item.confidence
        acc[item.class].count += 1
        return acc
      }, {})

      const totalConfidence = Object.values(processedData).reduce((acc, value) => acc + value.totalConfidence, 0)

      const chartData = Object.entries(processedData).map(([key, value]) => ({
        class: key,
        percentage: Math.round((value.totalConfidence / totalConfidence) * 100),
        fill: `hsl(var(--chart-${Math.floor(Math.random() * 5) + 1}))`, // Random color
      }))

      setData(chartData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  React.useEffect(() => {
    fetchData()
  }, [])

  const totalPercentage = React.useMemo(() => {
    return data.reduce((acc, curr) => acc + curr.percentage, 0)
  }, [data])

  return (
    <Card className="flex flex-col col-span-1 sm:col-span-2 lg:col-span-4">
      <CardHeader className="items-center pb-0">
        <CardTitle>Prediction Confidence Distribution</CardTitle>
        <CardDescription>Last 100 Predictions</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          {isLoading ? (
            <div className="flex justify-center items-center h-[200px]">
              Loading...
            </div>
          ) : error ? (
            <div className="flex justify-center items-center h-[200px] text-red-500">
              {error}
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent />}
                  formatter={(value, name) => [
                    `${value}% `,
                    name.toString().charAt(0).toUpperCase() + name.toString().slice(1),
                  ]}
                />
                <Pie
                  data={data}
                  dataKey="percentage"
                  nameKey="class"
                  innerRadius={60}
                  strokeWidth={5}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="text-3xl font-bold fill-foreground"
                            >
                              {totalPercentage}%
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              Total Confidence
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Showing percentage confidence distribution for the last 100 predictions
        </div>
      </CardFooter>
    </Card>
  )
}
