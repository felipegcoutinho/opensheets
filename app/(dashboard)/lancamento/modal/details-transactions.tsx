"use client";

import type { BudgetRuleBucket } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { formatBucketLabel } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import MoneyValues from "@/components/money-values";
import BadgeSystem from "@/components/payer-badge";
import Timeline from "@/components/timeline-orders";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { UseDates } from "@/hooks/use-dates";
import UseStyles from "@/hooks/use-styles";
import UtilitiesLancamento, {
  calcularMesFinal,
  formatPeriodoLabel,
} from "../utilities-lancamento";
import ViewImage from "./view-image";

type TransactionCondition =
  | "vista"
  | "parcelado"
  | "recorrente"
  | (string & {});
type TransactionType = "receita" | "despesa" | (string & {});

type DetailsTransactionsProps = {
  itemId: number | string;
  itemCondicao: TransactionCondition;
  itemDescricao: string;
  itemNotas?: string | null;
  itemDate: string;
  itemResponsavel?: string | null;
  itemResponsavelRole?: string | null;
  itemResponsavelFoto?: string | null;
  itemTipoTransacao: TransactionType;
  itemValor: number | string;
  itemFormaPagamento: string;
  itemCartao?: string | null;
  itemConta?: string | null;
  itemQtdeParcelas?: number | null;
  itemParcelaAtual?: number | null;
  itemPeriodo?: string | null;
  itemQtdeRecorrencia?: number | null;
  itemPaid: boolean;
  itemImagemURL?: string | null;
  itemCategoriaId?: string | null;
  itemRegra502030Tipo?: string | null;
  children?: React.ReactNode;
};

export default function DetailsTransactions({
  itemId,
  itemCondicao,
  itemDescricao,
  itemNotas,
  itemDate,
  itemResponsavel,
  itemResponsavelRole,
  itemResponsavelFoto,
  itemTipoTransacao,
  itemValor,
  itemFormaPagamento,
  itemCartao,
  itemConta,
  itemQtdeParcelas,
  itemParcelaAtual,
  itemPeriodo,
  itemQtdeRecorrencia,
  itemPaid,
  itemImagemURL,
  itemCategoriaId,
  itemRegra502030Tipo,
  children,
}: DetailsTransactionsProps) {
  const { isOpen, setIsOpen } = UtilitiesLancamento();

  const { DateFormat } = UseDates();

  const { getPaymentIcon, getPayerRoleBadgeColor, getTransactionBadgeColor } =
    UseStyles();

  const handleDialogClose = (val: boolean) => {
    setIsOpen(val);
  };

  const valorNumerico = Number(itemValor) || 0;
  const totalParcelas = Number(itemQtdeParcelas ?? 0);
  const parcelaAtual = Number(itemParcelaAtual ?? 0);
  const parcelasRestantes = Math.max(totalParcelas - parcelaAtual, 0);
  const parcelaRestante =
    itemCondicao === "parcelado" ? valorNumerico * parcelasRestantes : 0;

  const resolveFotoSrc = (f?: string | null) => {
    if (!f) return undefined;
    if (f.startsWith("http")) return f;
    if (f.startsWith("/")) return f;
    return `/avatars/${f}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogTrigger asChild>
        {children ?? <span className="cursor-pointer">detalhes</span>}
      </DialogTrigger>

      <DialogContent className="p-0 sm:max-w-xl">
        <Card className="gap-2 space-y-4">
          <CardHeader className="flex flex-row items-start border-b">
            <div>
              <DialogTitle className="group flex items-center gap-2 text-lg">
                #{itemId}
              </DialogTitle>
              <CardDescription>{DateFormat(itemDate)}</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="text-sm">
            <div className="grid gap-2">
              <ul className="grid gap-3">
                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Descrição</span>
                  <span className="capitalize">{itemDescricao}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Período</span>
                  <span className="capitalize">
                    {formatPeriodoLabel(itemPeriodo)}
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Forma de Pagamento
                  </span>

                  <span className="flex items-center gap-1">
                    {getPaymentIcon(itemFormaPagamento)}
                    <span className="capitalize">{itemFormaPagamento}</span>
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    {itemCartao ? "Cartão" : "Conta"}
                  </span>
                  <span className="capitalize">{itemCartao ?? itemConta}</span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Categoria</span>
                  <span className="capitalize">{itemCategoriaId ?? "—"}</span>
                </li>

                {itemRegra502030Tipo ? (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Regra 50/30/20
                    </span>
                    <span className="capitalize">
                      {formatBucketLabel(
                        itemRegra502030Tipo as BudgetRuleBucket,
                      )}
                    </span>
                  </li>
                ) : null}

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Tipo de Transação
                  </span>
                  <span className="capitalize">
                    <BadgeSystem
                      label={itemTipoTransacao}
                      color={getTransactionBadgeColor(itemTipoTransacao)}
                    />
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Condição</span>
                  {itemCondicao === "vista" ? "à vista" : itemCondicao}
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Responsável</span>
                  <span className="flex items-center gap-2 capitalize">
                    <Avatar className="size-6">
                      {resolveFotoSrc(itemResponsavelFoto) ? (
                        <AvatarImage
                          src={resolveFotoSrc(itemResponsavelFoto)}
                          alt={itemResponsavel ?? "Pagador"}
                        />
                      ) : null}
                      <AvatarFallback>
                        {(itemResponsavel?.[0] ?? "P").toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <BadgeSystem
                      label={itemResponsavel ?? "Não informado"}
                      color={getPayerRoleBadgeColor(
                        itemResponsavelRole ?? undefined,
                      )}
                    />
                  </span>
                </li>

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="capitalize">
                    {itemPaid ? "Pago" : "Pendente"}
                  </span>
                </li>

                {itemNotas && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">Notas</span>
                    <span className="capitalize">{itemNotas}</span>
                  </li>
                )}

                <ViewImage itemImagemURL={itemImagemURL} />
              </ul>

              <ul className="mb-6 grid gap-3">
                {itemCondicao === "parcelado" && (
                  <Timeline
                    DataCompra={itemDate}
                    ParcelaAtual={parcelaAtual}
                    QtdeParcela={totalParcelas}
                    DataFim={calcularMesFinal(
                      itemPeriodo,
                      totalParcelas,
                      parcelaAtual,
                    )}
                  />
                )}

                <Separator className="my-2" />

                <li className="flex items-center justify-between">
                  <span className="text-muted-foreground">
                    Valor {itemCondicao === "parcelado" && "da Parcela"}
                  </span>
                  <span>
                    <MoneyValues value={valorNumerico} />
                  </span>
                </li>
                {itemCondicao === "parcelado" && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Valor Restante
                    </span>
                    <span>
                      <MoneyValues value={parcelaRestante} />
                    </span>
                  </li>
                )}
                {itemCondicao === "recorrente" && (
                  <li className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Quantidade de Recorrências
                    </span>
                    <span className="capitalize">
                      {itemQtdeRecorrencia ?? 0} meses
                    </span>
                  </li>
                )}
                {itemCondicao !== "parcelado" && <Separator className="my-2" />}
                <li className="flex items-center justify-between font-semibold">
                  <span className="text-muted-foreground">Total da Compra</span>
                  <span className="text-lg">
                    {itemCondicao === "parcelado" ? (
                      <MoneyValues value={valorNumerico * totalParcelas} />
                    ) : (
                      <MoneyValues value={valorNumerico} />
                    )}
                  </span>
                </li>
              </ul>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button className="w-full" type="button">
                  Entendi
                </Button>
              </DialogClose>
            </DialogFooter>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
