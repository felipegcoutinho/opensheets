import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactions } from "@/app/actions/transactions/fetch_transactions";
import { TableTransaction } from "../table/table-transaction";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

export default async function TransactionsTableSection({ month }: { month: string }) {
  const [cartoes, contas, lancamentos, categorias, budgetRule] =
    await Promise.all([
      getCards(),
      getAccount(),
      getTransactions(month),
      getCategorias(),
      getBudgetRule(),
    ]);

  return (
    <TableTransaction
      data={lancamentos}
      getAccount={contas}
      getCards={cartoes}
      getCategorias={categorias}
      budgetRule={budgetRule}
    />
  );
}
