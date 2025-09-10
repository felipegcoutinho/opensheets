import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getAccountInvoice } from "@/app/actions/transactions/fetch_transactions";

export default async function AccountTableSection({ id, month }: { id: string; month: string }) {
  const [cards, categorias, contas, accountInvoice] = await Promise.all([
    getCards(),
    getCategorias(),
    getAccount(),
    getAccountInvoice(month, Number(id)),
  ]);

  return (
    <TableTransaction
      data={accountInvoice ?? []}
      getAccount={contas ?? []}
      getCards={cards ?? []}
      getCategorias={categorias ?? []}
      hidden={true}
    />
  );
}
