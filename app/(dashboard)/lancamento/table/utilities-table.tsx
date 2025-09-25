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
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Definindo um tipo genérico para os dados da transação para melhor tipagem
interface TransactionData {
  descricao?: string;
  condicao?: string;
  forma_pagamento?: string;
  responsavel?: string;
  tipo_transacao?: string;
  valor: number;
  categorias?: { nome?: string };
  regra_502030_tipo?: string | null;
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialized = useRef(false);

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
      item.regra_502030_tipo?.toLowerCase().includes(searchValue) ||
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
  const [ruleBucketFilter, setRuleBucketFilter] = useState<string>("");
  // Inicializa paginação a partir da URL (page 1-based na URL)
  const initialPagination = useMemo(() => {
    const p = Number(searchParams?.get("page") || "");
    const s = Number(searchParams?.get("pageSize") || "");
    const pageIndex = Number.isFinite(p) && p > 0 ? p - 1 : 0;
    const pageSize = Number.isFinite(s) && s > 0 ? s : initialPageSize;
    return { pageIndex, pageSize } as PaginationState;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [pagination, setPagination] = useState<PaginationState>(
    initialPagination,
  );

  const filteredData = useMemo(() => {
    if (!ruleBucketFilter) {
      return data;
    }

    return data.filter((item) => {
      const bucket = (item.regra_502030_tipo || "").toString().toLowerCase();
      return bucket === ruleBucketFilter.toLowerCase();
    });
  }, [data, ruleBucketFilter]);

  const table = useReactTable({
    data: filteredData,
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
    autoResetPageIndex: false,
  });

  const isAnyFilterActive =
    globalFilter.trim() !== "" || columnFilters.length > 0 || ruleBucketFilter;

  const selectedTransactionSum = useMemo(() => {
    return filteredData
      .filter((_, index) => rowSelection[index])
      .reduce((sum, rowData) => sum + rowData.valor, 0);
  }, [filteredData, rowSelection]);

  const tipoTransacaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.tipo_transacao).filter(Boolean),
    );
    return Array.from(values).filter(Boolean) as string[];
  }, [data]);

  const condicaoOptions = useMemo(() => {
    const values = new Set(data.map((item) => item.condicao).filter(Boolean));
    return Array.from(values).filter(Boolean) as string[];
  }, [data]);

  const formaPagamentoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.forma_pagamento).filter(Boolean),
    );
    return Array.from(values).filter(Boolean) as string[];
  }, [data]);

  const responsavelOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.pagadores?.nome).filter(Boolean),
    );
    return Array.from(values).filter(Boolean) as string[];
  }, [data]);

  const categoriaOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => item.categorias?.nome).filter(Boolean),
    );
    return Array.from(values).filter(Boolean) as string[];
  }, [data]);

  const contaCartaoOptions = useMemo(() => {
    const values = new Set(
      data.map((item) => getDescricao(item)).filter(Boolean),
    );
    return Array.from(values).filter(Boolean) as string[];
  }, [data, getDescricao]);

  const getColumnFilterValue = (columnId: string) => {
    if (columnId === "regra_502030_tipo") {
      return ruleBucketFilter;
    }
    const filter = columnFilters.find((f) => f.id === columnId);
    return filter ? (filter.value as string) : "";
  };

  const setColumnFilterValue = (columnId: string, value: string) => {
    if (columnId === "regra_502030_tipo") {
      const normalized = value?.trim().toLowerCase();
      const effectiveValue =
        normalized && normalized !== "all" && normalized !== "todas"
          ? normalized
          : "";

      setRuleBucketFilter(effectiveValue);
      setColumnFilters((prev) => prev.filter((f) => f.id !== columnId));
      return;
    }

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
    setRuleBucketFilter("");
  };

  // Atualiza URL quando paginação muda
  useEffect(() => {
    // Evita rodar na renderização inicial duas vezes
    if (!initialized.current) {
      initialized.current = true;
    }

    const params = new URLSearchParams(searchParams?.toString());
    const setOrDeleteNumber = (key: string, value?: number) => {
      if (!value && value !== 0) params.delete(key);
      else params.set(key, String(value));
    };

    // page é 1-based na URL
    setOrDeleteNumber("page", pagination.pageIndex + 1);
    setOrDeleteNumber("pageSize", pagination.pageSize);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.pageIndex, pagination.pageSize, pathname]);

  // Reage a mudanças externas na URL (back/forward) para paginação
  useEffect(() => {
    const p = Number(searchParams?.get("page") || "");
    const s = Number(searchParams?.get("pageSize") || "");
    const urlIndex = Number.isFinite(p) && p > 0 ? p - 1 : 0;
    const urlSize = Number.isFinite(s) && s > 0 ? s : pagination.pageSize;

    if (
      urlIndex !== pagination.pageIndex ||
      urlSize !== pagination.pageSize
    ) {
      setPagination({ pageIndex: urlIndex, pageSize: urlSize });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams?.toString()]);

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
    pagination,
    setPagination,
  };
}
