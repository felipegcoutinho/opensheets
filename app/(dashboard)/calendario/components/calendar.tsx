import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactionsForCalendar } from "@/app/actions/transactions/fetch_transactions";
import MonthCalendar from "@/components/calendar/month-calendar";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

export default async function CalendarSection({ month }: { month: string }) {
  const [lancamentos, cartoes, contas, categorias, budgetRule] =
    await Promise.all([
      getTransactionsForCalendar(month),
      getCards(),
      getAccount(),
      getCategorias(),
      getBudgetRule(),
    ]);

  return (
    <MonthCalendar
      month={month}
      lancamentos={lancamentos as any[]}
      getCards={cartoes as any[]}
      getAccount={contas as any[]}
      getCategorias={categorias as any[]}
      budgetRule={budgetRule}
    />
  );
}
