"use client";

import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import PayBills from "@/components/pay-bills";
import { Button } from "@/components/ui/button";
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

export default function TableBills({ getBillsMap, getAccountMap }) {
  const { DateFormat } = UseDates();
  return (
    <Table className="mt-4">
      <TableHeader>
        <TableRow className="border-b text-xs">
          <TableHead></TableHead>
          <TableHead>Data de Vencimento</TableHead>
          <TableHead>Descrição</TableHead>
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
              <TableCell>
                <Image
                  quality={100}
                  src={`/logos/boleto.png`}
                  className="rounded-full"
                  width={40}
                  height={40}
                  alt={"Logo do cartão"}
                />
              </TableCell>
              <TableCell>{DateFormat(item.dt_vencimento)}</TableCell>
              <TableCell className="font-bold capitalize">
                {item.descricao}
              </TableCell>
              <TableCell>
                <Numbers value={item.valor} />
              </TableCell>
              <TableCell>
                {/* <CardTitle className="text-md flex items-center gap-1 capitalize">
                  <Button
                    className="h-6"
                    variant={`${item.status_pagamento === "Pago" ? "success" : "warning"}`}
                    type="button"
                  >
                    {item.status_pagamento === "Pago" ? "Pago" : "Pendente"}
                  </Button>
                </CardTitle> */}
                {item.status_pagamento === "Pago" ? (
                  <Button className="h-6" variant="success" type="button">
                    Pago
                  </Button>
                ) : (
                  <PayBills
                    descricao={item.descricao}
                    valor={item.valor}
                    id={item.id}
                  />
                )}
              </TableCell>
              <TableCell>
                <span
                  className={`font-bold ${item.responsavel === "Você" ? "text-blue-600" : "text-orange-500"}`}
                >
                  {item.responsavel}
                </span>
              </TableCell>

              <TableCell>
                <span className="flex items-center gap-1">
                  {item.condicao === "Recorrente" && <RefreshCw size={12} />}
                  {item.condicao === "Vista" && <Check size={12} />}

                  <span className="capitalize">{item.condicao}</span>
                </span>
              </TableCell>
              <TableCell>{item.categoria}</TableCell>
              <TableCell className="flex gap-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
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
                        getAccountMap={getAccountMap}
                        itemContaId={item.contas?.id}
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
  );
}
