"use client";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import MoneyValues from "@/components/money-values";
import CreateTransactions from "@/app/(dashboard)/lancamento/modal/create-transactions";
import { cn } from "@/lib/utils";
import { parse } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

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

function monthMeta(month: string) {
  const base = parse(`01-${month}`, "dd-MMMM-yyyy", new Date(), { locale: ptBR });
  const year = base.getFullYear();
  const m = base.getMonth();
  const start = new Date(year, m, 1);
  const end = new Date(year, m + 1, 0);
  const totalDays = end.getDate();
  const firstDow = start.getDay(); // 0..6
  return { base, year, m, start, end, totalDays, firstDow };
}

export default function MonthCalendar({ month, lancamentos, getCards, getAccount, getCategorias }: Props) {
  const meta = useMemo(() => monthMeta(month), [month]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<{ date: Date; items: AnyRecord[] } | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<number, AnyRecord[]>();
    for (const t of lancamentos ?? []) {
      const d = new Date(t?.data_compra || t?.data_vencimento || meta.start);
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
      items.push({ date, day: date.getDate(), isCurrentMonth: false, items: [] });
    }
    // current month days
    for (let d = 1; d <= meta.totalDays; d++) {
      const date = new Date(meta.year, meta.m, d);
      items.push({ date, day: d, isCurrentMonth: true, items: byDay.get(d) ?? [] });
    }
    // trailing blanks to complete weeks to 42 cells (6 rows * 7 columns)
    while (items.length % 7 !== 0) {
      const last = items[items.length - 1]?.date ?? meta.end;
      const next = new Date(last);
      next.setDate(next.getDate() + 1);
      items.push({ date: next, day: next.getDate(), isCurrentMonth: false, items: [] });
    }
    return items;
  }, [meta.firstDow, meta.m, meta.totalDays, meta.year, meta.end, byDay]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <Card className="w-full p-4">
      <div className="grid grid-cols-7 gap-2 border-b pb-3 text-center text-xs font-medium text-muted-foreground">
        {weekDays.map((w) => (
          <div key={w} className="uppercase tracking-wide">{w}</div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-7 gap-2">
        {grid.map((cell, idx) => (
          <CreateTransactions
            key={`${cell.date.toISOString()}-${idx}`}
            getCards={getCards}
            getAccount={getAccount}
            getCategorias={getCategorias}
          >
            <button
              type="button"
              className={cn(
                "group flex h-28 w-full flex-col rounded-md border p-2 text-left outline-none transition",
                !cell.isCurrentMonth && "opacity-40",
                "hover:border-ring hover:ring-2 hover:ring-ring/40"
              )}
              aria-label={`Dia ${cell.day}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-semibold">{cell.day}</span>
                {cell.items.length > 3 && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelected({ date: cell.date, items: cell.items });
                      setOpen(true);
                    }}
                    className="text-primary hover:underline text-[10px]"
                    aria-label={`Ver todos os lançamentos do dia ${cell.day}`}
                  >
                    +{cell.items.length - 3}
                  </button>
                )}
              </div>
              <ul className="flex-1 space-y-1 overflow-hidden">
                {cell.items.slice(0, 3).map((t, i) => (
                  <li
                    key={t.id ?? i}
                    className={cn(
                      "truncate rounded-sm px-1 py-0.5 text-xs",
                      t?.tipo_transacao === "receita" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900",
                    )}
                    title={`${t?.descricao ?? ""}`}
                  >
                    <span className="mr-1">{t?.descricao ?? "—"}</span>
                    {typeof t?.valor !== "undefined" && (
                      <span className="font-medium"><MoneyValues animated={false} value={parseFloat(t.valor)} /></span>
                    )}
                  </li>
                ))}
                {cell.items.length === 0 && (
                  <li className="text-muted-foreground text-[11px]">Sem lançamentos</li>
                )}
              </ul>
              <div className="invisible mt-1 text-right text-[10px] text-primary group-hover:visible">Novo lançamento</div>
            </button>
          </CreateTransactions>
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
                <li key={t.id ?? i} className="flex items-center justify-between gap-3 py-2">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{t?.descricao ?? "—"}</div>
                    <div className="text-muted-foreground text-xs">
                      <span className={cn(
                        "mr-2 inline-flex rounded px-1 py-0.5",
                        t?.tipo_transacao === "receita" ? "bg-emerald-100 text-emerald-900" : "bg-rose-100 text-rose-900",
                      )}>
                        {t?.tipo_transacao ?? "—"}
                      </span>
                      {t?.categorias?.nome ?? t?.categoria?.nome ?? "—"}
                      {t?.cartoes?.descricao ? ` • ${t.cartoes.descricao}` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 text-sm font-semibold">
                    {typeof t?.valor !== "undefined" ? (
                      <MoneyValues animated={false} value={parseFloat(t.valor)} />
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
