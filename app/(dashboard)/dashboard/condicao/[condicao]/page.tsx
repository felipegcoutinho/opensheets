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
import { getPeriodo } from "@/hooks/periodo";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import {
  ArrowLeftIcon,
  CalendarClockIcon,
  Check,
  RefreshCw,
} from "lucide-react";
import Link from "next/link";

async function Page({ params, searchParams }) {
  const { DateFormat } = UseDates();

  const month = await getPeriodo({ searchParams });

  const condicao = decodeURIComponent(params.condicao);

  const transactions = await getTransactionsByConditions(condicao, month);

  const valorTotal = transactions.reduce((acc, item) => acc + item.valor, 0);

  const { getButtonVariant, getResponsavelClass } = UseStyles();

  return (
    <div className="mb-4 space-y-6">
      {/* Botão Voltar */}
      <Button variant="ghost" className="mt-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <ArrowLeftIcon size={16} />
          <p>Voltar</p>
        </Link>
      </Button>

      {/* Cabeçalho */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                  <TableCell className="text-muted-foreground capitalize">
                    {DateFormat(item.data_compra)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold capitalize">
                        {item.descricao}
                      </span>
                      {item.condicao === "parcelado" && (
                        <span className="text-muted-foreground text-xs">
                          Parcela {item.parcela_atual} de {item.qtde_parcela}
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
                      {item.condicao === "parcelado" && (
                        <CalendarClockIcon size={12} />
                      )}
                      {item.condicao === "recorrente" && (
                        <RefreshCw size={12} />
                      )}
                      {item.condicao === "vista" && <Check size={12} />}
                      <span className="capitalize">{item.condicao}</span>
                    </span>
                  </TableCell>
                  <TableCell className="capitalize">
                    {item.forma_pagamento}
                  </TableCell>
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
                      itemRecorrencia={item.recorrencia}
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

export default Page;
