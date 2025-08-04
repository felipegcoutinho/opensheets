import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CreateBudget from "./modal/create-budget";
import TableBudgets from "./table-budgets";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const [budgets, categorias] = await Promise.all([
    getBudgets(month),
    getCategorias(),
  ]);

  return (
    <>
      <MonthPicker />
      <div className="my-2">
        <CreateBudget categorias={categorias} />
        <TableBudgets budgets={budgets} categorias={categorias} />
      </div>
    </>
  );
}
