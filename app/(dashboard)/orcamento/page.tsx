import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CreateBudget from "./modal/create-budget";
import BudgetsSection from "./sections/budgets";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";

export default async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });
  const categorias = await getCategorias();

  return (
    <>
      <MonthPicker />
      <div className="my-2">
        <CreateBudget categorias={categorias} />
        <BudgetsSection month={month} />
      </div>
    </>
  );
}
