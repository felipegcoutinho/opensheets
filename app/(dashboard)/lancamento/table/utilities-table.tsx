"use client";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  PaginationState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useMemo, useState } from "react";

// Definindo um tipo genérico para os dados da transação para melhor tipagem
interface TransactionData {
  descricao?: string;
  condicao?: string;
  forma_pagamento?: string;
  responsavel?: string;
  tipo_transacao?: string;
  valor: number;
  categorias?: { nome?: string };
  // Adicione outras propriedades que são usadas por getDescricao
  [key: string]: any;
}

interface UseTransactionTableLogicProps<TData extends TransactionData> {
  data: TData[];
  columns: ColumnDef<TData, any>[];
  getDescricao: (item: TData) => string | undefined;
  initialPageSize?: number;
}

export function useTransactionTableLogic<TData extends TransactionData>({
  data,
  columns,
  getDescricao,
  initialPageSize = 30,
}: UseTransactionTableLogicProps<TData>) {
  const customGlobalFilter: FilterFn<TData> = (row, columnId, filterValue) => {
    const searchValue = filterValue.toLowerCase();
    const item = row.original;
    const descricaoContaCartao = getDescricao(item)?.toLowerCase() || "";

    return (
      item.descricao?.toLowerCase().includes(searchValue) ||
      item.condicao?.toLowerCase().includes(searchValue) ||
      item.forma_pagamento?.toLowerCase().includes(searchValue) ||
      (item.pagadores?.nome || "").toLowerCase().includes(searchValue) ||
      item.tipo_transacao?.toLowerCase().includes(searchValue) ||
      item.valor?.toString().toLowerCase().includes(searchValue) ||
      item.categorias?.nome?.toLowerCase().includes(searchValue) ||
      descricaoContaCartao.includes(searchValue)
    );
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    categoria: false, // Exemplo, ajuste conforme necessário
  });
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });

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

  const selectedTransactionSum = useMemo(() => {
    return data
      .filter((_, index) => rowSelection[index])
      .reduce((sum, rowData) => sum + rowData.valor, 0);
  }, [data, rowSelection]);

  const tipoTransacaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.tipo_transacao).filter(Boolean),
    );
    return Array.from(values as string[]);
  }, [data]);

  const condicaoOptions = useMemo(() => {
    const values = new Set(data.map((item) => item.condicao).filter(Boolean));
    return Array.from(values as string[]);
  }, [data]);

  const formaPagamentoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.forma_pagamento).filter(Boolean),
    );
    return Array.from(values as string[]);
  }, [data]);

  const responsavelOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.pagadores?.nome).filter(Boolean),
    );
    return Array.from(values as string[]);
  }, [data]);

  const categoriaOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.categorias?.nome).filter(Boolean),
    );
    return Array.from(values as string[]);
  }, [data]);

  const contaCartaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => getDescricao(item)).filter(Boolean),
    );
    return Array.from(values as string[]);
  }, [data, getDescricao]);

  const getColumnFilterValue = (columnId: string) => {
    const filter = columnFilters.find((f) => f.id === columnId);
    return filter ? (filter.value as string) : "";
  };

  const setColumnFilterValue = (columnId: string, value: string) => {
    const newColumnFilters = columnFilters.filter((f) => f.id !== columnId);
    if (
      value &&
      value.toLowerCase() !== "all" &&
      value.toLowerCase() !== "todas"
    ) {
      newColumnFilters.push({ id: columnId, value });
    }
    setColumnFilters(newColumnFilters);
  };

  const clearAllFilters = () => {
    setGlobalFilter("");
    setColumnFilters([]);
  };

  return {
    table,
    globalFilter,
    setGlobalFilter,
    columnFilters, // Exposto para debug ou usos avançados, mas setColumnFilterValue é preferível
    isAnyFilterActive,
    selectedTransactionSum,
    rowSelection, // Adicionado para uso no TransactionTableHeaderCard
    tipoTransacaoOptions,
    condicaoOptions,
    formaPagamentoOptions,
    responsavelOptions,
    categoriaOptions,
    contaCartaoOptions,
    getColumnFilterValue,
    setColumnFilterValue,
    clearAllFilters,
  };
}
