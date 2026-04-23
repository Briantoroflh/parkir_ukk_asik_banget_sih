"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

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
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

interface ChartLineTrackingProps {
  title: string
  description: string
  data: Record<string, unknown>[]
  config: ChartConfig
  dataKey: string
  xAxisKey?: string
  xAxisFormatter?: (value: unknown) => string
  footerTrend?: string
  footerDescription?: string
  showTrendIcon?: boolean
  showFooter?: boolean
}

export function ChartLineTracking({
  title,
  description,
  data,
  config,
  dataKey,
  xAxisKey = "month",
  xAxisFormatter = (value) => String(value).slice(0, 3),
  footerTrend,
  footerDescription,
  showTrendIcon = true,
  showFooter = true,
}: ChartLineTrackingProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-[250px] w-full">
          <LineChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={xAxisKey}
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={xAxisFormatter}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Line
              dataKey={dataKey}
              type="natural"
              stroke={`var(--color-${dataKey})`}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
      {showFooter && (footerTrend || footerDescription) && (
        <CardFooter className="flex-col items-start gap-2 text-sm">
          {footerTrend && (
            <div className="flex gap-2 leading-none font-medium">
              {footerTrend}
              {showTrendIcon && <TrendingUp className="h-4 w-4" />}
            </div>
          )}
          {footerDescription && (
            <div className="leading-none text-muted-foreground">
              {footerDescription}
            </div>
          )}
        </CardFooter>
      )}
    </Card>
  )
}

// // Export component untuk kompatibilitas backward compatibility
// export function ChartLineDefault() {
//   const chartData = [
//     { month: "January", desktop: 186 },
//     { month: "February", desktop: 305 },
//     { month: "March", desktop: 237 },
//     { month: "April", desktop: 73 },
//     { month: "May", desktop: 209 },
//     { month: "June", desktop: 214 },
//   ]

//   const chartConfig = {
//     desktop: {
//       label: "Desktop",
//       color: "var(--chart-1)",
//     },
//   } satisfies ChartConfig

//   return (
//     <ChartLineTracking
//       title="Line Chart"
//       description="January - June 2024"
//       data={chartData}
//       config={chartConfig}
//       dataKey="desktop"
//       xAxisKey="month"
//       footerTrend="Trending up by 5.2% this month"
//       footerDescription="Showing total visitors for the last 6 months"
//     />
//   )
// }
