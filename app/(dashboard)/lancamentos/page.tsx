import { getCards } from "@/app/services/cartoes";
import { getAccount } from "@/app/services/contas";
import { getTransactions } from "@/app/services/transacoes";
import { getPeriodo } from "@/hooks/periodo";
import { TableTransaction } from "./table/table-transaction";

export default async function page(props) {
  const month = await getPeriodo(props);

  const cartoes = await getCards(month);
  const contas = await getAccount();
  const lancamentos = await getTransactions(month);

  return (
    <TableTransaction
      data={lancamentos}
      getAccount={contas}
      getCards={cartoes}
    />
  );
}
