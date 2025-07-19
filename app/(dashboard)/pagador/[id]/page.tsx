import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import { getLancamentostTeste } from "@/app/actions/transactions/fetch_transactions";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "../../lancamentos/table/table-transaction";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const teste = await getLancamentostTeste(id, month);

  // console.log("teste", teste);

  const cartoes = await getCards();
  const contas = await getAccount();
  const categorias = await getNewCategorias();

  return (
    <div>
      <TableTransaction
        data={teste}
        getAccount={contas}
        getCards={cartoes}
        getCategorias={categorias}
        hidden={true}
      />
    </div>
  );
}
