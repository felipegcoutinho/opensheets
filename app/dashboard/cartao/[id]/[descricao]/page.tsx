import {
  getCardDetails,
  getCardInvoice,
  getCards,
  getCardSum,
} from "@/actions/cards";
import { getFaturas } from "@/actions/invoices";
import InvoicePaymentDialog from "@/components/Invoice-payment-dialog";
import Numbers from "@/components/numbers";
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
import DetailsTransactions from "@/dashboard/transacao/modal/details-transactions";
import { UseDates } from "@/hooks/use-dates";
import {
  CalendarClockIcon,
  Check,
  CheckCircle2,
  RefreshCw,
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
      value={<Numbers value={item.limite} />}
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
      <div className="text-2xl font-bold">
        <Numbers value={sumCardSum} />
      </div>
    </div>
  </Card>
);

const InfoSection = ({ title, value, subtitle, subvalue }) => (
  <div className="leading-loose">
    <p className="text-muted-foreground text-xs">{title}</p>
    <p className="font-bold">{value}</p>
    <p className="text-muted-foreground text-xs">{subtitle}</p>
    <p className="font-bold">{subvalue}</p>
  </div>
);

const TransactionTable = ({ transactions, dateFormatter }) => {
  const getResponsavelClass = (responsavel) => {
    const classes = {
      Você: "text-blue-600",
      Sistema: "text-neutral-600",
      default: "text-orange-600",
    };
    return classes[responsavel] || classes.default;
  };

  const getTransactionIcon = (condicao) => {
    const icons = {
      Parcelado: <CalendarClockIcon size={12} />,
      Recorrente: <RefreshCw size={12} />,
      Vista: <Check size={12} />,
    };
    return icons[condicao] || null;
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Data</TableHead>
              <TableHead>Descrição</TableHead>
              <TableHead>Transação</TableHead>
              <TableHead>Condição</TableHead>
              <TableHead>Pagamento</TableHead>
              <TableHead>Responsável</TableHead>
              <TableHead>Valor</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {transactions?.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{dateFormatter(item.data_compra)}</TableCell>
                <TableCell>
                  <span className="font-bold">{item.descricao}</span>
                  {item.condicao === "Parcelado" && (
                    <span className="px-1 text-xs text-neutral-400">
                      {`${item.parcela_atual} de ${item.qtde_parcela}`}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    className="h-6"
                    variant={
                      item.tipo_transacao === "Receita"
                        ? "success"
                        : "destructive"
                    }
                  >
                    {item.tipo_transacao}
                  </Button>
                </TableCell>
                <TableCell>
                  <span className="flex items-center gap-1">
                    {getTransactionIcon(item.condicao)}
                    <span className="capitalize">{item.condicao}</span>
                  </span>
                </TableCell>
                <TableCell>{item.forma_pagamento}</TableCell>
                <TableCell>
                  <span
                    className={`font-bold ${getResponsavelClass(item.responsavel)}`}
                  >
                    {item.responsavel}
                  </span>
                </TableCell>
                <TableCell>
                  <Numbers value={item.valor} />
                </TableCell>
                <TableCell>{item.categoria}</TableCell>
                <TableCell>
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
export default async function InvoicePage({ searchParams, params }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const [cardDetails, cardInvoice, cardSum, cards, faturaStatus] =
    await Promise.all([
      getCardDetails(params.id),
      getCardInvoice(month, params.id),
      getCardSum(month, params.id),
      getCards(month),
      getFaturas(month, params.id),
    ]);

  const isPaid = faturaStatus?.some((item) => item.status_pagamento === "Pago");
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

      <Suspense fallback={<div>Carregando transações...</div>}>
        <TransactionTable
          transactions={cardInvoice}
          dateFormatter={DateFormat}
        />
      </Suspense>
    </>
  );
}
