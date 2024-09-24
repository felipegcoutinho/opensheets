"use client";

import DeleteTransactions from "@/app/transacao/modal/delete-transactions";
import DetailsTransactions from "@/app/transacao/modal/details-transactions";
import UpdateTransactions from "@/app/transacao/modal/update-transactions";
import { ColorDotTable } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
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
import {
  ArrowUpDown,
  CalendarClockIcon,
  Check,
  CheckCircle2Icon,
  MessageSquareText,
  PartyPopper,
  RefreshCw,
  ThumbsDown,
  ThumbsUp,
  Users,
} from "lucide-react";
import * as React from "react";

function getDescricao(row) {
  const contaDescricao = row.contas?.descricao;
  const cartaoDescricao = row.cartoes?.descricao;
  return contaDescricao ?? cartaoDescricao;
}

function getColor(row) {
  const contaAparencia = row.contas?.aparencia;
  const cartaoAparencia = row.cartoes?.aparencia;
  return contaAparencia ?? cartaoAparencia;
}

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
    descricaoContaCartao.includes(searchValue)
  );
};

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
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="flex items-center gap-1">
          <span className="capitalize font-bold">{row.getValue("descricao")}</span>

          {item.condicao === "Parcelado" && (
            <span className="text-muted-foreground text-xs">
              {item.parcela_atual} de {item.qtde_parcela}
            </span>
          )}

          {item.responsavel === "Sistema" && (
            <span className="text-muted-foreground text-xs">
              <CheckCircle2Icon fill="green" className="text-white" size={14} />
            </span>
          )}

          {item.dividir_lancamento === true && (
            <span className="px-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <Users className="text-muted-foreground" size={12} />
                  </TooltipTrigger>
                  <TooltipContent>Conta Dividida</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </span>
          )}

          {item.anotacao != "" && item.responsavel != "Sistema" && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <MessageSquareText className="text-muted-foreground" size={12} />
                </TooltipTrigger>
                <TooltipContent>{item.anotacao}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {item.condicao === "Parcelado" && item.parcela_atual === item.qtde_parcela && <PartyPopper color="pink" size={16} />}
        </span>
      );
    },
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
      <div className="capitalize">
        <Numbers number={row.getValue("valor")} />
      </div>
    ),
  },
  {
    accessorKey: "condicao",
    header: () => <div>Condição</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("condicao")}</div>,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="flex items-center gap-1">
          {item.condicao === "Parcelado" && <CalendarClockIcon size={12} />}
          {item.condicao === "Recorrente" && <RefreshCw size={12} />}
          {item.condicao === "Vista" && <Check size={12} />}

          <span className="capitalize">{row.getValue("condicao")}</span>
        </span>
      );
    },
  },
  {
    accessorKey: "forma_pagamento",
    header: () => <div>Pagamento</div>,
    cell: ({ row }) => <div className="capitalize">{row.getValue("forma_pagamento")}</div>,
  },

  {
    accessorKey: "responsavel",
    header: ({ column }) => {
      return (
        <Button variant="ghost" className="text-xs p-0" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
          Responsável
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
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
      const aparencia = getColor(item);
      return (
        <div className="flex items-center gap-2">
          <ColorDotTable aparencia={aparencia} descricao={descricao} />
        </div>
      );
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
            itemTipoTransacao={item.tipo_transacao}
            itemValor={item.valor}
            itemFormaPagamento={item.forma_pagamento}
            itemQtdeParcelas={item.qtde_parcela}
            itemParcelaAtual={item.parcela_atual}
            itemRecorrencia={item.recorrencia}
            itemQtdeRecorrencia={item.qtde_recorrencia}
            itemCartao={item.cartoes?.descricao}
            itemConta={item.contas?.descricao}
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

          {item.responsavel != "Sistema" && (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  {item.realizado ? (
                    <ThumbsUp fill="green" className="stroke-none" size={14} />
                  ) : (
                    <ThumbsDown fill="orange" className="stroke-none" size={14} />
                  )}
                </TooltipTrigger>
                <TooltipContent>{item.realizado ? "Compra Paga" : "Compra Pendente"}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      );
    },
  },
];

export function TableTransaction({ data, getAccountMap, getCardsMap }) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = React.useState("");
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
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter, // Adiciona o filtro global
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    globalFilterFn: customGlobalFilter, // Aplica a função de filtro global personalizada
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-end items-center py-2">
        <Input placeholder="Pesquisar" value={globalFilter} onChange={(event) => setGlobalFilter(event.target.value)} className="max-w-52" />
      </div>
      <>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow className="text-xs" key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
                    row.original?.categoria === "Saldo Anterior" && "bg-gradient-to-r from-green-400/10 to-transparent"
                  }`}
                  key={row.id}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  <EmptyCard width={100} height={100} />
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
