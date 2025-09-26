import Widget from "@/components/widget";
import { RiBarcodeLine } from "@remixicon/react";
import BillsWidget from "../bills-widget";
import { buildPainelData } from "../utils";

export default async function BillsSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Boletos"
      subtitle="boletos deste mês"
      information="Resumo de boletos – apenas transações do usuário"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiBarcodeLine className="size-4" />
        </span>
      }
    >
      <BillsWidget month={data.month} data={data.bills} />
    </Widget>
  );
}
