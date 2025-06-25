import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactions } from "@/app/actions/transactions/fetch_transactions";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "./table/table-transaction";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const cartoes = await getCards();
  const contas = await getAccount();
  const lancamentos = await getTransactions(month);
  const getCategorias = await getNewCategorias();

  return (
    <TableTransaction
      data={lancamentos}
      getAccount={contas}
      getCards={cartoes}
      getCategorias={getCategorias}
    />
  );
}
