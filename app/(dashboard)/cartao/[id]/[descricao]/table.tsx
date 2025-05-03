"use client";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
import UseStyles from "@/hooks/use-styles";
import { UseDates } from "@/hooks/use-dates";
import MoneyValues from "@/components/money-values";
import {
  CheckCircle2Icon,
  MessageSquareText,
  PartyPopper,
  Users,
} from "lucide-react";
import { Card } from "@/components/ui/card";

export default function TransactionTable({ transactions }) {
  const { getButtonVariant, getResponsavelClass, getConditionIcon } =
    UseStyles();
  const { DateFormat } = UseDates();

  return (
    <Card className="mt-4 p-2">
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
          {transactions?.length === 0 && (
            <TableRow>
              <TableCell colSpan={9} className="text-center">
                Nenhum lançamento encontrado.
              </TableCell>
            </TableRow>
          )}
          {transactions?.map((item) => (
            <TableRow key={item.id} className="whitespace-nowrap">
              <TableCell className="text-muted-foreground">
                <span>{DateFormat(item.data_compra)}</span>
              </TableCell>

              <TableCell>
                <div className="flex items-center gap-1">
                  <span className="font-bold capitalize">{item.descricao}</span>

                  {item.condicao === "parcelado" && (
                    <span className="text-muted-foreground text-xs">
                      {item.parcela_atual} de {item.qtde_parcela}
                    </span>
                  )}

                  {item.responsavel === "sistema" && (
                    <CheckCircle2Icon
                      fill="green"
                      className="text-white"
                      size={15}
                    />
                  )}

                  {item.dividir_lancamento && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <Users className="text-muted-foreground" size={12} />
                        </TooltipTrigger>
                        <TooltipContent>Conta Dividida</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {item.anotacao && item.responsavel !== "sistema" && (
                    <TooltipProvider delayDuration={300}>
                      <Tooltip>
                        <TooltipTrigger>
                          <MessageSquareText
                            className="text-muted-foreground"
                            size={12}
                          />
                        </TooltipTrigger>
                        <TooltipContent>{item.anotacao}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )}

                  {item.condicao === "parcelado" &&
                    item.parcela_atual === item.qtde_parcela && (
                      <PartyPopper className="text-emerald-600" size={18} />
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
                <span className={`${getResponsavelClass(item.responsavel)}`}>
                  {item.responsavel}
                </span>
              </TableCell>

              <TableCell>
                <span className="lowercase">{item.categorias?.nome}</span>
              </TableCell>

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
                  itemParcelaAtual={item.parcela_atual}
                  itemRecorrencia={item.recorrencia}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
                  itemPaid={item.realizado}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
}
