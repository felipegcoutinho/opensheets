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
import { getMonth } from "@/hooks/get-month";
import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import { getTransactionsByPayer } from "@/app/actions/transactions/fetch_transactions";
import { getPayersName } from "@/app/actions/pagadores/fetch_pagadores";

export default async function Page({ searchParams, params }) {
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

  const list = transactions || [];

  // Resumo por cartão (cartão de crédito)
  type CardAgg = {
    descricao: string;
    logo_image?: string | null;
    total: number;
  };
  const cardMap = new Map<string, CardAgg>();
  let cardsTotal = 0;
  list
    .filter(
      (t) =>
        t.tipo_transacao === "despesa" &&
        t.forma_pagamento === "cartão de crédito",
    )
    .forEach((t) => {
      const id = t.cartoes?.id || `outro-${t.cartoes?.descricao || "cartao"}`;
      const desc = t.cartoes?.descricao || "Outros Cartões";
      const val = parseFloat(t.valor) || 0;
      const prev = cardMap.get(id);
      const next: CardAgg = {
        descricao: desc,
        logo_image: t.cartoes?.logo_image || null,
        total: (prev?.total || 0) + val,
      };
      cardMap.set(id, next);
      cardsTotal += val;
    });
  const cardsSummary = Array.from(cardMap.values());

  // Resumo por boleto
  const boletoMap = new Map<string, number>();
  let boletosTotal = 0;
  list
    .filter(
      (t) => t.tipo_transacao === "despesa" && t.forma_pagamento === "boleto",
    )
    .forEach((t) => {
      const desc = t.descricao || "Boleto";
      const val = parseFloat(t.valor) || 0;
      boletoMap.set(desc, (boletoMap.get(desc) || 0) + val);
      boletosTotal += val;
    });
  const boletosSummary = Array.from(boletoMap.entries()).map(
    ([descricao, total]) => ({ descricao, total }),
  );

  // Resumo por Pix/Dinheiro/Débito
  const outrosMap = new Map<string, number>();
  let outrosTotal = 0;
  list
    .filter(
      (t) =>
        t.tipo_transacao === "despesa" &&
        ["pix", "dinheiro", "cartão de débito"].includes(
          (t.forma_pagamento || "").toLowerCase(),
        ),
    )
    .forEach((t) => {
      const key = t.forma_pagamento?.toLowerCase() || "outro";
      const val = parseFloat(t.valor) || 0;
      outrosMap.set(key, (outrosMap.get(key) || 0) + val);
      outrosTotal += val;
    });
  const outrosSummary = Array.from(outrosMap.entries()).map(([k, total]) => ({
    forma: k,
    total,
  }));

  const totalGeral = cardsTotal + boletosTotal + outrosTotal;

  return (
    <section className="space-y-3">
      <MonthPicker />

      {/* Banner superior com nome do pagador e total do mês */}
      <div className="grid gap-2 sm:grid-cols-4">
        <Card className="col-span-4 p-4 sm:col-span-1">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <RiUser2Line /> Pagador
            </span>
          </div>
          <div className="mt-2 text-lg font-semibold capitalize">
            {payer?.nome || list[0]?.pagadores?.nome || "—"}
          </div>
        </Card>
        <Card className="col-span-4 p-4 sm:col-span-3">
          <div className="text-muted-foreground text-xs">Total no mês</div>
          <div className="mt-2 text-2xl font-semibold">
            <MoneyValues value={totalGeral} />
          </div>
        </Card>
      </div>

      {/* Banner de Resumo detalhado */}
      <div className="grid gap-2 sm:grid-cols-3">
        <Card className="p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <RiBankCardLine /> Cartão
            </span>
            <span className="text-sm font-semibold">
              <MoneyValues value={cardsTotal} />
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {cardsSummary.length === 0 ? (
              <p className="text-muted-foreground text-sm">
                Sem despesas em cartão.
              </p>
            ) : (
              cardsSummary.map((c) => (
                <div
                  key={c.descricao}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 capitalize">
                    {c.logo_image ? (
                      <PaymentMethodLogo
                        url_name={`/logos/${c.logo_image}`}
                        descricao={c.descricao}
                        width={24}
                        height={24}
                      />
                    ) : null}
                  </span>
                  <span>
                    <MoneyValues value={c.total} />
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <RiBarcodeLine /> Boleto
            </span>
            <span className="text-sm font-semibold">
              <MoneyValues value={boletosTotal} />
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {boletosSummary.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem boletos.</p>
            ) : (
              boletosSummary.map((b) => (
                <div
                  key={b.descricao}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 capitalize">
                    <PaymentMethodLogo
                      url_name={`/logos/boleto.svg`}
                      descricao={b.descricao}
                      width={24}
                      height={24}
                    />
                  </span>
                  <span>
                    <MoneyValues value={b.total} />
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span className="flex items-center gap-1">
              <RiPixLine /> Pix/Dinheiro/Débito
            </span>
            <span className="text-sm font-semibold">
              <MoneyValues value={outrosTotal} />
            </span>
          </div>
          <div className="mt-2 space-y-1">
            {outrosSummary.length === 0 ? (
              <p className="text-muted-foreground text-sm">Sem movimentos.</p>
            ) : (
              outrosSummary.map((o) => (
                <div
                  key={o.forma}
                  className="flex items-center justify-between text-sm"
                >
                  <span className="flex items-center gap-2 capitalize">
                    {o.forma === "pix" ? (
                      <PaymentMethodLogo
                        url_name={`/logos/pix.png`}
                        descricao="Pix"
                        width={24}
                        height={24}
                      />
                    ) : null}
                  </span>
                  <span>
                    <MoneyValues value={o.total} />
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Tabela de transações deste pagador */}
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
