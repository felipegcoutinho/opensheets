"use client";

import { LogosOnTable } from "@/components/logos-on-table";
import MoneyValues from "@/components/money-values";
import TogglePaymentDialog from "@/components/toggle-payment-dialog";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import UseStyles from "@/hooks/use-styles";
import {
  CheckCircle2Icon,
  EllipsisVertical,
  FileImage,
  MessageSquareText,
  PartyPopper,
  Users,
} from "lucide-react";
import DeleteTransactions from "../modal/delete-transactions";
import DetailsTransactions from "../modal/details-transactions";
import UpdateTransactions from "../modal/update-transactions";

const {
  getResponsableStyle,
  getConditionIcon,
  getPaymentIcon,
  getBadgeStyle,
  getDescricao,
  getLogo,
} = UseStyles();

export const getColumns = (
  getAccountMap,
  getCardsMap,
  getCategorias,
  DateFormat,
  hidden,
) => [
  {
    id: "selection",
    header: ({ table }) => (
      <input
        hidden={hidden}
        type="checkbox"
        checked={table.getIsAllPageRowsSelected()}
        onChange={table.getToggleAllPageRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        hidden={hidden}
        className="border-input"
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
        <span className="text-muted-foreground text-sm">
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
            <CheckCircle2Icon color="green" size={16} />
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
      return <span>Transação</span>;
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={getBadgeStyle(item.tipo_transacao)}>
          {item.tipo_transacao}
        </Badge>
      );
    },
  },

  {
    accessorKey: "valor",
    header: ({ column }) => {
      return <span>Valor</span>;
    },

    cell: ({ row }) => {
      const item = row.original;
      return <MoneyValues value={item.valor} />;
    },
  },

  {
    accessorKey: "condicao",
    header: ({ column }) => {
      return <span>Condição</span>;
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
      return <span>Forma de Pagamento</span>;
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <span className="flex items-center gap-1">
          {getPaymentIcon(item.forma_pagamento)}
          <span className="lowercase">{item.forma_pagamento}</span>
        </span>
      );
    },
  },

  {
    accessorKey: "responsavel",
    header: ({ column }) => {
      return <span>Responsável</span>;
    },
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Badge variant={getResponsableStyle(item.responsavel)}>
          {item.responsavel}
        </Badge>
      );
    },
  },

  {
    id: "categoria",
    accessorFn: (row) => row.categorias?.nome,
    header: "Categoria",
    enableHiding: true,
    cell: () => null,
  },

  {
    id: "conta_cartao",
    accessorFn: (row) => getDescricao(row),
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

      return (
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted flex"
              >
                <EllipsisVertical size={16} />
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

          {item.responsavel === "sistema" ? (
            <CheckCircle2Icon className="text-muted" size={16} />
          ) : (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
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
                </TooltipTrigger>
                <TooltipContent>
                  {item.realizado ? (
                    <span>
                      Pagamento realizado, deseja <strong>desfazer</strong>?
                    </span>
                  ) : (
                    <span>
                      Pagamento pendente, deseja <strong>pagar</strong>?
                    </span>
                  )}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {item.imagem_url && (
            <div className="flex text-center">
              <FileImage size={16} />
            </div>
          )}
        </div>
      );
    },
  },
];
