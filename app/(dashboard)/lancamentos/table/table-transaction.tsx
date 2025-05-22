"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  ColumnFiltersState,
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
import { useMemo, useState } from "react";
import CreateTransactions from "../modal/create-transactions";
import { ComboboxFilter } from "./combo-filter";
import { getColumns, getDescricao } from "./get-columns";

const customGlobalFilter: FilterFn<any> = (row, columnId, filterValue) => {
  const searchValue = filterValue.toLowerCase();
  const item = row.original;
  const descricaoContaCartao = getDescricao(item)?.toLowerCase() || "";

  return (
    item.descricao?.toLowerCase().includes(searchValue) ||
    item.condicao?.toLowerCase().includes(searchValue) ||
    item.forma_pagamento?.toLowerCase().includes(searchValue) ||
    item.responsavel?.toLowerCase().includes(searchValue) ||
    item.tipo_transacao?.toLowerCase().includes(searchValue) ||
    item.valor?.toString().toLowerCase().includes(searchValue) ||
    item.categorias?.nome?.toLowerCase().includes(searchValue) ||
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
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
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
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
      columnVisibility: {
        categoria: false,
      },
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });

  const isAnyFilterActive =
    globalFilter.trim() !== "" || columnFilters.length > 0;

  const selectedTransactionSum = data
    .filter((_, index) => rowSelection[index])
    .reduce((sum, rowData) => sum + rowData.valor, 0);

  const tipoTransacaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.tipo_transacao).filter(Boolean),
    );
    return Array.from(values);
  }, [data]);

  const condicaoOptions = useMemo(() => {
    const values = new Set(data.map((item) => item.condicao).filter(Boolean));
    return Array.from(values);
  }, [data]);

  const formaPagamentoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.forma_pagamento).filter(Boolean),
    );
    return Array.from(values);
  }, [data]);

  const responsavelOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.responsavel).filter(Boolean),
    );
    return Array.from(values);
  }, [data]);

  const categoriaOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.categorias?.nome).filter(Boolean),
    );
    return Array.from(values);
  }, [data]);

  const contaCartaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => getDescricao(item)).filter(Boolean),
    );
    return Array.from(values);
  }, [data]);

  const getColumnFilterValue = (columnId: string) => {
    const filter = columnFilters.find((f) => f.id === columnId);
    return filter ? (filter.value as string) : "";
  };

  const setColumnFilterValue = (columnId: string, value: string) => {
    const newColumnFilters = columnFilters.filter((f) => f.id !== columnId);
    if (value && value !== "all") {
      newColumnFilters.push({ id: columnId, value });
    }
    setColumnFilters(newColumnFilters);
  };

  return (
    <div className="mt-4 w-full">
      <div
        className="mb-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between"
        hidden={hidden}
      >
        <CreateTransactions
          getCards={getCards}
          getAccount={getAccount}
          getCategorias={getCategorias}
        >
          <Button
            variant="default"
            className="w-full transition-all hover:scale-110 sm:w-auto"
          >
            Novo Lançamento
          </Button>
        </CreateTransactions>

        <div className="flex w-full flex-col items-start gap-2 sm:w-auto sm:flex-row sm:items-center">
          <Select
            value={getColumnFilterValue("tipo_transacao")}
            onValueChange={(value) =>
              setColumnFilterValue("tipo_transacao", value)
            }
          >
            <SelectTrigger
              className={`w-full border-dashed sm:w-[140px] ${
                getColumnFilterValue("tipo_transacao") &&
                getColumnFilterValue("tipo_transacao") !== "all"
                  ? "ring-primary font-bold ring-2"
                  : ""
              }`}
            >
              <SelectValue placeholder="Transação" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {tipoTransacaoOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getColumnFilterValue("condicao")}
            onValueChange={(value) => setColumnFilterValue("condicao", value)}
          >
            <SelectTrigger
              className={`w-full border-dashed sm:w-[140px] ${
                getColumnFilterValue("condicao") &&
                getColumnFilterValue("condicao") !== "all"
                  ? "ring-primary font-bold ring-2"
                  : ""
              }`}
            >
              <SelectValue placeholder="Condição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {condicaoOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getColumnFilterValue("forma_pagamento")}
            onValueChange={(value) =>
              setColumnFilterValue("forma_pagamento", value)
            }
          >
            <SelectTrigger
              className={`w-full border-dashed sm:w-[140px] ${
                getColumnFilterValue("forma_pagamento") &&
                getColumnFilterValue("forma_pagamento") !== "all"
                  ? "ring-primary font-bold ring-2"
                  : ""
              }`}
            >
              <SelectValue placeholder="Pagamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {formaPagamentoOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={getColumnFilterValue("responsavel")}
            onValueChange={(value) =>
              setColumnFilterValue("responsavel", value)
            }
          >
            <SelectTrigger
              className={`w-full border-dashed sm:w-[140px] ${
                getColumnFilterValue("responsavel") &&
                getColumnFilterValue("responsavel") !== "all"
                  ? "ring-primary font-bold ring-2"
                  : ""
              }`}
            >
              <SelectValue placeholder="Responsável" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {responsavelOptions.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <ComboboxFilter
            placeholder="Categoria"
            options={categoriaOptions}
            value={getColumnFilterValue("categoria")}
            onChange={(value) => setColumnFilterValue("categoria", value)}
          />

          <ComboboxFilter
            placeholder="Conta/Cartão"
            options={contaCartaoOptions}
            value={getColumnFilterValue("conta_cartao")}
            onChange={(value) => setColumnFilterValue("conta_cartao", value)}
          />

          <Input
            placeholder="Pesquisar"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="w-full sm:w-[140px]"
          />
        </div>
      </div>

      <Card>
        <CardHeader className="flex justify-between">
          <CardTitle className="flex items-center gap-4" hidden={hidden}>
            Lançamentos
            {Object.keys(rowSelection).length > 0 && !hidden && (
              <Badge variant={"outline"} className="py-0">
                Total Selecionado:
                <MoneyValues value={selectedTransactionSum} />
              </Badge>
            )}
          </CardTitle>
          {isAnyFilterActive && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive"
              onClick={() => {
                setGlobalFilter("");
                setColumnFilters([]);
              }}
            >
              Limpar Filtros
            </Button>
          )}
        </CardHeader>
        <CardContent className="px-4">
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
                    className={`whitespace-nowrap ${row.original.categorias?.nome === "saldo anterior" && "bg-linear-to-r from-lime-300/10 to-transparent"}`}
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
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
                  <TableCell colSpan={columns.length}>
                    <EmptyCard />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} de{" "}
          {table.getFilteredRowModel().rows.length} linha(s) selecionadas.
        </div>
        <div className="text-muted-foreground text-sm">
          Total de Lançamentos: {table.getFilteredRowModel().rows.length}
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
