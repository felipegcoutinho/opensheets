"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";
import { getConditions } from "../actions/dashboards";

export function Component({ month }) {
  const [condicoes, setCondicoes] = useState([]);

  useEffect(() => {
    async function fetchConditions() {
      const data = await getConditions(month);
      setCondicoes(data || []);
    }
    fetchConditions();
  }, [month]);

  const chartData = condicoes.reduce(
    (acc, item) => {
      acc[item.condicao] = item.sum;
      return acc;
    },
    { month }
  );

  const chartConfig = {
    Parcelado: {
      label: "Parcelado",
      color: "hsl(var(--chart-5))",
    },
    Recorrente: {
      label: "Recorrente",
      color: "hsl(var(--chart-2))",
    },
    Vista: {
      label: "Vista",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig;

  const totalVisitors = condicoes.reduce((sum, item) => sum + item.sum, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>Radial Chart - Stacked</CardTitle>
        <CardDescription>{month}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-1 items-center pb-0">
        {condicoes.length > 0 ? (
          <ChartContainer config={chartConfig} className="mx-auto aspect-square w-full max-w-[250px]">
            <RadialBarChart data={[chartData]} endAngle={180} innerRadius={80} outerRadius={130}>
              <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) - 16} className="fill-foreground text-2xl font-bold">
                            {totalVisitors.toLocaleString()}
                          </tspan>
                          <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 4} className="fill-muted-foreground">
                            Visitors
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </PolarRadiusAxis>
              {Object.keys(chartConfig).map((key) => (
                <RadialBar
                  key={key}
                  dataKey={key}
                  stackId="a"
                  cornerRadius={5}
                  fill={chartConfig[key].color}
                  className="stroke-transparent stroke-2"
                />
              ))}
            </RadialBarChart>
          </ChartContainer>
        ) : (
          <div>Carregando gráfico...</div>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing total visitors for the last 6 months</div>
      </CardFooter>
    </Card>
  );
}
