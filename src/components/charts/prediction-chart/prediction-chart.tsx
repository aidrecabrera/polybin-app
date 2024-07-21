"use client"

import { useEffect, useState } from "react"
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltipContent
} from "@/components/ui/chart"
import { fetchPredictionLogFromSupabase } from "@/services/predictionLog"

export default function PredictionLogChart() {
  const [data, setData] = useState<{ date: string; confidence: number }[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = async () => {
    setIsLoading(true)
    setError(null)
    try {
      const { data } = await fetchPredictionLogFromSupabase(0, 100)
      const processedData = (data as { created_at: string; confidence: number }[]).map(
        (item) => ({
          date: item.created_at.split("T")[0],
          confidence: Number((item.confidence * 100).toFixed(2)),
        })
      )

      setData(processedData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <Card className="w-full h-full col-span-1 sm:col-span-2 lg:col-span-2">
      <CardHeader className="pb-0 space-y-0">
        <CardDescription>Prediction Confidence</CardDescription>
        <CardTitle className="flex items-baseline gap-1 text-4xl tabular-nums">
          {data.length > 0 ? (
            (data.reduce((sum, item) => sum + item.confidence, 0) / data.length).toFixed(2)
          ) : (
            "--"
          )}
          <span className="font-sans text-sm font-normal tracking-normal text-muted-foreground">
            %
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ChartContainer
          config={{
            confidence: {
              label: "Confidence",
              color: "hsl(var(--chart-2))",
            },
          }}
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
            <ResponsiveContainer width="100%" height={100}>
              <AreaChart
                accessibilityLayer
                data={data}
                margin={{
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0,
                }}
              >
                <XAxis dataKey="date" hide />
                <YAxis domain={["dataMin - 5", "dataMax + 2"]} hide />
                <defs>
                  <linearGradient id="fillConfidence" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-confidence)"
                      stopOpacity={1}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-confidence)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="confidence"
                  type="natural"
                  fill="url(#fillConfidence)"
                  fillOpacity={0.4}
                  stroke="var(--color-confidence)"
                />
                <Tooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                  formatter={(value) => (
                    <div className="flex min-w-[120px] items-center text-xs text-muted-foreground">
                      Confidence
                      <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                        {value}
                        <span className="font-normal text-muted-foreground">
                          %
                        </span>
                      </div>
                    </div>
                  )}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
