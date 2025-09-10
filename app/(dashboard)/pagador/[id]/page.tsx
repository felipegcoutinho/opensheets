import { getPayersName } from "@/app/actions/pagadores/fetch_pagadores";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import MoneyValues from "@/components/money-values";
import MonthPicker from "@/components/month-picker/month-picker";
import PaymentMethodLogo from "@/components/payment-method-logo";
import PayerHeaderFallback from "@/components/fallbacks/payer-header-fallback";
import TransactionTableFallback from "@/components/fallbacks/transaction-table-fallback";
import { getMonth } from "@/hooks/get-month";
import { RiBankCardLine, RiBarcodeLine, RiPixLine } from "@remixicon/react";
import { Suspense } from "react";
import PayerHeaderSection from "./sections/header";
import PayerTableSection from "./sections/table";

// Tipagens auxiliares
type PageProps = {
  searchParams?: Record<string, string | string[] | undefined>;
  params: Promise<{ id: string }>;
};

import {
  Transaction,
  aggregateByBoleto,
  aggregateByCard,
  aggregateByOtherMethods,
} from "./aggregations";
import { SectionCard, SummaryRow } from "./summary-ui";

// =======================
// Página
// =======================
export default async function Page({ searchParams, params }: PageProps) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const [transactions, payer] = await Promise.all([
    getTransactionsByPayer(month, id),
    getPayersName(id),
  ]);

  const list: Transaction[] = Array.isArray(transactions) ? transactions : [];

  // Agregações
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
      // Força formatação no fuso de São Paulo
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
    <section className="space-y-4">
      <h1 className="sr-only">Resumo do pagador</h1>

      <MonthPicker />

      <Suspense fallback={<PayerHeaderFallback />}>
        <PayerHeaderSection id={id} month={month} />
      </Suspense>

      {/* Resumos */}
      <div className="grid gap-3 md:grid-cols-3">
        <SectionCard
          title="Cartão"
          icon={<RiBankCardLine aria-hidden />}
          total={cardsTotal}
        >
          {cardsSummary.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              Sem despesas em cartão.
            </p>
          ) : (
            cardsSummary.map((c) => (
              <SummaryRow
                key={c.key}
                left={
                  <span className="flex min-w-0 items-center gap-2">
                    {c.logo_image ? (
                      <PaymentMethodLogo
                        url_name={`/logos/${c.logo_image}`}
                        descricao={c.descricao}
                        width={24}
                        height={24}
                      />
                    ) : (
                      <span
                        className="bg-muted inline-block h-6 w-6 rounded"
                        aria-hidden
                      />
                    )}
                  </span>
                }
                right={<MoneyValues value={c.total} />}
              />
            ))
          )}
        </SectionCard>

        <SectionCard
          title="Boleto"
          icon={<RiBarcodeLine aria-hidden />}
          total={boletosTotal}
        >
          {boletosSummary.length === 0 ? (
            <p className="text-muted-foreground text-sm">Sem boletos.</p>
          ) : (
            boletosSummary.map((b) => (
              <SummaryRow
                key={`boleto-${b.key}`}
                left={
                  <span className="flex min-w-0 items-center gap-2">
                    <RiBarcodeLine size={24} />
                    <span className="capitalize">{b.label}</span>
                  </span>
                }
                right={<MoneyValues value={b.total} />}
              />
            ))
          )}
        </SectionCard>

        <SectionCard
          title="Pix/Dinheiro/Débito"
          icon={<RiPixLine aria-hidden />}
          total={outrosTotal}
        >
          {outrosSummary.length === 0 ? (
            <p className="text-muted-foreground text-sm">Sem movimentos.</p>
          ) : (
            outrosSummary.map((o) => (
              <SummaryRow
                key={`outros-${o.key}`}
                left={
                  <span className="flex min-w-0 items-center gap-2 capitalize">
                    {o.key === "pix" ? (
                      <PaymentMethodLogo
                        url_name={`/logos/pix.png`}
                        descricao="Pix"
                        width={24}
                        height={24}
                      />
                    ) : (
                      <span
                        className="bg-muted inline-block h-6 w-6 rounded"
                        aria-hidden
                      />
                    )}
                  </span>
                }
                right={<MoneyValues value={o.total} />}
              />
            ))
          )}
        </SectionCard>
      </div>

      {/* Tabela de transações */}
      <div>
        <Suspense fallback={<TransactionTableFallback rows={10} />}>
          <PayerTableSection id={id} month={month} />
        </Suspense>
      </div>
    </section>
  );
}
