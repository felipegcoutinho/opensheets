import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { createClient } from "@/utils/supabase/server";
import MonthPicker from "@/components/month-picker/month-picker";
import { Card } from "@/components/ui/card";
import MoneyValues from "@/components/money-values";
import PaymentMethodLogo from "@/components/payment-method-logo";
import {
  RiBankCardLine,
  RiBarcodeLine,
  RiPixLine,
  RiUser2Line,
} from "@remixicon/react";
import { RiMailSendLine } from "@remixicon/react";
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import { getPayersName } from "@/app/actions/pagadores/fetch_pagadores";
import SendEmailButton from "./send-email-button";

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
  const supabase = createClient();

  const [contas, categorias, cards, transactions, payer] = await Promise.all([
    getAccount(),
    getCategorias(),
    getCards(),
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

  return (
    <section className="space-y-4">
      <h1 className="sr-only">Resumo do pagador</h1>

      <MonthPicker />

      {/* Banner superior: pagador + total */}
      <div className="grid gap-3 sm:grid-cols-4">
        <Card className="col-span-4 p-4 sm:col-span-2 lg:col-span-1">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <RiUser2Line aria-hidden /> <span>Pagador</span>
            </span>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold capitalize">
                {payerName}
              </span>
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
              <span className="text-muted-foreground text-sm break-all">
                {payerEmail}
              </span>
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

          {/* Mini breakdown proporcional (barra simples) */}
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
                    <PaymentMethodLogo
                      url_name={`/logos/boleto.svg`}
                      descricao={b.label}
                      width={24}
                      height={24}
                    />
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
                    <span className="truncate">{o.label}</span>
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
        <TableTransaction
          data={list}
          getAccount={contas}
          getCards={cards}
          getCategorias={categorias}
          hidden={false}
        />
      </div>
    </section>
  );
}
