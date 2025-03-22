"use client";

import Numbers from "@/components/numbers";
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
} from "@/components/ui/chart";
import React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  views: {
    label: "Valor",
  },
  desktop: {
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export default function InvestComponent({ data }) {
  const valorAtual = React.useMemo(() => {
    return data.length > 0 ? data[data.length - 1].valor : 0;
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-4">
          <CardTitle>Investimentos</CardTitle>
          <CardDescription>Monitore seus investimentos</CardDescription>
        </div>
        <div className="flex">
          <div className="flex flex-1 flex-col justify-center gap-1 border-t py-4 text-left sm:border-t-0 sm:px-6 sm:py-6">
            <span className="text-muted-foreground text-xs">Valor Atual</span>
            <span className="text-lg leading-none sm:text-2xl">
              <Numbers value={valorAtual} />
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={data}
            margin={{
              left: 12,
              right: 12,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="data"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                const utcDate = new Date(
                  date.getUTCFullYear(),
                  date.getUTCMonth(),
                  date.getUTCDate(),
                );
                return utcDate.toLocaleDateString("pt-BR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    const utcDate = new Date(
                      date.getUTCFullYear(),
                      date.getUTCMonth(),
                      date.getUTCDate(),
                    );
                    return utcDate.toLocaleDateString("pt-BR", {
                      month: "long",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey="valor" fill={`var(--color-desktop)`} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
