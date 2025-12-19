"use client";

import { LabelList, Pie, PieChart } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/pie-chart";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface PerformanceData {
  excellent: number;
  good: number;
  average: number;
  below_average: number;
}

interface PerformancePieChartProps {
  data: PerformanceData;
  theme?: 'light' | 'dark';
}

const chartConfig = {
  funds: {
    label: "Funds",
  },
  excellent: {
    label: "Excellent (>25%)",
    color: "hsl(45, 93%, 47%)", // Amber-500
  },
  good: {
    label: "Good (15-25%)",
    color: "hsl(43, 96%, 56%)", // Amber-400
  },
  average: {
    label: "Average (10-15%)",
    color: "hsl(39, 85%, 59%)", // Amber-300
  },
  below_average: {
    label: "Below Average (≤10%)",
    color: "hsl(35, 77%, 49%)", // Amber-600
  },
} satisfies ChartConfig;

export default function PerformancePieChart({ data, theme = 'dark' }: PerformancePieChartProps) {
  const totalFunds = data.excellent + data.good + data.average + data.below_average;
  
  // Transform data for the chart
  const chartData = [
    { 
      category: "excellent", 
      funds: data.excellent, 
      fill: "hsl(45, 93%, 47%)",
      percentage: ((data.excellent / totalFunds) * 100).toFixed(1)
    },
    { 
      category: "good", 
      funds: data.good, 
      fill: "hsl(43, 96%, 56%)",
      percentage: ((data.good / totalFunds) * 100).toFixed(1)
    },
    { 
      category: "average", 
      funds: data.average, 
      fill: "hsl(39, 85%, 59%)",
      percentage: ((data.average / totalFunds) * 100).toFixed(1)
    },
    { 
      category: "below_average", 
      funds: data.below_average, 
      fill: "hsl(35, 77%, 49%)",
      percentage: ((data.below_average / totalFunds) * 100).toFixed(1)
    },
  ];

  const excellentPercentage = ((data.excellent / totalFunds) * 100).toFixed(1);
  
  // Determine trend based on excellent + good vs average + below_average
  const positivePerformance = data.excellent + data.good;
  const negativePerformance = data.average + data.below_average;
  const isPositiveTrend = positivePerformance > negativePerformance;
  const trendPercentage = (((positivePerformance - negativePerformance) / totalFunds) * 100).toFixed(1);

  return (
    <Card className={`flex flex-col ${theme === 'light' ? 'bg-white border-gray-200' : 'bg-slate-900/40 border-slate-800'}`}>
      <CardHeader className="items-center pb-0">
        <CardTitle className={`text-xs font-mono font-black uppercase tracking-widest ${
          theme === 'light' ? 'text-gray-600' : 'text-slate-400'
        }`}>
          Performance Stratification
          <Badge
            variant="outline"
            className={`ml-2 ${
              isPositiveTrend 
                ? 'text-green-500 bg-green-500/10 border-green-500/20' 
                : parseFloat(trendPercentage) === 0
                  ? 'text-amber-500 bg-amber-500/10 border-amber-500/20'
                  : 'text-red-500 bg-red-500/10 border-red-500/20'
            }`}
          >
            {isPositiveTrend ? (
              <TrendingUp className="h-3 w-3" />
            ) : parseFloat(trendPercentage) === 0 ? (
              <Minus className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            <span className="ml-1">{Math.abs(parseFloat(trendPercentage))}%</span>
          </Badge>
        </CardTitle>
        <CardDescription className={`text-xs font-mono uppercase tracking-widest ${
          theme === 'light' ? 'text-gray-500' : 'text-slate-500'
        }`}>
          Market Distribution • {totalFunds} Total Funds
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] [&_.recharts-text]:fill-background"
        >
          <PieChart>
            <ChartTooltip
              content={
                <ChartTooltipContent 
                  nameKey="funds" 
                  hideLabel 
                  formatter={(value: any, name: any, props: any) => [
                    `${value} funds (${props.payload.percentage}%)`,
                    chartConfig[name as keyof typeof chartConfig]?.label || name
                  ]}
                />
              }
            />
            <Pie
              data={chartData}
              dataKey="funds"
              nameKey="category"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              cornerRadius={8}
            >
              <LabelList
                dataKey="funds"
                className="fill-background"
                stroke="none"
                fontSize={12}
                fontWeight={600}
                formatter={(value: any) => (typeof value === 'number' && value > 0) ? value.toString() : ''}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        
        {/* Legend */}
        <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
          {chartData.map((item) => (
            <div key={item.category} className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-sm" 
                style={{ backgroundColor: item.fill }}
              />
              <span className={`font-mono uppercase tracking-wider ${
                theme === 'light' ? 'text-gray-600' : 'text-slate-400'
              }`}>
                {chartConfig[item.category as keyof typeof chartConfig]?.label}
              </span>
              <span className={`ml-auto font-mono font-bold ${
                theme === 'light' ? 'text-gray-800' : 'text-slate-200'
              }`}>
                {item.funds}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}