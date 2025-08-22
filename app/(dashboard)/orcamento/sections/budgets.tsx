import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";
import TableBudgets from "../table-budgets";

export default async function BudgetsSection({ month }: { month: string }) {
  const [budgets, categorias] = await Promise.all([
    getBudgets(month),
    getCategorias(),
  ]);

  return <TableBudgets budgets={budgets} categorias={categorias} />;
}
