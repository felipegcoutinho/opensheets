"use client";
import EmptyCard from "@/components/empty-card";
import { Separator } from "@/components/ui/separator";
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
        color: "bg-primary ",
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
        color: "bg-orange-400 dark:bg-orange-600",
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
      <PaymentSection {...receiveData} />

      <Separator className="my-6" />

      <PaymentSection {...payData} />
    </>
  );
}
