"use client";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const chartConfig = {
  stats: {
    label: "Quantidade",
    color: "var(--chart-3, #10b981)",
  },
};

function StatsWidget({ statsConfig }) {
  const chartData = statsConfig.map(({ title, qtde }) => ({
    label: title,
    qtde: qtde,
  }));

  return (
    <>
      <CardContent className="p-0">
        <ChartContainer config={chartConfig} className="max-h-80">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="label"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(qtde) => qtde}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="qtde" fill="var(--color-stats)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}

export default StatsWidget;
