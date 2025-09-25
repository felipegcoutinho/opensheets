import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

export default async function PayerTableSection({ id, month }: { id: string; month: string }) {
  const [contas, categorias, cards, transactions, budgetRule] = await Promise.all([
    getAccount(),
    getCategorias(),
    getCards(),
    getTransactionsByPayer(month, id),
    getBudgetRule(),
  ]);

  const list = Array.isArray(transactions) ? transactions : [];

  return (
    <TableTransaction
      data={list}
      getAccount={contas}
      getCards={cards}
      getCategorias={categorias}
      hidden={false}
      budgetRule={budgetRule}
    />
  );
}
