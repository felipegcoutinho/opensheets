"use client";

import DeleteTransactions from "@/app/transacao/modal/delete-transactions";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import UpdateTransactions from "@/app/transacao/modal/update-transactions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
import {
  ColumnFiltersState,
  PaginationState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import * as React from "react";

function getDescricao(row) {
  const contaDescricao = row.contas?.descricao;
  const cartaoDescricao = row.cartoes?.descricao;
  return contaDescricao ?? cartaoDescricao;
}

export const getColumns = (getAccountMap, getCardsMap, DateFormat) => [
  {
    accessorKey: "data_compra",
    header: "Data",
    cell: ({ row }) => {
      const item = row.original;
      return <span>{DateFormat(item.data_compra)}</span>;
    },
  },
  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => <span className="capitalize font-bold">{row.getValue("descricao")}</span>,
  },
  {
    accessorKey: "tipo_transacao",
    header: "Transacao",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant="outline" className={item.tipo_transacao === "Receita" ? "text-green-500" : "text-red-500"}>
          {row.getValue("tipo_transacao")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="text-xs p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Valor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">{Number(row.getValue("valor")).toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}</div>
    ),
  },
  {
    accessorKey: "condicao",
    header: () => <div>Condição</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("condicao")}</div>,
  },
  {
    accessorKey: "forma_pagamento",
    header: () => <div>Pagamento</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("forma_pagamento")}</div>,
  },
  {
    accessorKey: "responsavel",
    header: "Responsável",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant="outline" className={item.responsavel === "Você" ? "text-blue-500" : "text-orange-500"}>
          {row.getValue("responsavel")}
        </Badge>
      );
    },
  },
  {
    accessorKey: "contaCartao",
    header: () => <span>Conta/Cartão</span>,
    cell: ({ row }) => {
      const item = row.original;
      const descricao = getDescricao(item);

      return <div className="capitalize">{descricao}</div>;
    },
    filterFn: (row, columnId, filterValue) => {
      const descricao = getDescricao(row.original);
      return descricao.toLowerCase().includes(filterValue.toLowerCase());
    },
  },
  {
    id: "actions",
    header: () => <span>Ações</span>,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="text-center flex gap-2">
          <DetailsTransactions
            itemId={item.id}
            itemPeriodo={item.periodo}
            itemNotas={item.anotacao}
            itemDate={item.data_compra}
            itemDescricao={item.descricao}
            itemCategoria={item.categoria}
            itemCondicao={item.condicao}
            itemResponsavel={item.responsavel}
            itemSegundoResponsavel={item.segundo_responsavel}
            itemTipoTransacao={item.tipo_transacao}
            itemValor={item.valor}
            itemFormaPagamento={item.forma_pagamento}
            itemQtdeParcelas={item.qtde_parcela}
            itemRecorrencia={item.recorrencia}
            itemQtdeRecorrencia={item.qtde_recorrencia}
            getAccountMap={getAccountMap}
            getCardsMap={getCardsMap}
            itemCartao={item.cartoes?.id}
            itemConta={item.contas?.id}
            itemPaid={item.realizado}
          />

          <UpdateTransactions
            itemId={item.id}
            itemPeriodo={item.periodo}
            itemNotas={item.anotacao}
            itemDate={item.data_compra}
            itemDescricao={item.descricao}
            itemCategoria={item.categoria}
            itemCondicao={item.condicao}
            itemResponsavel={item.responsavel}
            itemSegundoResponsavel={item.segundo_responsavel}
            itemTipoTransacao={item.tipo_transacao}
            itemValor={item.valor}
            itemFormaPagamento={item.forma_pagamento}
            itemQtdeParcelas={item.qtde_parcela}
            itemRecorrencia={item.recorrencia}
            itemQtdeRecorrencia={item.qtde_recorrencia}
            getAccountMap={getAccountMap}
            getCardsMap={getCardsMap}
            itemCartao={item.cartoes?.id}
            itemConta={item.contas?.id}
            itemPaid={item.realizado}
          />

          <DeleteTransactions itemResponsavel={item.responsavel} itemId={item.id} />
        </div>
      );
    },
  },
];

export function TableTransaction({ data, getAccountMap, getCardsMap }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 50,
  });

  const { DateFormat } = UseDates();

  const columns = getColumns(getAccountMap, getCardsMap, DateFormat);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-end items-center py-2">
        <Input
          placeholder="Filtrar Responsável"
          value={(table.getColumn("responsavel")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("responsavel")?.setFilterValue(event.target.value)}
          className="max-w-44"
        />

        <Input
          placeholder="Filtrar Conta/Cartão"
          value={(table.getColumn("contaCartao")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("contaCartao")?.setFilterValue(event.target.value)}
          className="max-w-44"
        />
      </div>
      <>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="text-xs" key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow className="whitespace-nowrap" key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">{table.getFilteredRowModel().rows.length} transações</div>
        <div className="space-x-2">
          <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
