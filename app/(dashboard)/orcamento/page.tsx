import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CreateBudget from "./modal/create-budget";
import BudgetsSection from "./sections/budgets";
import { Suspense } from "react";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);
  const categorias = await getCategorias();

  return (
    <>
      <MonthPicker />
      <div className="my-2">
        <Suspense fallback={<div className="h-10 w-64 animate-pulse rounded bg-accent" /> } >
          <CreateBudget categorias={categorias} />
        </Suspense>
        <Suspense fallback={<TableSkeleton rows={8} /> } >
          <BudgetsSection month={month} />
        </Suspense>
      </div>
    </>
  );
}
