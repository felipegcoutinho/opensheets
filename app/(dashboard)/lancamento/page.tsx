import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";
import TransactionsTableSection from "./sections/table";

export default async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });

  return (
    <>
      <MonthPicker />
      <Suspense fallback={<TransactionTableFallback rows={10} />}>
        <TransactionsTableSection month={month} />
      </Suspense>
    </>
  );
}
