import { Card } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { valueShort } from "@/utils/value-short"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useState } from 'react';

interface DataPoint {
  date?: string
  timestamp?: number
  [key: string]: any
  currentState?: boolean
}

interface DataSeries {
  key: string
  label: string
  color: string
  formatter?: (value: number) => string
  yAxisId?: 'left' | 'right'
}

interface AreaChartProps {
  data: DataPoint[]
  dataSeries: DataSeries[]
  className?: string
  title?: string
  description?: string
  periods?: {
    value: string
    label: string
  }[]
  defaultPeriod?: string
  autoAdjustDomain?: boolean
  domainPadding?: number
  dateFormat?: (timestamp: number) => string
}

const defaultFormatter = (value: number) => {
  return new Intl.NumberFormat("en-US").format(value)
}

const defaultDateFormat = (timestamp: number) => {
  return new Date(timestamp * 1000).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}

const getSmartDateFormat = (timestamp: number, period?: string) => {
  const date = new Date(timestamp * 1000);
  
  switch(period) {
    case '1H':
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '24H':
      return date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' });
    case '7D':
      return date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
    case '30D':
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    default:
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
};

export const ByTimeChart = ({
  data,
  dataSeries,
  className,
  title,
  description,
  periods,
  defaultPeriod = "24H",
  autoAdjustDomain = true,
  domainPadding = 0.1,
  dateFormat = defaultDateFormat
}: AreaChartProps) => {
  const domains: Record<string, [number, number]> = {};
  const [currentPeriod, setCurrentPeriod] = useState(defaultPeriod);

  const processedData = data.map(point => {
    const newPoint = { ...point };
    
    if (!newPoint.date && newPoint.timestamp) {
      newPoint.date = getSmartDateFormat(newPoint.timestamp, currentPeriod);
    }
    
    return newPoint;
  });

  if (autoAdjustDomain && processedData.length > 0) {
    dataSeries.forEach(series => {
      const yAxisId = series.yAxisId || "left";
      if (!domains[yAxisId]) {
        let min = Infinity;
        let max = -Infinity;

        processedData.forEach(point => {
          const value = Number(point[series.key]);
          if (!isNaN(value)) {
            min = Math.min(min, value);
            max = Math.max(max, value);
          }
        });

        if (min !== Infinity && max !== -Infinity) {
          const range = max - min;
          const padding = range === 0 ? max * domainPadding : range * domainPadding;
          domains[yAxisId] = [
            Math.max(0, min - padding),
            max + padding
          ];
        }
      }
    });
  }

  return (
    <Card className={`${className} border-[#1a2657]`}>
      <div className="p-6 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-0">
          <div>
            {title && <h3 className="text-lg font-medium text-gray-200">{title}</h3>}
            {description && <p className="text-sm text-gray-400">
              {description}
            </p>}
          </div>
          {periods && (
            <Tabs 
              defaultValue={defaultPeriod} 
              className="w-full sm:w-auto sm:mx-8"
              onValueChange={setCurrentPeriod}
            >
              <TabsList className="w-full sm:w-auto bg-[#3ce0ef32]">
                {periods.map((period) => (
                  <TabsTrigger
                    key={period.value}
                    value={period.value}
                    className="text-gray-400 flex-1 sm:flex-none data-[state=active]:bg-[#3CDFEF99] data-[state=active]:text-white"
                  >
                    {period.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
        <div className="h-[250px] sm:h-[300px] mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={processedData}
              margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
            >
              <defs>
                {dataSeries.map((series) => (
                  <linearGradient
                    key={`color${series.key}`}
                    id={`color${series.key}`}
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor={series.color} stopOpacity={0.15} />
                    <stop offset="95%" stopColor={series.color} stopOpacity={0.01} />
                  </linearGradient>
                ))}
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                horizontal={true}
                vertical={false}
                stroke="#1a2657"
              />
              <XAxis
                dataKey="date"
                stroke="#d2d2d2"
                fontSize={10}
                tickMargin={10}
                tickLine={false}
                axisLine={false}
                minTickGap={20}
                angle={-30}
                textAnchor="end"
                height={60}
                tick={(props) => {
                  const { x, y, payload } = props;
                  let formattedDate = payload.value;

                  if (typeof payload.value === 'number') {
                    const timestamp = payload.value > 9999999999 
                      ? payload.value 
                      : payload.value * 1000; 
                    formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                    }).replace(',', '');
                  } 
                  else if (typeof payload.value === 'string') {
                    try {
                      const date = new Date(payload.value);
                      if (!isNaN(date.getTime())) {
                        formattedDate = date.toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                        }).replace(',', '');
                      }
                    } catch (e) {
                      console.warn('Failed to parse date:', payload.value);
                    }
                  }
                  
                  return (
                    <g transform={`translate(${x},${y})`}>
                      <text
                        x={0}
                        y={0}
                        dy={16}
                        textAnchor="end"
                        fill="#d2d2d2"
                        transform="rotate(-30)"
                        fontSize={10}
                      >
                        {formattedDate}
                      </text>
                    </g>
                  );
                }}
              />
              <YAxis
                yAxisId="left"
                stroke="#d2d2d2"
                tickMargin={8}
                fontSize={10}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => valueShort(value)}
                domain={domains["left"] || ["auto", "auto"]}
                width={35}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                stroke="#d2d2d2"
                tickMargin={10}
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
                domain={domains["right"] || ["auto", "auto"]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as DataPoint
                    return (
                      <div className="rounded-lg border border-[#1a2657] bg-[#3CDFEF99] p-2 shadow-xl max-w-[200px] sm:max-w-none">
                        <div className="grid gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-gray-300">
                              Time
                            </span>
                            <span className="font-bold text-gray-300 text-xs sm:text-sm break-all">
                              {dataPoint.date}
                            </span>
                          </div>
                          {dataSeries.map((series) => (
                            <div key={series.key} className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-gray-300">
                                {series.label}
                              </span>
                              <span className="font-bold text-gray-300 text-xs sm:text-sm">
                                {(series.formatter || defaultFormatter)(dataPoint[series.key] as number)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  }
                  return null
                }}
              />
              {dataSeries.map((series) => (
                <Area
                  key={series.key}
                  type="monotone"
                  dataKey={series.key}
                  stroke={series.color}
                  strokeWidth={2}
                  fillOpacity={1}
                  fill={`url(#color${series.key})`}
                  yAxisId={series.yAxisId || "left"}
                />
              ))}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-400">
          {dataSeries.map((series) => (
            <div key={series.key} className="flex items-center gap-2">
              <span className="h-2 w-2 sm:h-3 sm:w-3 rounded-full" style={{ backgroundColor: series.color }} />
              <span>{series.label}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}