import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import TransactionsTableSection from "./sections/table";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  return (
    <>
      <MonthPicker />
      <Suspense fallback={<TableSkeleton rows={10} />}>
        <TransactionsTableSection month={month} />
      </Suspense>
    </>
  );
}
