import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";
import { getMonth } from "@/hooks/get-month";
import CreateBudget from "./modal/create-budget";
import TableBudgets from "./table-budgets";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const [budgets, categorias] = await Promise.all([
    getBudgets(month),
    getNewCategorias(),
  ]);

  return (
    <div className="my-4">
      <CreateBudget categorias={categorias} />
      <TableBudgets budgets={budgets} categorias={categorias} />
    </div>
  );
}
