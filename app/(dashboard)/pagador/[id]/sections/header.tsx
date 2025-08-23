import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import { Card } from "@/components/ui/card";
import {
  RiBankCardLine,
  RiBarcodeLine,
  RiMailSendLine,
  RiPixLine,
  RiUser2Line,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import SendEmailButton from "../send-email-button";
import { getPayersName } from "@/app/actions/pagadores/fetch_pagadores";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import {
  Transaction,
  aggregateByBoleto,
  aggregateByCard,
  aggregateByOtherMethods,
} from "../aggregations";

export default async function PayerHeaderSection({ id, month }: { id: string; month: string }) {
  const [transactions, payer] = await Promise.all([
    getTransactionsByPayer(month, id),
    getPayersName(id),
  ]);

  const list: Transaction[] = Array.isArray(transactions) ? transactions : [];

  const { items: cardsSummary, total: cardsTotal } = aggregateByCard(list);
  const { items: boletosSummary, total: boletosTotal } = aggregateByBoleto(list);
  const { items: outrosSummary, total: outrosTotal } = aggregateByOtherMethods(list);
  const totalGeral = cardsTotal + boletosTotal + outrosTotal;

  const payerName = payer?.nome || list[0]?.pagadores?.nome || "—";
  const payerEmail = payer?.email || list[0]?.pagadores?.email || "";
  const lastMailISO: string | null = (payer as any)?.last_mail ?? null;
  const lastMailLabel = (() => {
    if (!lastMailISO) return null;
    try {
      const d = new Date(String(lastMailISO));
      if (Number.isNaN(d.getTime())) return String(lastMailISO);
      const fmt = new Intl.DateTimeFormat("pt-BR", {
        timeZone: "America/Sao_Paulo",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      return fmt.format(d);
    } catch {
      return String(lastMailISO);
    }
  })();

  return (
    <div className="grid gap-3 sm:grid-cols-4">
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-1">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <RiUser2Line aria-hidden /> <span>Pagador</span>
          </span>
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold capitalize">{payerName}</span>
            {payer?.role === "principal" && (
              <RiVerifiedBadgeFill className="text-blue-500" size={16} />
            )}
            {payer?.is_auto_send && (
              <RiMailSendLine
                size={16}
                className="text-primary"
                title="Envio automático ativo"
                aria-label="Envio automático de e-mail ativo"
              />
            )}
          </div>
          {payerEmail ? (
            <div className="text-muted-foreground text-sm break-all">
              <span>{payerEmail}</span>
              {lastMailLabel && (
                <span className="bg-muted ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]">
                  Último e-mail: {lastMailLabel}
                </span>
              )}
            </div>
          ) : null}
        </div>

        <div>
          <SendEmailButton
            payerId={id}
            month={month}
            payerName={payerName}
            payerEmail={payerEmail}
            total={totalGeral}
            preview={list.slice(0, 5).map((t) => ({
              descricao: t.descricao || "",
              valor: t.valor,
              data_compra: t.data_compra || "",
            }))}
          />
        </div>
      </Card>

      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-3">
        <div className="text-muted-foreground text-xs">Total no mês</div>
        <div className="mt-2 text-3xl leading-tight font-bold">
          <MoneyValues value={totalGeral} />
        </div>

        <div className="mt-3">
          <div className="bg-muted h-2 w-full overflow-hidden rounded">
            {totalGeral > 0 && (
              <div className="flex h-full w-full">
                <div
                  className="h-full bg-indigo-500/80 dark:bg-indigo-400"
                  style={{ width: `${(cardsTotal / totalGeral) * 100}%` }}
                  aria-label="Proporção Cartão"
                  title="Cartão"
                />
                <div
                  className="h-full bg-amber-500/80 dark:bg-amber-400"
                  style={{ width: `${(boletosTotal / totalGeral) * 100}%` }}
                  aria-label="Proporção Boleto"
                  title="Boleto"
                />
                <div
                  className="h-full bg-emerald-500/80 dark:bg-emerald-400"
                  style={{ width: `${(outrosTotal / totalGeral) * 100}%` }}
                  aria-label="Proporção Pix/Dinheiro/Débito"
                  title="Pix/Dinheiro/Débito"
                />
              </div>
            )}
          </div>
          <div className="text-muted-foreground mt-2 flex flex-wrap gap-3 text-xs">
            <span>
              Cartão: <MoneyValues value={cardsTotal} />
            </span>
            <span>
              Boleto: <MoneyValues value={boletosTotal} />
            </span>
            <span>
              Pix/Dinheiro/Débito: <MoneyValues value={outrosTotal} />
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}

