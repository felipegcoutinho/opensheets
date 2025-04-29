"use client";

import BillPaymentDialog from "@/components/bill-payment-dialog";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import { Check, Ellipsis, RefreshCw } from "lucide-react";
import Image from "next/image";
import DeleteBills from "./modal/delete-bills";
import UpdateBills from "./modal/update-bills";

export default function TableBills({
  getBillsMap,
  getAccountMap,
  getCategorias,
}) {
  const { DateFormat } = UseDates();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Boletos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b">
              <TableHead>Descrição</TableHead>
              <TableHead>Data de Vencimento</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Condição</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getBillsMap?.length !== 0 ? (
              getBillsMap?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex items-center gap-2 capitalize">
                    <Image
                      quality={100}
                      src={`/logos/boleto.svg`}
                      className="transition-transform duration-300 hover:scale-110 dark:invert dark:filter"
                      width={30}
                      height={30}
                      alt={"Logo do cartão"}
                    />
                    <p className="text-sm font-semibold">{item.descricao}</p>
                  </TableCell>
                  <TableCell>{DateFormat(item.dt_vencimento)}</TableCell>
                  <TableCell>
                    <MoneyValues value={item.valor} />
                  </TableCell>
                  <TableCell>
                    <BillPaymentDialog
                      descricao={item.descricao}
                      valor={item.valor}
                      id={item.id}
                      status_pagamento={item.status_pagamento}
                    />
                  </TableCell>
                  <TableCell>
                    <span
                      className={` ${item.responsavel === "você" ? "text-blue-600" : "text-orange-500"}`}
                    >
                      {item.responsavel}
                    </span>
                  </TableCell>

                  <TableCell>
                    <span className="flex items-center gap-1">
                      {item.condicao === "recorrente" && (
                        <RefreshCw size={12} />
                      )}
                      {item.condicao === "vista" && <Check size={12} />}

                      <span className="capitalize">{item.condicao}</span>
                    </span>
                  </TableCell>

                  <TableCell>{item.categorias?.nome}</TableCell>

                  <TableCell className="flex gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="data-[state=open]:bg-muted flex h-8 w-8 p-0"
                        >
                          <Ellipsis size={16} />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[160px]">
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <UpdateBills
                            itemId={item.id}
                            itemDescricao={item.descricao}
                            itemPeriodo={item.periodo}
                            itemDtVencimento={item.dt_vencimento}
                            itemStatusPagamento={item.status_pagamento}
                            itemResponsavel={item.responsavel}
                            itemCategoria={item.categoria}
                            itemValor={item.valor}
                            itemDtPagamento={item.dt_pagamento}
                            itemAnotacao={item.anotacao}
                            itemCondicao={item.condicao}
                            itemQtdeRecorrencia={item.qtde_recorrencia}
                            itemContaId={item.contas?.id}
                            itemCategoriaId={item.categorias?.id}
                            getAccountMap={getAccountMap}
                            getCategorias={getCategorias}
                          />
                        </DropdownMenuItem>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                          <DeleteBills itemId={item.id} />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center">
                  <EmptyCard width={100} height={100} />
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
