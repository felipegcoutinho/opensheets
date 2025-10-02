import WidgetCard from "@/components/widget-card";
import { RiBarChartBoxLine } from "@remixicon/react";
import ChartSixMonths from "../chart-six-months";
import { buildPainelData } from "../utils";

export default async function ChartSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Receita, Despesa e Balanço"
      subtitle="Últimos 6 Meses"
      information="Apenas transações do usuário"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiBarChartBoxLine className="size-4" />
        </span>
      }
    >
      <ChartSixMonths data={data.chart} />
    </WidgetCard>
  );
}
