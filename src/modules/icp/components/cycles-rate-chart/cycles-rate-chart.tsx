"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import styles from './cycles-rate-chart-styles.module.scss'

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { valueShort } from "@/utils/value-short"

type Data = {
  "cycles": number,
}[]

type Props = {
  title: string
  legend: string
  data: Data
  key: string
  range?: number[]
}

export const CyclesRateChart: React.FC<Props> = ({ title, data }: Props) => {

  const chartConfig = {
    "cycles": {
      label: 'Cycles Burn Rate',
      color: "#3CDFEF99",
    },
    // "net_stack": {
    //   label: 'net_stack',
    //   color: "#3CDFEF99",
    // },
  } satisfies ChartConfig

  return (
    <div className={`${styles.chart} w-full px-10 bg-zinc-900 rounded-[12px]`}>
      <h2 className="pt-4 pb-8 text-zinc-100 font-medium">{title}</h2>
      <ChartContainer config={chartConfig} className="max-h-[320px] w-full">
        <AreaChart
          data={data}
          accessibilityLayer
          margin={{
            left: 0,
            right: 12,
            bottom: 12
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="legend"
            tick={{ fontSize: 12, stroke: '#d2d2d2', fontWeight: 'normal' }}
            tickMargin={24}

            tickLine={false}
            axisLine={false}
          // tickFormatter={(value) => value.slice(0, 3)}
          />
          <YAxis
            tickMargin={12}
            tick={{ stroke: 'white', fontWeight: 200 }}
            tickFormatter={(value) => valueShort(value)}
            domain={[764000, 881000]}
          />

          {/* <Bar
            dataKey="desktop"
            type="natural"
            fill="var(--color-desktop)"
            fillOpacity={0.4}

            stroke="var(--color-desktop)"
            radius={[2, 2, 0, 0]}
          /> */}

          <Area
            dataKey="cycles"
            type="natural"
            fill="var(--color-cycles)"
            fillOpacity={0.4}
            stroke="#3CDFEF99"
          // stackId="c"
          />
          {/* <Area
            dataKey="net_stack"
            type="natural"
            fill="var(--color-net_stack)"
            fillOpacity={0}
            stroke="var(--color-net_stack)"
            stackId="a"
          /> */}
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent className="w-[175px]" indicator="dot" hideLabel />}
          />

          {/* <ChartLegend className="mt-4 mb-2 text-zinc-300" content={<ChartLegendContent  />} /> */}
          <ChartLegend content={<ChartLegendContent />} />
        </AreaChart>
      </ChartContainer>
    </div>
  )
}
