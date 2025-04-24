"use client";

import { LogosOnTable } from "@/components/logos-on-table";
import MoneyValues from "@/components/money-values";
import TogglePaymentDialog from "@/components/toggle-payment-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UseStyles from "@/hooks/use-styles";
import {
  ArrowUpDown,
  CalendarClockIcon,
  Check,
  CheckCircle2Icon,
  Ellipsis,
  FileImage,
  MessageSquareText,
  PartyPopper,
  RefreshCw,
  Users,
} from "lucide-react";
import DeleteTransactions from "../modal/delete-transactions";
import DetailsTransactions from "../modal/details-transactions";
import UpdateTransactions from "../modal/update-transactions";
import Utils from "../utils-transacao";

const { getButtonVariant } = UseStyles();

export function getDescricao(row) {
  const contaDescricao = row.contas?.descricao;
  const cartaoDescricao = row.cartoes?.descricao;
  return contaDescricao ?? cartaoDescricao;
}

export function getLogo(row) {
  const contaLogo = row.contas?.logo_image;
  const cartaoLogo = row.cartoes?.logo_image;
  return contaLogo ?? cartaoLogo;
}

const getResponsavelClass = (responsavel) => {
  if (responsavel === "Você") return "text-blue-600 dark:text-blue-400";
  if (responsavel === "Sistema")
    return "text-neutral-600 dark:text-neutral-300";
  return "text-orange-600 dark:text-orange-400";
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
        className="border-neutral-300"
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
      return (
        <span className="text-muted-foreground">
          {DateFormat(item.data_compra)}
        </span>
      );
    },
  },

  {
    accessorKey: "descricao",
    header: "Descrição",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          <span className="font-bold capitalize">
            {row.getValue("descricao")}
          </span>

          {item.condicao === "Parcelado" && (
            <span className="text-muted-foreground text-xs">
              {item.parcela_atual} de {item.qtde_parcela}
            </span>
          )}

          {item.responsavel === "Sistema" && (
            <span className="text-muted-foreground text-xs">
              <CheckCircle2Icon fill="green" className="text-white" size={15} />
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
              <PartyPopper className="text-emerald-600" size={18} />
            )}
        </div>
      );
    },
  },

  {
    accessorKey: "tipo_transacao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
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
        <Button size="sm" variant={getButtonVariant(item.tipo_transacao)}>
          {item.tipo_transacao}
        </Button>
      );
    },
  },

  {
    accessorKey: "valor",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Valor
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      );
    },

    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className={`capitalize`}>
          <MoneyValues value={row.getValue("valor")} />
        </div>
      );
    },
  },

  {
    accessorKey: "condicao",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          className="p-0"
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
          className="p-0"
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
          className="p-0"
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
        <span className={` ${getResponsavelClass(item.responsavel)}`}>
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
      const logo = getLogo(item);

      return <LogosOnTable logo={logo} descricao={descricao} />;
    },
  },

  {
    id: "actions",
    header: () => <span>Ações</span>,
    cell: ({ row }) => {
      const item = row.original;

      const { isPaid, setIsPaid, showCartao, handleSubmit } = Utils();

      return (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted flex p-0"
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
                  itemImagemURL={item.imagem_url}
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
                    itemImagemURL={item.imagem_url}
                  />
                </DropdownMenuItem>
              )}

              {item.responsavel != "Sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TogglePaymentDialog
                    id={item.id}
                    realizadoAtual={item.realizado}
                    formaPagamento={item.forma_pagamento}
                    onStatusChanged={(novoStatus) => {
                      item.realizado = novoStatus;
                    }}
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

          {item.imagem_url && (
            <div className="flex text-center">
              <FileImage className="stroke-gray-500" size={16} />
            </div>
          )}
        </div>
      );
    },
  },
];
