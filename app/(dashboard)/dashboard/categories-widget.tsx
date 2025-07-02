"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RiArrowRightUpLine } from "@remixicon/react";
import Link from "next/link";

type CombinedData = {
  tipo_transacao: string;
  categoria: string;
  total: number;
  id: string;
};

type Props = {
  data: CombinedData[];
  totalReceita?: number;
  tipo?: "receita" | "despesa";
  month: string;
  budgets?: any[];
};

export default function CategoryWidget({
  data,
  totalReceita,
  tipo,
  month,
  budgets,
}: Props) {
  const filteredData = data.filter((item) => item.tipo_transacao === tipo);

  const sortedData = filteredData.sort((a, b) => b.total - a.total);

  if (!data || data.length === 0) {
    return <EmptyCard />;
  }

  return (
    <CardContent className="space-y-6 p-0">
      {sortedData.map((item, index) => {
        const budget = budgets?.find(
          (b) => String(b.categorias?.id) === String(item.id),
        );
        const limite = budget?.valor_orcado as number | undefined;
        const percentual =
          limite && limite > 0
            ? ((item.total / limite) * 100).toFixed(1)
            : null;

        const url = `/categorias/${encodeURIComponent(item.id)}/${encodeURIComponent(item.categoria)}/${encodeURIComponent(item.tipo_transacao)}?periodo=${month}`;

        return (
          <div key={index} className="space-y-1">
            <div className="flex items-center justify-between">
              <Link
                href={url}
                className="flex items-center gap-1 hover:underline"
              >
                <span className="font-bold capitalize">{item.categoria}</span>
                <RiArrowRightUpLine className="text-muted-foreground h-3 w-3" />
              </Link>

              <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                  <MoneyValues value={item.total} />
                  {percentual && (
                    <Badge
                      variant={
                        item.tipo_transacao === "despesa" ? "despesa" : "receita"
                      }
                    >
                      {percentual}%
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground text-xs">
                  {limite ? (
                    <MoneyValues value={limite} />
                  ) : (
                    "Orçamento não configuravel"
                  )}
                </span>
              </div>
            </div>

            <Progress
              primary_color={
                item.tipo_transacao === "despesa"
                  ? "bg-red-500 dark:bg-red-700"
                  : "bg-green-500 dark:bg-green-700"
              }
              secondary_color={
                item.tipo_transacao === "despesa"
                  ? "bg-zinc-200 dark:bg-zinc-700/50"
                  : "bg-zinc-200 dark:bg-zinc-700/50"
              }
              value={
                percentual
                  ? parseFloat(percentual)
                  : totalReceita && totalReceita > 0
                    ? (item.total / totalReceita) * 100
                    : item.tipo_transacao === "despesa"
                      ? 100
                      : 0
              }
              className="h-2"
            />
          </div>
        );
      })}
    </CardContent>
  );
}
