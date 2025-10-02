import WidgetCard from "@/components/widget-card";
import { RiBarcodeLine } from "@remixicon/react";
import BillsWidget from "../bills-widget";
import { buildPainelData } from "../utils";

export default async function BillsSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Boletos"
      subtitle="boletos deste mês"
      information="Resumo de boletos – apenas transações do usuário"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiBarcodeLine className="size-4" />
        </span>
      }
    >
      <BillsWidget month={data.month} data={data.bills} />
    </WidgetCard>
  );
}
