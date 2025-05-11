"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UseDates } from "@/hooks/use-dates";
import {
  FilterFn,
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
import { useState } from "react";
import CreateTransactions from "../modal/create-transactions";
import { getColumns, getDescricao } from "./get-columns";

// Função personalizada para filtrar em várias colunas
const customGlobalFilter: FilterFn = (row, columnId, filterValue) => {
  const searchValue = filterValue.toLowerCase();

  // Pega a descrição da conta ou cartão
  const descricaoContaCartao = getDescricao(row.original).toLowerCase();

  return (
    row.original.descricao?.toLowerCase().includes(searchValue) ||
    row.original.condicao?.toLowerCase().includes(searchValue) ||
    row.original.forma_pagamento?.toLowerCase().includes(searchValue) ||
    row.original.responsavel?.toLowerCase().includes(searchValue) ||
    row.original.tipo_transacao?.toLowerCase().includes(searchValue) ||
    row.original.valor?.toString().toLowerCase().includes(searchValue) ||
    row.original.categorias?.nome?.toLowerCase().includes(searchValue) ||
    descricaoContaCartao.includes(searchValue)
  );
};

export function TableTransaction({
  data,
  getAccount,
  getCards,
  getCategorias,
  hidden,
}) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  });

  const { DateFormat } = UseDates();
  const columns = getColumns(
    getAccount,
    getCards,
    getCategorias,
    DateFormat,
    hidden,
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });

  // Cálculo da soma das Lançamentos selecionadas
  const selectedTransactionSum = data
    .filter((_, index) => rowSelection[index])
    .reduce((sum, row) => sum + row.valor, 0);

  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between" hidden={hidden}>
        <CreateTransactions
          getCards={getCards}
          getAccount={getAccount}
          getCategorias={getCategorias}
        >
          <Button variant="default" className="transition-all hover:scale-110">
            Novo Lançamento
          </Button>
        </CreateTransactions>

        <div className="flex items-center gap-2">
          {/* Exibe a soma dos lançamentos selecionados */}
          <div className="text-muted-foreground text-right text-xs">
            Total Selecionado: <MoneyValues value={selectedTransactionSum} />
          </div>

          <Input
            placeholder="Pesquisar"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-52"
          />
        </div>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle hidden={hidden}>Lançamentos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    className={`whitespace-nowrap ${
                      row.original.categorias?.nome === "saldo anterior" &&
                      "bg-linear-to-r from-lime-300/10 to-transparent"
                    }`}
                    key={row.id}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    <EmptyCard width={100} height={100} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredRowModel().rows.length} Lançamentos
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
}
