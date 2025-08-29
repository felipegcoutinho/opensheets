"use client";
import MoneyValues from "@/components/money-values";
import BadgeSystem from "@/components/payer-badge";
import PaymentMethodLogo from "@/components/payment-method-logo";
import TogglePaymentDialog from "@/components/toggle-payment-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
  RiBankLine,
  RiCalendarCheckFill,
  RiCheckboxCircleFill,
  RiGroupLine,
  RiMessage2Line,
  RiMoreLine,
} from "@remixicon/react";
import Link from "next/link";
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
  getTransactionBadgeColor,
  getPayerRoleBadgeColor,
  getSystemBadgeColor,
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
    header: "Estabelecimento",
    cell: ({ row }) => {
      const item = row.original;
      return (
        <div className="flex items-center gap-1">
          <span className="font-bold capitalize">
            {row.getValue("descricao")}
          </span>

          {item.forma_pagamento === "boleto" && (
            <BadgeSystem
              label={DateFormat(item.data_vencimento)}
              color={getSystemBadgeColor()}
            />
          )}

          {item.condicao === "parcelado" && (
            <Badge variant={"outline"}>
              {item.parcela_atual} de {item.qtde_parcela}
            </Badge>
          )}

          {item.pagadores?.role === "sistema" && (
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

          {item.anotacao != "" && item.pagadores?.role != "sistema" && (
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
              <RiCalendarCheckFill color="green" size={16} />
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
        <BadgeSystem
          label={item.tipo_transacao}
          color={getTransactionBadgeColor(item.tipo_transacao)}
        />
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
          {item.condicao === "vista" ? "à vista" : row.getValue("condicao")}
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
    accessorFn: (row) => row.pagadores?.nome,
    header: () => <span>Pagador</span>,
    cell: ({ row }) => {
      const item = row.original;
      const pagador = item.pagadores;

      if (!pagador) {
        return null;
      }

      const nome = pagador.nome ?? "";
      const role = pagador.role ?? "";
      const foto = pagador.foto as string | undefined;

      const resolveFotoSrc = (f?: string) => {
        if (!f) return undefined;
        if (f.startsWith("http")) return f;
        if (f.startsWith("/")) return f;
        return `/avatars/${f}`;
      };

      const src = resolveFotoSrc(foto);

      const content = (
        <span className="flex items-center gap-1">
          <Avatar className="size-6">
            {src ? <AvatarImage src={src} alt={nome || "Pagador"} /> : null}
            <AvatarFallback>{(nome?.[0] || "P").toUpperCase()}</AvatarFallback>
          </Avatar>
          <BadgeSystem label={nome} color={getPayerRoleBadgeColor(role)} />
        </span>
      );

      if (role === "sistema" || !pagador.id) {
        return content;
      }

      return (
        <Link href={`/pagador/${pagador.id}`} className="hover:underline">
          {content}
        </Link>
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

      const href = item.contas?.id
        ? `/conta/${item.contas.id}`
        : item.cartoes?.id
          ? `/cartao/${item.cartoes.id}`
          : null;

      if (!href) {
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
      }

      return (
        <Link href={href} className="flex items-center gap-2 hover:underline">
          <PaymentMethodLogo
            url_name={`/logos/${logo}`}
            descricao={descricao}
            height={32}
            width={32}
          />
          {Icon && <Icon size={18} className="size-3.5" />}
        </Link>
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
                  itemResponsavel={item.pagadores?.nome}
                  itemResponsavelRole={item.pagadores?.role}
                  itemResponsavelFoto={item.pagadores?.foto}
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

              {item.pagadores?.role != "sistema" && (
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <UpdateTransactions
                    item={item}
                    itemId={item.id}
                    itemPeriodo={item.periodo}
                    itemNotas={item.anotacao}
                    itemDate={item.data_compra}
                    itemDescricao={item.descricao}
                    itemCondicao={item.condicao}
                    itemTipoTransacao={item.tipo_transacao}
                    itemValor={item.valor}
                    itemFormaPagamento={item.forma_pagamento}
                    itemPaid={item.realizado}
                    itemImagemURL={item.imagem_url}
                    itemCategoriaId={item.categorias?.id}
                    getCategorias={getCategorias}
                    itemCartaoId={item.cartoes?.id}
                    itemContaId={item.contas?.id}
                    itemResponsavel={item.pagadores?.nome}
                    getCards={getCardsMap}
                    getAccount={getAccountMap}
                  />
                </DropdownMenuItem>
              )}

              {item.pagadores?.role != "sistema" && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <DeleteTransactions
                      itemResponsavel={item.pagadores?.nome}
                      itemId={item.id}
                    />
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {item.pagadores?.role === "sistema" ? (
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
