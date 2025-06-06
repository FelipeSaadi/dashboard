
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

export const description = "An interactive bar chart"

const chartData = [
  { time: "6 min ago", desktop: 3008 },
  { time: "5 min ago", desktop: 2991 },
  { time: "4 min ago", desktop: 2996 },
  { time: "3 min ago", desktop: 3000 },
  { time: "2 min ago", desktop: 3002 },
  { time: "1 min ago", desktop: 2998 },
]

const chartConfig = {
  desktop: {
    label: "Transcations per Second",
    color: "#3CDFEF99",
  },
} satisfies ChartConfig

export const TpsChart = () => {
  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="max-h-[280px] w-full">
        <BarChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
            bottom: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="time"
            tick={{ stroke: 'white', fontWeight: 'normal' }}
            tickMargin={24}

            tickFormatter={(value) => value}
          />
          <YAxis
            tickMargin={16}
            tick={{ stroke: 'white', fontWeight: 200 }}
            domain={[0, 3200]}
          />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent className="w-[175px]" indicator="dot" hideLabel />}
          />
          <Bar
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}
            stroke="var(--color-desktop)"
          />
          <ChartLegend className="mt-4 mb-2 text-zinc-300" content={<ChartLegendContent />} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
