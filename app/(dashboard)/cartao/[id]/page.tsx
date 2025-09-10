import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import CardHeaderFallback from "@/components/fallbacks/card-header-fallback";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";
import CardHeaderSection from "./sections/header";
import CardTableSection from "./sections/table";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  return (
    <section>
      <MonthPicker />
      <Suspense fallback={<CardHeaderFallback /> }>
        <CardHeaderSection id={id} month={month} />
      </Suspense>

      <Suspense fallback={<TransactionTableFallback rows={10} /> }>
        <CardTableSection id={id} month={month} />
      </Suspense>
    </section>
  );
}
