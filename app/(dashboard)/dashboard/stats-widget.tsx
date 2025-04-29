"use client";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  stats: {
    label: "Quantidade",
    color: "var(--chart-3, #10b981)",
  },
};

function StatsWidget({ statsConfig }) {
  const chartData = statsConfig.map(({ title, value }) => ({
    label: title,
    value: value,
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
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="value" fill="var(--color-stats)" radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}

export default StatsWidget;
