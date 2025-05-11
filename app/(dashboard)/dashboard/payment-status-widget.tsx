"use client";
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
  const pendingIncome = incomes - sumPaidIncome;
  const pendingExpense = expenses - sumPaidExpense;

  const receiveData = {
    title: "À Receber",
    total: incomes,
    values: [
      {
        amount: sumPaidIncome,
        label: "recebidos",
        color: "bg-green-400 dark:bg-green-600",
      },
      {
        amount: pendingIncome,
        label: "pendentes",
        color: "bg-green-100 dark:bg-green-300",
      },
    ],
  };

  const payData = {
    title: "À Pagar",
    total: expenses,
    values: [
      {
        amount: sumPaidExpense,
        label: "pagos",
        color: "bg-orange-400 dark:bg-orange-600",
      },
      {
        amount: pendingExpense,
        label: "pendentes",
        color: "bg-orange-100 dark:bg-orange-300",
      },
    ],
  };

  return (
    <>
      <PaymentSection {...receiveData} />

      <Separator className="my-3.5" />

      <PaymentSection {...payData} />
    </>
  );
}
