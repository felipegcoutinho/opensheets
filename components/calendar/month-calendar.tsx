"use client";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import DetailsTransactions from "@/app/(dashboard)/lancamento/modal/details-transactions";
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
import ptBR from "date-fns/locale/pt-BR";
import { useMemo, useState } from "react";
import PaymentMethodLogo from "../payment-method-logo";

type AnyRecord = Record<string, any>;

type Props = {
  month: string; // ex: "agosto-2025"
  lancamentos: AnyRecord[];
  getCards: AnyRecord[] | null;
  getAccount: AnyRecord[] | null;
  getCategorias: AnyRecord[] | null;
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
      // Filtra apenas lançamentos do pagador com role "principal"
      if ((t?.pagadores?.role ?? null) !== "principal") continue;
      const d = toLocalDate(
        t?.data_compra || t?.data_vencimento || meta.start,
        meta.start,
      );
      if (d.getMonth() !== meta.m || d.getFullYear() !== meta.year) continue;
      const day = d.getDate();
      const list = map.get(day) ?? [];
      list.push(t);
      map.set(day, list);
    }
    return map;
  }, [lancamentos, meta.m, meta.start, meta.year]);

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

  return (
    <Card className="w-full border-none p-2">
      <div className="text-muted-foreground grid grid-cols-7 gap-2 border-b pb-1 text-center text-xs font-bold">
        {weekDays.map((w) => (
          <div key={w} className="tracking-wide uppercase">
            {w}
          </div>
        ))}
      </div>

      <div className="mt-2 grid grid-cols-7 gap-2">
        {grid.map((cell, idx) => (
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
              {cell.items.length > 1 && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelected({ date: cell.date, items: cell.items });
                    setOpen(true);
                  }}
                  className="text-primary text-[10px] hover:underline"
                  aria-label={`Ver todos os lançamentos do dia ${cell.day}`}
                >
                  Ver mais
                </button>
              )}
            </div>
            {/* Vencimentos de cartões */}
            {cell.isCurrentMonth &&
              (cardsByDay.get(cell.day)?.length ?? 0) > 0 && (
                <ul className="mb-1 flex flex-wrap gap-1">
                  {(cardsByDay.get(cell.day) ?? []).slice(0, 2).map((c) => (
                    <li
                      key={c.id}
                      className="flex items-center rounded bg-neutral-200 px-1.5 py-0.5 text-xs"
                      title={`Vencimento do cartão ${c?.descricao ?? ""}`}
                    >
                      <PaymentMethodLogo
                        url_name={`/logos/${c.logo_image}`}
                        width={16}
                        height={16}
                      />
                      Fatura {c?.descricao ?? "Cartão"}
                    </li>
                  ))}
                  {(cardsByDay.get(cell.day) ?? []).length > 2 && (
                    <li className="text-xs text-blue-800">
                      +{(cardsByDay.get(cell.day) ?? []).length - 2}
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
                          ? "bg-emerald-100 text-emerald-900"
                          : "bg-rose-100 text-rose-900",
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
              >
                <button type="button" className="hover:underline">
                  Novo lançamento
                </button>
              </CreateTransactions>
            </div>
          </div>
        ))}
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
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-rose-100 text-rose-900",
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
