import { getCards } from "@/app/services/cartoes";
import { getNewCategorias } from "@/app/services/categorias";
import { getAccount } from "@/app/services/contas";
import { getTransactions } from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "./table/table-transaction";

export default async function page(props: { params: { month: string } }) {
  const month = getMonth(props);

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
