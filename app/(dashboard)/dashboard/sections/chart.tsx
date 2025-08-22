import Widget from "@/components/widget";
import { RiBarChartBoxLine } from "@remixicon/react";
import ChartSixMonths from "../chart-six-months";
import { buildPainelData } from "../utils";

export default async function ChartSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Receita, Despesa e Balanço"
      subtitle="Últimos 6 Meses"
      information="Apenas transações do usuário"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-fuchsia-400/10 p-1 text-fuchsia-500">
          <RiBarChartBoxLine className="size-4" />
        </span>
      }
    >
      <ChartSixMonths data={data.chart} />
    </Widget>
  );
}

