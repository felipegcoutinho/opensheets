import DetailsTransactions from "@/app/(dashboard)/lancamentos/modal/details-transactions";
import { getCardDetails, getCards } from "@/app/services/cartoes";
import { getFaturas } from "@/app/services/faturas";
import { getCardInvoice, getCardSum } from "@/app/services/transacoes";
import InvoicePaymentDialog from "@/components/Invoice-payment-dialog";
import MoneyValues from "@/components/money-values";
import RemovePaymentButton from "@/components/remove-payment-button";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import UseStyles from "@/hooks/use-styles";
import {
  CalendarClockIcon,
  Check,
  CheckCircle2,
  CheckCircle2Icon,
  MessageSquareText,
  PartyPopper,
  RefreshCw,
  Users,
} from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

// Separate components for better organization
const CardStatusIndicator = ({ fatura_status }) => (
  <div className="flex items-center gap-2">
    {fatura_status?.length > 0 && (
      <CheckCircle2 size={24} className="text-green-100" fill="green" />
    )}
  </div>
);

const CardInfo = ({ item, sumCardSum }) => (
  <Card className="mt-4 flex w-full items-center gap-10 px-8 py-6">
    <Image
      quality={100}
      src={`/logos/${item.logo_image}`}
      className="rounded-full shadow-lg"
      width={60}
      height={60}
      alt={`Logo do cartão ${item.descricao}`}
      priority
    />

    <InfoSection
      title="Vencimento"
      value={item.dt_vencimento}
      subtitle="Fechamento"
      subvalue={item.dt_fechamento}
    />

    <InfoSection
      title="Limite Total"
      value={<MoneyValues value={item.limite} />}
      subtitle="Conta Padrão"
      subvalue={item.contas.descricao}
    />

    <InfoSection
      title="Tipo do Cartão"
      value={`Cartão ${item.tipo}`}
      subtitle="Bandeira"
      subvalue={
        <Image
          quality={100}
          src={`/bandeiras/${item.bandeira}`}
          className="rounded-full"
          width={40}
          height={40}
          alt="Bandeira do cartão"
          priority
        />
      }
    />

    {item.anotacao && (
      <div className="leading-loose">
        <p className="text-sm font-medium">Notas:</p>
        <p className="text-lg">{item.anotacao}</p>
      </div>
    )}

    <div className="ml-auto">
      <p className="text-sm font-medium">Total da Fatura</p>
      <div className="text-2xl">
        <MoneyValues value={sumCardSum} />
      </div>
    </div>
  </Card>
);

const InfoSection = ({ title, value, subtitle, subvalue }) => (
  <div className="leading-loose">
    <p className="text-muted-foreground text-xs">{title}</p>
    <p>{value}</p>
    <p className="text-muted-foreground text-xs">{subtitle}</p>
    <p>{subvalue}</p>
  </div>
);

const TransactionTable = ({ transactions, dateFormatter }) => {
  const getResponsavelClass = (responsavel) => {
    const classes = {
      você: "text-blue-600",
      sistema: "text-neutral-600",
      default: "text-orange-600",
    };
    return classes[responsavel] || classes.default;
  };

  const getTransactionIcon = (condicao) => {
    const icons = {
      parcelado: <CalendarClockIcon size={12} />,
      recorrente: <RefreshCw size={12} />,
      vista: <Check size={12} />,
    };
    return icons[condicao] || null;
  };

  const { getButtonVariant } = UseStyles();

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Lançamentos</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Transação</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Condição</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions?.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="text-muted-foreground">
                  {dateFormatter(item.data_compra)}
                </TableCell>

                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="font-bold capitalize">
                      {item.descricao}
                    </span>

                    {item.condicao === "parcelado" && (
                      <span className="text-muted-foreground text-xs">
                        {item.parcela_atual} de {item.qtde_parcela}
                      </span>
                    )}

                    {item.responsavel === "sistema" && (
                      <span className="text-muted-foreground text-xs">
                        <CheckCircle2Icon
                          fill="green"
                          className="text-white"
                          size={15}
                        />
                      </span>
                    )}

                    {item.dividir_lancamento === true && (
                      <span className="px-1">
                        <TooltipProvider delayDuration={300}>
                          <Tooltip>
                            <TooltipTrigger>
                              <Users
                                className="text-muted-foreground"
                                size={12}
                              />
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
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    variant={getButtonVariant(item.tipo_transacao)}
                  >
                    {item.tipo_transacao}
                  </Button>
                </TableCell>

                <TableCell>
                  <MoneyValues value={item.valor} />
                </TableCell>

                <TableCell>
                  <span className="flex items-center gap-1">
                    {getTransactionIcon(item.condicao)}
                    <span>{item.condicao}</span>
                  </span>
                </TableCell>

                <TableCell>{item.forma_pagamento}</TableCell>

                <TableCell>
                  <span className={`${getResponsavelClass(item.responsavel)}`}>
                    {item.responsavel}
                  </span>
                </TableCell>

                <TableCell>
                  <span className="lowercase">{item.categorias?.nome}</span>
                </TableCell>

                <TableCell>
                  <DetailsTransactions
                    itemId={item.id}
                    itemPeriodo={item.periodo}
                    itemNotas={item.anotacao}
                    itemDate={item.data_compra}
                    itemDescricao={item.descricao}
                    itemCategoriaId={item.categorias?.nome}
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
                    itemPaid={item.realizado}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Main page component using Server Component
export default async function page({ searchParams, params }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const search = await searchParams;
  const { id } = await params;
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = search?.periodo ?? defaultPeriodo;

  const [cardDetails, cardInvoice, cardSum, cards, faturaStatus] =
    await Promise.all([
      getCardDetails(id),
      getCardInvoice(month, id),
      getCardSum(month, id),
      getCards(month),
      getFaturas(month, id),
    ]);

  const isPaid = faturaStatus?.some((item) => item.status_pagamento === "pago");
  const statusClassName = isPaid
    ? "border-green-500 bg-green-50 dark:bg-green-900"
    : "border-orange-500 bg-orange-50 dark:bg-orange-900";

  return (
    <>
      <Card className={`mt-4 rounded border-none p-2 ${statusClassName}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardStatusIndicator fatura_status={faturaStatus} />
            {cardDetails?.map((item) => (
              <InvoicePaymentDialog
                key={item.id}
                fatura_status={faturaStatus}
                month={month}
                cartao_id={item.id}
                descricao={item.descricao}
                valor={cardSum}
              />
            ))}
          </div>
          <RemovePaymentButton fatura_status={faturaStatus} />
        </div>
      </Card>

      {cardDetails?.map((item) => (
        <CardInfo key={item.id} item={item} sumCardSum={cardSum} />
      ))}

      <Suspense fallback={<div>Carregando Lançamentos...</div>}>
        <TransactionTable
          transactions={cardInvoice}
          dateFormatter={DateFormat}
        />
      </Suspense>
    </>
  );
}
