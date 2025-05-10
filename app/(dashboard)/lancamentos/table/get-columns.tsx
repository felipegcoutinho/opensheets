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
  CheckCircle2Icon,
  Ellipsis,
  FileImage,
  MessageSquareText,
  PartyPopper,
  Users,
} from "lucide-react";
import DeleteTransactions from "../modal/delete-transactions";
import DetailsTransactions from "../modal/details-transactions";
import UpdateTransactions from "../modal/update-transactions";
import Utils from "../utils-transacao";

const { getButtonVariant, getResponsavelClass, getConditionIcon } = UseStyles();

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

export const getColumns = (
  getAccountMap,
  getCardsMap,
  getCategorias,
  DateFormat,
) => [
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

          {item.forma_pagamento === "boleto" && (
            <span className="text-muted-foreground text-xs">
              vence {DateFormat(item.data_vencimento)}
            </span>
          )}

          {item.condicao === "parcelado" && (
            <span className="text-muted-foreground text-xs">
              {item.parcela_atual} de {item.qtde_parcela}
            </span>
          )}

          {item.responsavel === "sistema" && (
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

          {item.anotacao != "" && item.responsavel != "sistema" && (
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

          {item.condicao === "parcelado" &&
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
          {getConditionIcon(item.condicao)}
          <span className="lowercase">{row.getValue("condicao")}</span>
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
        <span className="lowercase">{row.getValue("forma_pagamento")}</span>
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
        <span className={`${getResponsavelClass(item.responsavel)}`}>
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
                  itemNotas={item.anotacao}
                  itemDate={item.data_compra}
                  itemDescricao={item.descricao}
                  itemCondicao={item.condicao}
                  itemResponsavel={item.responsavel}
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemParcelaAtual={item.parcela_atual}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
                  itemConta={item.contas?.descricao}
                  itemPaid={item.realizado}
                  itemImagemURL={item.imagem_url}
                  itemCategoriaId={item.categorias?.nome}
                  itemPeriodo={item.periodo}
                />
              </DropdownMenuItem>

              {item.responsavel != "sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <UpdateTransactions
                    itemId={item.id}
                    itemPeriodo={item.periodo}
                    itemNotas={item.anotacao}
                    itemDate={item.data_compra}
                    itemDescricao={item.descricao}
                    itemCondicao={item.condicao}
                    itemResponsavel={item.responsavel}
                    itemTipoTransacao={item.tipo_transacao}
                    itemValor={item.valor}
                    itemFormaPagamento={item.forma_pagamento}
                    itemQtdeParcelas={item.qtde_parcela}
                    itemQtdeRecorrencia={item.qtde_recorrencia}
                    itemPaid={item.realizado}
                    itemImagemURL={item.imagem_url}
                    itemCategoriaId={item.categorias?.id}
                    getCategorias={getCategorias}
                  />
                </DropdownMenuItem>
              )}

              {item.responsavel != "sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <TogglePaymentDialog
                    id={item.id}
                    cartaoId={item.cartoes?.id}
                    periodo={item.periodo}
                    cartoDescricao={item.cartoes?.descricao}
                    realizadoAtual={item.realizado}
                    formaPagamento={item.forma_pagamento}
                    onStatusChanged={(novoStatus) => {
                      item.realizado = novoStatus;
                    }}
                  />
                </DropdownMenuItem>
              )}

              {item.responsavel != "sistema" && (
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
