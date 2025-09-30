import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";
import { getCategoryTotals } from "@/app/actions/transactions/fetch_transactions";
import CardsBudgets from "../cards-budgets";

export default async function BudgetsSection({ month }: { month: string }) {
  const [budgets, categorias, totalsAll] = await Promise.all([
    getBudgets(month),
    getCategorias(),
    getCategoryTotals(month),
  ]);

  const totals = totalsAll.filter((t) => t.tipo_transacao === "despesa");

  return (
    <CardsBudgets budgets={budgets} categorias={categorias} totals={totals} />
  );
}
