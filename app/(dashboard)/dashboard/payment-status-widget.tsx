"use client";
import EmptyCard from "@/components/empty-card";
import { PaymentSection } from "./payment-section";

type PaymentStatusWidgetProps = {
  expenses: number;
  incomes: number;
  sumPaidExpense: number;
  sumPaidIncome: number;
};

export default function PaymentStatusWidget({
  expenses,
  incomes,
  sumPaidExpense,
  sumPaidIncome,
}: PaymentStatusWidgetProps) {
  if (!expenses && !incomes) return <EmptyCard />;

  const pendingIncome = incomes - sumPaidIncome;
  const pendingExpense = expenses - sumPaidExpense;

  const receiveData = {
    title: "A Receber",
    total: incomes,
    values: [
      {
        amount: sumPaidIncome,
        label: "confirmados",
        color: "bg-chart-1 ",
      },
      {
        amount: pendingIncome,
        label: "pendentes",
        color: "bg-zinc-200 dark:bg-zinc-200",
      },
    ],
  };

  const payData = {
    title: "A Pagar",
    total: expenses,
    values: [
      {
        amount: sumPaidExpense,
        label: "confirmados",
        color: "bg-chart-2",
      },
      {
        amount: pendingExpense,
        label: "pendentes",
        color: "bg-zinc-200 dark:bg-zinc-200",
      },
    ],
  };

  return (
    <>
      {incomes > 0 && <PaymentSection {...receiveData} />}

      {incomes > 0 && expenses > 0 && (
        <div className="my-6 border-b border-dashed"></div>
      )}

      {expenses > 0 && <PaymentSection {...payData} />}
    </>
  );
}
