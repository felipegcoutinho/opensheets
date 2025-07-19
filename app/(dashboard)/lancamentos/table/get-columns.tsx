"use client";

import MoneyValues from "@/components/money-values";
import { PaymentMethodLogo } from "@/components/payment-method-logo";
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
  RiAttachmentLine,
  RiBankCardLine,
  RiCalendarCheckFill,
  RiCheckboxCircleFill,
  RiBankLine,
  RiGroupLine,
  RiMessage2Line,
  RiMoreLine,
} from "@remixicon/react";
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
  getAccount,
  getCards,
  getCategorias,
  getPayers,
  hidden,
  DateFormat,
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
    header: "Estabelecimento",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          <span className="font-bold capitalize">
            {row.getValue("descricao")}
          </span>

          {item.forma_pagamento === "boleto" && (
            <Badge variant={"sistema"}>
              {DateFormat(item.data_vencimento)}
            </Badge>
          )}

          {item.condicao === "parcelado" && (
            <Badge variant={"sistema"}>
              {item.parcela_atual} de {item.qtde_parcela}
            </Badge>
          )}

          {item.responsavel === "sistema" && (
            <RiCheckboxCircleFill color="green" size={16} />
          )}

          {item.dividir_lancamento === true && (
            <span className="px-1">
              <TooltipProvider delayDuration={300}>
                <Tooltip>
                  <TooltipTrigger>
                    <RiGroupLine className="text-muted-foreground" size={12} />
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
                  <RiMessage2Line className="text-muted-foreground" size={12} />
                </TooltipTrigger>
                <TooltipContent>{item.anotacao}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          {item.condicao === "parcelado" &&
            item.parcela_atual === item.qtde_parcela && (
              <RiCalendarCheckFill className="text-emerald-600" size={16} />
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
        // <Badge variant={getResponsableStyle(item.responsavel)}>
        //   {item.responsavel}
        //   {item.pagador_id?.role}
        // </Badge>
        <span className="capitalize">
          {item.pagador_id?.role === "principal" ? (
            <Badge variant={"voce"}>Principal</Badge>
          ) : (
            <Badge variant={"outros"}>{item.pagador_id?.nome}</Badge>
          )}
        </span>
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

      const Icon = item.contas
        ? RiBankLine
        : item.cartoes
          ? RiBankCardLine
          : null;

      return (
        <div className="flex items-center gap-2">
          <PaymentMethodLogo
            url_name={`/logos/${logo}`}
            descricao={descricao}
            height={36}
            width={36}
          />
          {Icon && <Icon size={18} className="size-3.5" />}
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
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="data-[state=open]:bg-muted flex"
              >
                <RiMoreLine size={16} />
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
                  itemTipoTransacao={item.tipo_transacao}
                  itemValor={item.valor}
                  itemFormaPagamento={item.forma_pagamento}
                  itemQtdeParcelas={item.qtde_parcela}
                  itemParcelaAtual={item.parcela_atual}
                  itemQtdeRecorrencia={item.qtde_recorrencia}
                  itemCartao={item.cartoes?.descricao}
                  itemConta={item.contas?.descricao}
                  itemPagador={item.pagadores?.nome}
                  itemPaid={item.realizado}
                  itemImagemURL={item.imagem_url}
                  itemCategoriaId={item.categorias?.nome}
                  itemPeriodo={item.periodo}
                />
              </DropdownMenuItem>

              {item.responsavel != "sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <UpdateTransactions
                    item={item}
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
                    itemPaid={item.realizado}
                    itemImagemURL={item.imagem_url}
                    itemCategoriaId={item.categorias?.id}
                    itemCartaoId={item.cartoes?.id}
                    itemContaId={item.contas?.id}
                    itemPagadorId={item.pagadores?.id}
                    getCategorias={getCategorias}
                    getCards={getCards}
                    getAccount={getAccount}
                    getPayers={getPayers}
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
            <RiCheckboxCircleFill className="text-muted" size={16} />
          ) : (
            <TooltipProvider delayDuration={300}>
              <Tooltip>
                <TooltipTrigger>
                  <TogglePaymentDialog
                    onStatusChanged={(novoStatus) => {
                      item.realizado = novoStatus;
                    }}
                    item={item}
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
              <RiAttachmentLine size={16} />
            </div>
          )}
        </div>
      );
    },
  },
];
