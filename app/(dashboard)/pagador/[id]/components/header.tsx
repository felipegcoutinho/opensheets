import { getPayersName } from "@/app/actions/pagadores/fetch_pagadores";
import {
  getPayerExpenseTotalsByPeriods,
  getTransactionsByPayer,
} from "@/app/actions/transactions/fetch_transactions";
import MoneyValues from "@/components/money-values";
import { Card } from "@/components/ui/card";
import { UseDates } from "@/hooks/use-dates";
import {
  RiMailSendLine,
  RiUser2Line,
  RiVerifiedBadgeFill,
} from "@remixicon/react";
import { promises as fs } from "fs";
import path from "path";
import UpdatePayer from "../../modal/update-payer";
import {
  Transaction,
  aggregateByBoleto,
  aggregateByCard,
  aggregateByOtherMethods,
} from "../aggregations";
import SendEmailButton from "../send-email-button";
import LastSixChart from "./last-six-chart";

export default async function PayerHeaderSection({
  id,
  month,
}: {
  id: string;
  month: string;
}) {
  const [transactions, payer] = await Promise.all([
    getTransactionsByPayer(month, id),
    getPayersName(id),
  ]);

  const rawList = Array.isArray(transactions) ? transactions : [];
  const list: Transaction[] = rawList.map((t: any) => ({
    ...t,
    cartoes: Array.isArray(t?.cartoes) ? t.cartoes[0] : t.cartoes,
    contas: Array.isArray(t?.contas) ? t.contas[0] : t.contas,
  }));

  const { items: cardsSummary, total: cardsTotal } = aggregateByCard(list);
  const { items: boletosSummary, total: boletosTotal } =
    aggregateByBoleto(list);
  const { items: outrosSummary, total: outrosTotal } =
    aggregateByOtherMethods(list);
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

  // Carrega avatares para o modal de edição
  const avatars = await (async () => {
    try {
      const dir = path.join(process.cwd(), "public", "avatars");
      const files = await fs.readdir(dir);
      return files.filter((f) => /\.(png|jpg|jpeg|svg|webp)$/i.test(f));
    } catch {
      return [] as string[];
    }
  })();

  return (
    <div className="grid gap-3 sm:grid-cols-6">
      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
        <div className="text-muted-foreground flex items-center justify-between text-xs">
          <span className="flex items-center gap-1">
            <RiUser2Line aria-hidden /> <span>Pagador</span>
          </span>
          {payer?.id ? (
            <UpdatePayer
              item={{
                id: payer.id,
                nome: payerName,
                email: payerEmail,
                status: payer?.status || "ativo",
                role: payer?.role,
                anotacao: (payer as any)?.anotacao,
                foto: payer?.foto,
                is_auto_send: payer?.is_auto_send,
              }}
              avatars={avatars}
            />
          ) : null}
        </div>

        <div className="mt-2 flex flex-col gap-1">
          <div className="flex items-center gap-1">
            <span className="text-lg font-semibold capitalize">
              {payerName}
            </span>
            {payer?.role === "principal" && (
              <RiVerifiedBadgeFill className="text-blue-500" size={16} />
            )}
            {payer?.is_auto_send && (
              <RiMailSendLine
                size={16}
                className="text-primary"
                aria-hidden
              />
            )}
          </div>
          {payerEmail ? (
            <div className="text-muted-foreground text-sm break-all">
              <span>{payerEmail}</span>
              {lastMailLabel && (
                <span className="bg-muted ml-2 inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[11px]">
                  Último resumo enviado: {lastMailLabel}
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

      <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
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

      {/* Card: Últimos 6 meses (total por mês) */}
      <LastSixMonthsCard id={id} currentMonth={month} />
    </div>
  );
}

async function LastSixMonthsCard({
  id,
  currentMonth,
}: {
  id: string;
  currentMonth: string;
}) {
  const { getLastSixMonths } = UseDates();
  const periods = getLastSixMonths(currentMonth);

  // Busca agregada: totais de despesas por período em única consulta
  const monthlyTotals = await getPayerExpenseTotalsByPeriods(periods, id);

  const formatMonth = (periodo: string) => {
    const [mes] = String(periodo).split("-");
    return mes.slice(0, 3);
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(n);

  return (
    <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-2">
      <div className="text-muted-foreground text-xs">Últimos 6 meses</div>
      <div className="mt-1">
        <LastSixChart
          data={monthlyTotals.map((m) => ({
            month: formatMonth(m.periodo),
            total: m.total,
          }))}
        />
      </div>
    </Card>
  );
}
