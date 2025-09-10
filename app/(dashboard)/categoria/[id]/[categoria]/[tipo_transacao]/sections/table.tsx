import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getCategoria } from "@/app/actions/transactions/fetch_transactions";

export default async function CategoryTableSection({
  month,
  categoria,
  tipo_transacao,
}: {
  month: string;
  categoria: string;
  tipo_transacao: string;
}) {
  const [cartoes, contas, categorias, transacoes] = await Promise.all([
    getCards(),
    getAccount(),
    getCategorias(),
    getCategoria(month, categoria, tipo_transacao),
  ]);

  return (
    <TableTransaction
      data={transacoes ?? []}
      getAccount={contas ?? []}
      getCards={cartoes ?? []}
      getCategorias={categorias ?? []}
      hidden={false}
    />
  );
}
