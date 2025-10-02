import WidgetCard from "@/components/widget-card";
import { RiArrowDownLine } from "@remixicon/react";
import TopExpensesWidget from "../top-expenses-widget";
import { buildPainelData } from "../utils";

export default async function TopExpensesSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <WidgetCard
      title="Maiores Gastos do Mês"
      subtitle="Top 10 Despesas"
      information="Apenas transações do usuário"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiArrowDownLine className="size-4" />
        </span>
      }
    >
      <TopExpensesWidget transactions={data.topExpenses} />
    </WidgetCard>
  );
}
