import { TableTransaction } from "@/app/(dashboard)/lancamentos/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getCategoria } from "@/app/actions/transactions/fetch_transactions";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonth } from "@/hooks/get-month";

export default async function page(props: {
  params: { month: string; categoria: string; tipo_transacao: string };
}) {
  const params = await props.params;
  const month = await getMonth(props);

  const cartoes = await getCards();
  const contas = await getAccount();
  const categorias = await getCategorias();

  const categoriaId = decodeURIComponent(params.id);
  const categoria = decodeURIComponent(params.categoria);
  const tipoTransacao = decodeURIComponent(params.tipo_transacao);

  const transacoes = await getCategoria(month, categoria, tipoTransacao);

  const totalTransacoes =
    transacoes?.reduce((acc, item) => acc + item.valor, 0) || 0;

  return (
    <div className="mb-4 space-y-6">
      <Card className="mt-4">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle className="text-xl capitalize">{categoria}</CardTitle>

            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm">
              <Badge
                variant={tipoTransacao === "receita" ? "receita" : "despesa"}
              >
                {tipoTransacao}
              </Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            <MoneyValues value={totalTransacoes} />
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            Valor total somando os lançamentos por categoria
          </div>
        </CardContent>
      </Card>

      <TableTransaction
        data={transacoes}
        getAccount={contas}
        getCards={cartoes}
        getCategorias={categorias}
        hidden={false}
      />
    </div>
  );
}
