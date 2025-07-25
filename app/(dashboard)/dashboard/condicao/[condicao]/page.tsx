import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactionsByConditions } from "@/app/actions/transactions/fetch_transactions";
import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMonth } from "@/hooks/get-month";

export default async function page({ params, searchParams }) {
  const month = await getMonth({ searchParams });
  const { condicao } = await params;

  const cartoes = await getCards();
  const contas = await getAccount();
  const categorias = await getCategorias();
  const transactions = await getTransactionsByConditions(condicao, month);

  const valorTotal = transactions.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="mb-4 space-y-6">
      <Card className="mt-4">
        <CardHeader>
          <CardTitle className="text-xl capitalize">{condicao}</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-3xl font-bold">
            <MoneyValues value={valorTotal} />
          </div>
          <div className="text-muted-foreground mt-2 text-sm">
            Valor total somando os lançamentos por condição
          </div>
        </CardContent>
      </Card>

      <TableTransaction
        data={transactions}
        getAccount={contas}
        getCards={cartoes}
        getCategorias={categorias}
        hidden={true}
      />
    </div>
  );
}
