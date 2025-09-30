"use client";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import DetailsTransactions from "@/app/(dashboard)/lancamento/modal/details-transactions";
import type { BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import MoneyValues from "@/components/money-values";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { parse } from "date-fns";
import { ptBR } from "date-fns/locale/pt-BR";
import { useMemo, useState } from "react";
import PaymentMethodLogo from "../payment-method-logo";

type AnyRecord = Record<string, any>;

type Props = {
  month: string; // ex: "agosto-2025"
  lancamentos: AnyRecord[];
  getCards: AnyRecord[] | null;
  getAccount: AnyRecord[] | null;
  getCategorias: AnyRecord[] | null;
  budgetRule: BudgetRuleConfig;
};

type DayData = {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  items: AnyRecord[];
};

// Converte valores de data (ex.: "YYYY-MM-DD" ou ISO) em Date local
function toLocalDate(input: unknown, fallback: Date): Date {
  if (!input) return fallback;
  if (input instanceof Date) return input;
  if (typeof input === "string") {
    // Prioriza apenas a parte de data para evitar efeitos de timezone
    const m = input.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (m) {
      const y = Number(m[1]);
      const mo = Number(m[2]) - 1;
      const d = Number(m[3]);
      return new Date(y, mo, d);
    }
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
    return fallback;
  }
  if (typeof input === "number") {
    const parsed = new Date(input);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return fallback;
}

function monthMeta(month: string) {
  const base = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), {
    locale: ptBR,
  });
  const year = base.getFullYear();
  const m = base.getMonth();
  const start = new Date(year, m, 1);
  const end = new Date(year, m + 1, 0);
  const totalDays = end.getDate();
  const firstDow = start.getDay(); // 0..6
  return { base, year, m, start, end, totalDays, firstDow };
}

