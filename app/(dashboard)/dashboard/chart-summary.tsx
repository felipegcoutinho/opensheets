"use client";

import { CardContent } from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

export function ChartSummary({ data }) {
  // Configuração do gráfico com cores consistentes
  const chartConfig = {
    incomes: {
      label: "Receita",
      color: "var(--chart-1, #10b981)", // Verde como fallback
    },
    expenses: {
      label: "Despesa",
      color: "var(--chart-2, #ef4444)", // Vermelho como fallback
    },
    balanco: {
      label: "Balanço",
      color: "var(--chart-3, #3b82f6)", // Azul como fallback
    },
  };

  // Formatador para valores monetários em BRL
  const formatCurrency = (value) => {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  return (
    <>
      <CardContent className="p-0">
        <ChartContainer className="my-8" config={chartConfig}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
          >
            <CartesianGrid vertical={true} strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tickLine={true}
              tickMargin={10}
              axisLine={true}
            />

            <ChartTooltip
              cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
              content={
                <ChartTooltipContent
                  valueFormatter={formatCurrency}
                  indicator="line"
                  className="w-52 p-2 shadow-md"
                />
              }
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="incomes"
              fill={chartConfig.incomes.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="expenses"
              fill={chartConfig.expenses.color}
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="balanco"
              fill={chartConfig.balanco.color}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </>
  );
}
