import Widget from "@/components/widget";
import { RiWalletLine } from "@remixicon/react";
import PaymentStatusWidget from "../payment-status-widget";
import { buildPainelData } from "../utils";

export default async function StatusSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Status de Pagamento"
      subtitle="Valores confirmados e pendentes"
      information="Apenas transações do usuário"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiWalletLine className="size-4" />
        </span>
      }
    >
      <PaymentStatusWidget
        expenses={data.expenses}
        incomes={data.incomes}
        sumPaidExpense={data.sumPaidExpense}
        sumPaidIncome={data.sumPaidIncome}
      />
    </Widget>
  );
}
