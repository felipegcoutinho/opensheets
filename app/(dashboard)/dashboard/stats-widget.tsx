"use client";

import EmptyCard from "@/components/empty-card";
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
    color: "var(--primary, #10b981)",
  },
};

type StatsWidgetProps = {
  transactionsStats: number;
  billsStats: number;
  cardsStats: number;
  accountsStats: number;
  notesStats: number;
};

function StatsWidget({
  transactionsStats,
  billsStats,
  cardsStats,
  accountsStats,
  notesStats,
}: StatsWidgetProps) {
  const statsData = [
    { title: "Lançamentos", qtde: transactionsStats },
    { title: "Boletos", qtde: billsStats },
    { title: "Cartões", qtde: cardsStats },
    { title: "Contas", qtde: accountsStats },
    { title: "Anotações", qtde: notesStats },
  ];

  const chartData = statsData.map(({ title, qtde }) => ({
    label: title,
    qtde: qtde,
  }));

  if (!chartData) return <EmptyCard />;

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
