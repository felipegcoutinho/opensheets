import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getCardInvoice } from "@/app/actions/transactions/fetch_transactions";
import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";

export default async function CardTableSection({
  id,
  month,
}: {
  id: string;
  month: string;
}) {
  const [contas, categorias, cards, cardInvoice, budgetRule] = await Promise.all([
    getAccount(),
    getCategorias(),
    getCards(),
    getCardInvoice(month, id),
    getBudgetRule(),
  ]);

  return (
    <TableTransaction
      data={cardInvoice ?? []}
      getAccount={contas ?? []}
      getCards={cards ?? []}
      getCategorias={categorias ?? []}
      hidden={false}
      budgetRule={budgetRule}
    />
  );
}
