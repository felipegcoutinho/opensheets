import WidgetCard from "@/components/widget-card";
import { RiBarChartBoxLine } from "@remixicon/react";
import AccountWidget from "../accounts-widget";
import { buildPainelData } from "../utils";

export default async function AccountsSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Minhas Contas"
      subtitle="Contas e Saldos"
      information="Resumo de contas e saldos – apenas contas do usuário"
      saldo_information="Saldo geral é a soma de todas as contas"
      saldo={data.saldo}
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiBarChartBoxLine className="size-4" />
        </span>
      }
    >
      <AccountWidget
        month={data.month}
        data={data.account}
        previstoAnterior={data.previstoAnterior}
      />
    </WidgetCard>
  );
}
