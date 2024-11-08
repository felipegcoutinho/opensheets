"use client";

import { BadgeCardTable } from "@/components/card-color";
import EmptyCard from "@/components/empty-card";
import Numbers from "@/components/numbers";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
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
  Ellipsis,
  MessageSquareText,
  PartyPopper,
  RefreshCw,
  ThumbsUp,
  Users,
} from "lucide-react";
import { useState } from "react";
import CreateTransactions from "./modal/create-transactions";
import DeleteTransactions from "./modal/delete-transactions";
import DetailsTransactions from "./modal/details-transactions";
import UpdateTransactions from "./modal/update-transactions";

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

const getResponsavelClass = (responsavel) => {
  if (responsavel === "Você") return "text-blue-600";
  if (responsavel === "Sistema") return "text-neutral-600";
  return "text-orange-600";
};

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
    row.original.categoria?.toLowerCase().includes(searchValue) ||
    descricaoContaCartao.includes(searchValue)
  );
};

export const getColumns = (getAccountMap, getCardsMap, DateFormat) => [
  {
    id: "selection",
    header: ({ table }) => (
      <input
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={row.getToggleSelectedHandler()}
      />
    ),
  },
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
          <span className="font-bold capitalize">
            {row.getValue("descricao")}
          </span>

          {item.condicao === "Parcelado" && (
            <span className="text-xs text-muted-foreground">
              {item.parcela_atual} de {item.qtde_parcela}
            </span>
          )}

          {item.responsavel === "Sistema" && (
            <span className="text-xs text-muted-foreground">
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
                  <MessageSquareText
                    className="text-muted-foreground"
                    size={12}
                  />
                </TooltipTrigger>
                <TooltipContent>{item.anotacao}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {item.condicao === "Parcelado" &&
            item.parcela_atual === item.qtde_parcela && (
              <PartyPopper color="pink" size={16} />
            )}
        </span>
      );
    },
  },

  {
    accessorKey: "tipo_transacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Transacao
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge
          variant={
            item.tipo_transacao === "Receita" ? "defaultGreen" : "defaultRed"
          }
        >
          {item.tipo_transacao}
        </Badge>
      );
    },
  },

  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Condição
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Pagamento
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <span className="capitalize">{row.getValue("forma_pagamento")}</span>
      );
    },
  },

  {
    accessorKey: "responsavel",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0 text-xs"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Responsável
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.original;

      return (
        <span className={`font-bold ${getResponsavelClass(item.responsavel)}`}>
          {item.responsavel}
        </span>
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
          <BadgeCardTable aparencia={aparencia} descricao={descricao} />
        </div>
      );
    },
  },

  {
    accessorKey: "categoria",
    header: () => <span>Categoria</span>,
    cell: ({ row }) => {
      const item = row.original;
      return <span className="capitalize">{row.getValue("categoria")}</span>;
    },
  },

  {
    id: "actions",
    header: () => <span>Ações</span>,
    cell: ({ row }) => {
      const item = row.original;

      return (
        <div className="flex">
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
              </DropdownMenuItem>

              {item.responsavel != "Sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
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
                </DropdownMenuItem>
              )}

              {item.responsavel != "Sistema" && (
                <>
                  <DropdownMenuSeparator />

                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteTransactions
                      itemResponsavel={item.responsavel}
                      itemId={item.id}
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {item.responsavel != "Sistema" && (
            <div className="flex gap-2 text-center">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <ThumbsUp
                      fill={item.realizado ? "green" : "gray"}
                      className="stroke-none"
                      size={16}
                    />
                  </TooltipTrigger>
                  <TooltipContent>
                    {item.realizado ? "Compra Paga" : "Compra Pendente"}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>
      );
    },
  },
];

export function TableTransaction({ data, getAccountMap, getCardsMap }) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState<PaginationState>({
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

  // Cálculo da soma das transações selecionadas
  const selectedTransactionSum = data
    .filter((_, index) => rowSelection[index])
    .reduce((sum, row) => sum + row.valor, 0);

  return (
    <div className="mt-4 w-full">
      <div className="flex items-center justify-between">
        <CreateTransactions
          getCardsMap={getCardsMap}
          getAccountMap={getAccountMap}
        />

        <div className="flex items-center gap-2">
          {/* Exibe a soma dos lançamentos selecionados */}
          <div className="text-mdfont-bold">
            Total Selecionado: <Numbers number={selectedTransactionSum} />
          </div>

          <Input
            placeholder="Pesquisar"
            value={globalFilter}
            onChange={(event) => setGlobalFilter(event.target.value)}
            className="max-w-52"
          />
        </div>
      </div>

      <Table className="mt-4">
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow className="text-xs" key={headerGroup.id}>
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
                  row.original?.categoria === "Saldo Anterior" &&
                  "bg-gradient-to-r from-green-400/10 to-transparent"
                }`}
                key={row.id}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
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

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredRowModel().rows.length} transações
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
