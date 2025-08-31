"use client";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";

type DataPoint = { month: string; total: number };

export default function LastSixChart({ data }: { data: DataPoint[] }) {
  const chartConfig = {
    total: { label: "Total", color: "var(--chart-3)" },
  } as const;

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  if (!data || data.length === 0) return null;

  return (
    <CardContent className="p-0">
      <ChartContainer
        className="my-1"
        style={{ height: 120, aspectRatio: "auto" }}
        config={chartConfig as any}
      >
        <BarChart data={data} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
          <CartesianGrid vertical={false} strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={4}
          />

          <ChartTooltip
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
            content={<ChartTooltipContent indicator="line" className="p-2" />}
          />
          {/* legenda removida para reduzir altura */}

          <Bar
            dataKey="total"
            fill={chartConfig.total.color}
            radius={[4, 4, 0, 0]}
            isAnimationActive={false}
          >
            <LabelList
              dataKey="total"
              position="top"
              formatter={(v: number) => formatCurrency(Number(v))}
              className="fill-foreground text-[10px]"
            />
          </Bar>
        </BarChart>
      </ChartContainer>
    </CardContent>
  );
}
