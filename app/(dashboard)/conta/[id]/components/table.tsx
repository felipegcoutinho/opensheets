import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getAccountInvoice } from "@/app/actions/transactions/fetch_transactions";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

export default async function AccountTableSection({ id, month }: { id: string; month: string }) {
  const [cards, categorias, contas, accountInvoice, budgetRule] = await Promise.all([
    getCards(),
    getCategorias(),
    getAccount(),
    getAccountInvoice(month, id),
    getBudgetRule(),
  ]);

  return (
    <TableTransaction
      data={accountInvoice ?? []}
      getAccount={contas ?? []}
      getCards={cards ?? []}
      getCategorias={categorias ?? []}
      hidden={true}
      budgetRule={budgetRule}
    />
  );
}
