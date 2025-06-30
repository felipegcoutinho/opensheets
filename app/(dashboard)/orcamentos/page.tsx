import { getBudgets } from "@/app/actions/orcamentos/getBudgets";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import CreateBudget from "./modal/create-budget";
import TableBudgets from "./table-budgets";

export default async function page() {
  const [budgets, categorias] = await Promise.all([
    getBudgets(),
    getNewCategorias(),
  ]);

  return (
    <div className="my-4">
      <CreateBudget categorias={categorias} />
      <TableBudgets budgets={budgets} categorias={categorias} />
    </div>
  );
}
