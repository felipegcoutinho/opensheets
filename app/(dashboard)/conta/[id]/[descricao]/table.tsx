"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import MoneyValues from "@/components/money-values";
import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
import UseStyles from "@/hooks/use-styles";
import { UseDates } from "@/hooks/use-dates";

function TransactionTable({ transactions }) {
  const { getButtonVariant, getConditionIcon, getResponsavelClass } =
    UseStyles();

  const { DateFormat } = UseDates();

  console.log(transactions);

  return (
    <Card className="mt-4">
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
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead>
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
                  <span className="font-bold capitalize">{item.descricao}</span>
                  {item.condicao === "parcelado" && (
                    <span className="px-1 text-xs text-neutral-400">
                      {`${item.parcela_atual} de ${item.qtde_parcela}`}
                    </span>
                  )}
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
                  <span className={`${getResponsavelClass(item.responsavel)}`}>
                    {item.responsavel}
                  </span>
                </TableCell>

                <TableCell>{item.categorias?.nome}</TableCell>

                <TableCell>
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
                    itemRecorrencia={item.recorrencia}
                    itemQtdeRecorrencia={item.qtde_recorrencia}
                    itemConta={item.contas?.descricao}
                    itemPaid={item.realizado}
                    itemParcelaAtual={item.parcela_atual}
                    itemCartao={item.cartao?.descricao}
                    itemImagemURL={item.imagem_url}
                    itemValorRestante={item.valor_restante}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default TransactionTable;