export default function MonthCalendar({
  month,
  lancamentos,
  getCards,
  getAccount,
  getCategorias,
  budgetRule,
}: Props) {
  const meta = useMemo(() => monthMeta(month), [month]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{
    date: Date;
    items: AnyRecord[];
  } | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<number, AnyRecord[]>();
    for (const t of lancamentos ?? []) {
      // Apenas pagador principal
      const role = t?.pagadores?.role ?? null;
      if (role !== "principal") continue;

      // Escolha da data para posicionar:
      // Sempre prioriza a data de compra; se ausente, usa a de vencimento.
      // Isso evita deslocar compras para o mês da fatura.
      const prefer = t?.data_compra;
      const fallback = t?.data_vencimento;
      const chosen = toLocalDate(prefer || fallback || meta.start, meta.start);

      // Exibir somente se a data cair dentro do mês/ano do calendário
      if (chosen.getMonth() !== meta.m || chosen.getFullYear() !== meta.year) {
        continue;
      }

      const day = chosen.getDate();
      const list = map.get(day) ?? [];
      list.push(t);
      map.set(day, list);
    }
    return map;
  }, [lancamentos, meta.m, meta.year, meta.start]);

  const grid: DayData[] = useMemo(() => {
    const items: DayData[] = [];
    // leading blanks
    for (let i = 0; i < meta.firstDow; i++) {
      const date = new Date(meta.year, meta.m, -(meta.firstDow - 1 - i));
      items.push({
        date,
        day: date.getDate(),
        isCurrentMonth: false,
        items: [],
      });
    }
    // current month days
    for (let d = 1; d <= meta.totalDays; d++) {
      const date = new Date(meta.year, meta.m, d);
      items.push({
        date,
        day: d,
        isCurrentMonth: true,
        items: byDay.get(d) ?? [],
      });
    }
    // trailing blanks to complete weeks to 42 cells (6 rows * 7 columns)
    while (items.length % 7 !== 0) {
      const last = items[items.length - 1]?.date ?? meta.end;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      items.push({
        date: next,
        day: next.getDate(),
        isCurrentMonth: false,
        items: [],
      });
    }
    return items;
  }, [meta.firstDow, meta.m, meta.totalDays, meta.year, meta.end, byDay]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  // Mapa de cartões por dia de vencimento para o mês atual
  const cardsByDay = useMemo(() => {
    const map = new Map<number, AnyRecord[]>();
    const cards = (getCards ?? []) as AnyRecord[];
    for (const c of cards) {
      const raw = c?.dt_vencimento as number | string | null | undefined;
      if (raw === null || typeof raw === "undefined") continue;
      const parsed = typeof raw === "string" ? parseInt(raw, 10) : Number(raw);
      if (!Number.isFinite(parsed) || parsed <= 0) continue;
      const day = Math.min(parsed, meta.totalDays); // garante que caiba no mês
      const list = map.get(day) ?? [];
      list.push(c);
      map.set(day, list);
    }
    return map;
  }, [getCards, meta.totalDays]);

  // Mapa de boletos (despesas com forma_pagamento = 'boleto') por data de vencimento do mês atual
  const billsByDay = useMemo(() => {
    const map = new Map<number, AnyRecord[]>();
    for (const t of lancamentos ?? []) {
      if (t?.forma_pagamento !== "boleto") continue;
      if ((t?.pagadores?.role ?? null) !== "principal") continue;
      const dv = toLocalDate(t?.data_vencimento, meta.start);
      if (
        Number.isNaN(dv.getTime()) ||
        dv.getMonth() !== meta.m ||
        dv.getFullYear() !== meta.year
      )
        continue;
      const day = dv.getDate();
      const list = map.get(day) ?? [];
      list.push(t);
      map.set(day, list);
    }
    return map;
  }, [lancamentos, meta.m, meta.year, meta.start]);

  return (
    <Card className="w-full border-none p-2 sm:p-4">
      <div className="overflow-x-auto">
        <div className="min-w-[640px] space-y-2">
          <div className="text-muted-foreground grid grid-cols-7 gap-2 border-b pb-1 text-center text-[11px] font-bold uppercase sm:text-xs">
            {weekDays.map((w) => (
              <div key={w} className="tracking-wide">
                {w}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {grid.map((cell, idx) => {
              return (
                <div
                  key={`${cell.date.toISOString()}-${idx}`}
                  className={cn(
                    "group flex h-36 w-full flex-col rounded-md border p-2 text-left transition outline-none",
                    !cell.isCurrentMonth && "opacity-40",
                    "hover:border-ring hover:ring-ring/40 hover:ring-2",
                    (() => {
                      const now = new Date();
                      return cell.date.getDate() === now.getDate() &&
                        cell.date.getMonth() === now.getMonth() &&
                        cell.date.getFullYear() === now.getFullYear()
                        ? "border-primary bg-primary/5"
                        : "";
                    })(),
                  )}
                  aria-label={`Dia ${cell.day}`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <span
                      className={cn(
                        "text-sm font-semibold",
                        (() => {
                          const now = new Date();
                          return cell.date.getDate() === now.getDate() &&
                            cell.date.getMonth() === now.getMonth() &&
                            cell.date.getFullYear() === now.getFullYear()
                            ? "text-primary"
                            : "";
                        })(),
                      )}
                    >
                      {cell.day}
                    </span>
                    {(() => {
                      const itemsCount = cell.items.length;
                      const hasCardDue =
                        (cardsByDay.get(cell.day)?.length ?? 0) > 0;
                      // Ativa "Ver mais" quando:
                      // - houver mais de 3 lançamentos; ou
                      // - houver vencimento de cartão e pelo menos 3 lançamentos no dia
                      return itemsCount > 3 || (hasCardDue && itemsCount >= 3);
                    })() && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelected({ date: cell.date, items: cell.items });
                          setOpen(true);
                        }}
                        className="text-primary cursor-pointer text-[10px] hover:underline"
                        aria-label={`Ver todos os lançamentos do dia ${cell.day}`}
                      >
                        Ver mais
                      </button>
                    )}
                  </div>
                  {/* Badges de vencimentos (cartões e boletos) */}
                  {cell.isCurrentMonth &&
                    ((cardsByDay.get(cell.day)?.length ?? 0) > 0 ||
                      (billsByDay.get(cell.day)?.length ?? 0) > 0) && (
                      <ul className="mb-1 flex flex-wrap gap-1">
                        {/* Cartões */}
                        {(cardsByDay.get(cell.day) ?? [])
                          .slice(0, 2)
                          .map((c) => (
                            <li
                              key={`card-${c.id}`}
                              className="flex items-center gap-1 rounded-full border bg-white/70 px-2 py-0.5 text-[10px] text-neutral-800"
                              title={`Vencimento do cartão ${c?.descricao ?? ""}`}
                            >
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                              <PaymentMethodLogo
                                url_name={`/logos/${c.logo_image}`}
                                width={14}
                                height={14}
                                descricao={c?.descricao ?? "Cartão"}
                              />
                            </li>
                          ))}
                        {(cardsByDay.get(cell.day) ?? []).length > 2 && (
                          <li className="text-[10px] text-neutral-600">
                            +{(cardsByDay.get(cell.day) ?? []).length - 2}
                          </li>
                        )}
                        {/* Boletos */}
                        {(billsByDay.get(cell.day) ?? [])
                          .slice(0, 2)
                          .map((b, i) => (
                            <li
                              key={`bill-${b.id ?? i}`}
                              className="flex items-center gap-1 rounded-full border bg-white/70 px-2 py-0.5 text-[10px] text-neutral-800"
                              title={`Vencimento do boleto: ${b?.descricao ?? "Boleto"}`}
                            >
                              <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                              {b?.descricao}
                            </li>
                          ))}
                        {(billsByDay.get(cell.day) ?? []).length > 2 && (
                          <li className="text-[10px] text-neutral-600">
                            +{(billsByDay.get(cell.day) ?? []).length - 2}
                          </li>
                        )}
                      </ul>
                    )}
                  <ul className="flex-1 overflow-hidden">
                    {cell.items.slice(0, 3).map((t, i) => (
                      <li key={t.id ?? i}>
                        <DetailsTransactions
                          itemId={t.id}
                          itemNotas={t.anotacao}
                          itemDate={t.data_compra}
                          itemDescricao={t.descricao}
                          itemCondicao={t.condicao}
                          itemResponsavel={t.pagadores?.nome}
                          itemResponsavelRole={t.pagadores?.role}
                          itemResponsavelFoto={t.pagadores?.foto}
                          itemTipoTransacao={t.tipo_transacao}
                          itemValor={parseFloat(t.valor)}
                          itemFormaPagamento={t.forma_pagamento}
                          itemQtdeParcelas={t.qtde_parcela}
                          itemParcelaAtual={t.parcela_atual}
                          itemQtdeRecorrencia={t.qtde_recorrencia}
                          itemCartao={t.cartoes?.descricao}
                          itemConta={t.contas?.descricao}
                          itemPaid={t.realizado}
                          itemImagemURL={t.imagem_url}
                          itemCategoriaId={t.categorias?.nome}
                          itemPeriodo={t.periodo}
                        >
                          <button
                            type="button"
                            className={cn(
                              "w-full truncate rounded-sm px-1 py-0.5 text-left text-xs",
                              t?.tipo_transacao === "receita"
                                ? "bg-income/15 text-income dark:bg-income/25 dark:text-white"
                                : "bg-expense/15 text-expense dark:bg-expense/25 dark:text-white",
                            )}
                            title={`${t?.descricao ?? ""}`}
                          >
                            <span className="mr-1">{t?.descricao ?? "—"}</span>
                            {typeof t?.valor !== "undefined" && (
                              <span className="font-medium">
                                <MoneyValues
                                  animated={false}
                                  value={parseFloat(t.valor)}
                                />
                              </span>
                            )}
                          </button>
                        </DetailsTransactions>
                      </li>
                    ))}
                    {cell.items.length === 0 && (
                      <li className="text-muted-foreground text-[11px]">
                        Sem lançamentos
                      </li>
                    )}
                  </ul>
                  <div className="text-primary invisible mt-1 text-right text-[10px] group-hover:visible">
                    <CreateTransactions
                      getCards={getCards}
                      getAccount={getAccount}
                      getCategorias={getCategorias}
                      budgetRule={budgetRule}
                      defaultDate={cell.date}
                    >
                      <button
                        type="button"
                        className="cursor-pointer hover:underline"
                      >
                        Novo lançamento
                      </button>
                    </CreateTransactions>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selected?.date.toLocaleDateString("pt-BR", {
                weekday: "long",
                day: "2-digit",
                month: "long",
              })}
            </DialogTitle>
          </DialogHeader>
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Vencimentos do dia (cartões e boletos) */}
            {selected &&
              (() => {
                const day = selected.date.getDate();
                const cards = cardsByDay.get(day) ?? [];
                const bills = billsByDay.get(day) ?? [];
                if (cards.length === 0 && bills.length === 0) return null;
                return (
                  <div className="mb-3">
                    <div className="text-muted-foreground mb-1 text-xs font-medium">
                      Vencimentos
                    </div>
                    <ul className="flex flex-wrap gap-1">
                      {cards.map((c: AnyRecord) => (
                        <li
                          key={`modal-card-${c.id}`}
                          className="flex items-center gap-1 rounded-full border bg-white/70 px-2 py-0.5 text-[10px] text-neutral-800"
                          title={`Vencimento do cartão ${c?.descricao ?? ""}`}
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-sky-500" />
                          <PaymentMethodLogo
                            url_name={`/logos/${c.logo_image}`}
                            width={14}
                            height={14}
                            descricao={c?.descricao ?? "Cartão"}
                          />
                        </li>
                      ))}
                      {bills.map((b: AnyRecord, i: number) => (
                        <li
                          key={`modal-bill-${b.id ?? i}`}
                          className="flex items-center gap-1 rounded-full border bg-white/70 px-2 py-0.5 text-[10px] text-neutral-800"
                          title={`Vencimento do boleto: ${b?.descricao ?? "Boleto"}`}
                        >
                          <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                          Boleto
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })()}
            <ul className="divide-y">
              {selected?.items.map((t, i) => (
                <li
                  key={t.id ?? i}
                  className="flex items-center justify-between gap-3 py-2"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">
                      {t?.descricao ?? "—"}
                    </div>
                    <div className="text-muted-foreground text-xs">
                      <span
                        className={cn(
                          "mr-2 inline-flex rounded px-1 py-0.5",
                          t?.tipo_transacao === "receita"
                            ? "bg-income/15 text-income dark:bg-income/25 dark:text-white"
                            : "bg-expense/15 text-expense dark:bg-expense/25 dark:text-white",
                        )}
                      >
                        {t?.tipo_transacao ?? "—"}
                      </span>
                      {t?.categorias?.nome ?? t?.categoria?.nome ?? "—"}
                      {t?.cartoes?.descricao ? ` • ${t.cartoes.descricao}` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold">
                    {typeof t?.valor !== "undefined" ? (
                      <MoneyValues
                        animated={false}
                        value={parseFloat(t.valor)}
                      />
                    ) : (
                      <span>—</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
