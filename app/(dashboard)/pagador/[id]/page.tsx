import { getCards } from "@/app/services/cartoes";
import { getNewCategorias } from "@/app/services/categorias";
import { getAccount } from "@/app/services/contas";
import { getLancamentostTeste } from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "../../lancamentos/table/table-transaction";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const teste = await getLancamentostTeste(id, month);

  console.log("teste", teste);

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
