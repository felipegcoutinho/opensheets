import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
import { getTransactionsByConditions } from "@/app/services/transacoes";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getMonth } from "@/hooks/get-month";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";

async function page({ params, searchParams }) {
  const { DateFormat } = UseDates();
  const { getButtonVariant, getResponsavelClass, getConditionIcon } =
    UseStyles();

  const month = await getMonth({ searchParams });
  const { condicao } = await params;

  const transactions = await getTransactionsByConditions(condicao, month);

  const valorTotal = transactions.reduce((acc, item) => acc + item.valor, 0);

  return (
    <div className="mb-4 space-y-6">
      {/* Cabeçalho */}
      <div className="mt-4 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Condição
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant="outline" className="capitalize">
              {condicao}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-muted-foreground text-sm font-medium">
              Valor Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl">
              <MoneyValues value={valorTotal} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela */}
      <Card>
        <CardHeader>
          <CardTitle>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Transação</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Condição</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Responsável</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <span className="text-muted-foreground">
                      {DateFormat(item.data_compra)}
                    </span>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-bold capitalize">
                        {item.descricao}
                      </span>
                      {item.condicao === "parcelado" && (
                        <span className="text-muted-foreground text-xs">
                          {item.parcela_atual} de {item.qtde_parcela}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <Button
                      size="sm"
                      variant={getButtonVariant(item.tipo_transacao)}
                    >
                      {item.tipo_transacao}
                    </Button>
                  </TableCell>

                  <TableCell>
                    <MoneyValues value={item.valor} />
                  </TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1">
                      {getConditionIcon(item.condicao)}
                      <span>{item.condicao}</span>
                    </span>
                  </TableCell>

                  <TableCell>{item.forma_pagamento}</TableCell>

                  <TableCell>
                    <span
                      className={`${getResponsavelClass(item.responsavel)}`}
                    >
                      {item.responsavel}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DetailsTransactions
                      itemId={item.id}
                      itemPeriodo={item.periodo}
                      itemNotas={item.anotacao}
                      itemDate={item.data_compra}
                      itemDescricao={item.descricao}
                      itemCategoriaId={item.categorias?.nome}
                      itemCondicao={item.condicao}
                      itemResponsavel={item.responsavel}
                      itemTipoTransacao={item.tipo_transacao}
                      itemValor={item.valor}
                      itemFormaPagamento={item.forma_pagamento}
                      itemQtdeParcelas={item.qtde_parcela}
                      itemParcelaAtual={item.parcela_atual}
                      itemQtdeRecorrencia={item.qtde_recorrencia}
                      itemCartao={item.cartoes?.descricao}
                      itemPaid={item.realizado}
                      itemConta={item.contas?.descricao}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

export default page;
