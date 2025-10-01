"use client";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import {
  RiArrowDownLine,
  RiArrowRightSFill,
  RiArrowUpLine,
} from "@remixicon/react";
import Link from "next/link";
import { useMemo } from "react";

type CombinedData = {
  tipo_transacao: string;
  categoria: string;
  total: number;
  id: string;
  icone?: string;
};

type BudgetData = {
  categorias: { id: string };
  valor_orcado: number;
};

interface CategoryProgressProps {
  data: CombinedData[];
  previousData?: CombinedData[];
  budgets?: BudgetData[];
  tipo: "despesa" | "receita";
  total?: number;
  month: string;
}

export default function CategoryProgress({
  data,
  previousData = [],
  budgets = [],
  tipo,
  total,
  month,
}: CategoryProgressProps) {
  // Mapeia e adapta os dados recebidos para o formato interno
  const categories = data
    .filter((item) => item.tipo_transacao === tipo)
    .map((item) => {
      const budget = budgets.find(
        (b) => b.categorias?.id?.toString() === item.id.toString(),
      );
      return {
        id: item.id,
        name: item.categoria,
        spent: item.total,
        limit: budget?.valor_orcado,
        color: tipo === "despesa" ? "text-chart-2" : "text-chart-1",
        tipo: item.tipo_transacao,
        icone: item.icone,
      };
    });

  const sortedData = categories.sort((a, b) => b.spent - a.spent);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);
  const previousTotals = useMemo(() => {
    const map = new Map<string, number>();
    previousData
      .filter((item) => item.tipo_transacao === tipo)
      .forEach((item) => {
        map.set(item.id.toString(), Number(item.total) || 0);
      });
    return map;
  }, [previousData, tipo]);

  if (!sortedData.length && !totalSpent) return <EmptyCard />;

  return (
    <div className="w-full">
      <div className="space-y-2">
        {sortedData.map((item) => {
          const categoryProgressPercentage = (item.spent / totalSpent) * 100;
          const limitPercentage = item.limit
            ? (item.spent / item.limit) * 100
            : null;
          const IconComp = item.icone
            ? categoryIconsMap[item.icone]
            : undefined;
          const previousValue = previousTotals.get(item.id.toString()) ?? 0;
          const rawVariation = previousValue
            ? ((item.spent - previousValue) / previousValue) * 100
            : item.spent === 0
              ? 0
              : 100;
          const variation = Number.isFinite(rawVariation) ? rawVariation : 0;
          const VariationIcon =
            variation > 0
              ? RiArrowUpLine
              : variation < 0
                ? RiArrowDownLine
                : null;
          const variationClass =
            variation > 0
              ? "text-emerald-600"
              : variation < 0
                ? "text-red-600"
                : "text-muted-foreground";
          const formattedVariation = `${
            variation > 0 ? "+" : variation < 0 ? "" : ""
          }${variation.toFixed(1)}%`;

          const url = `/categoria/${encodeURIComponent(item.id)}/${encodeURIComponent(item.name)}/${encodeURIComponent(item.tipo)}?periodo=${month}`;

          return (
            <div key={item.id} className="mb-2 w-full">
              <div className="flex items-start justify-between border-b border-dashed pb-2">
                <div>
                  <Link
                    href={url}
                    className="flex items-center gap-2 capitalize hover:underline"
                  >
                    {IconComp && (
                      <IconComp className={`h-4 w-4 ${item.color}`} />
                    )}

                    <span className="text-sm">{item.name}</span>
                    <RiArrowRightSFill className="text-muted-foreground -ml-1 h-4 w-4" />
                  </Link>

                  {item.limit ? (
                    <div className="mt-1 space-x-1 text-sm">
                      <Badge
                        variant={
                          item.spent > item.limit
                            ? "destructive_lite"
                            : "despesa_lite"
                        }
                      >
                        {limitPercentage!.toFixed(1)}% do limite
                        <MoneyValues value={item.limit} className="ml-1" />
                      </Badge>
                      {item.spent > item.limit && (
                        <>
                          <Badge variant="destructive_lite">
                            excedeu em
                            <MoneyValues
                              value={item.spent - item.limit}
                              className="ml-1"
                            />
                          </Badge>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground mt-2 text-xs italic">
                      Sem limite definido
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-xs ${variationClass}`}
                    >
                      {VariationIcon ? <VariationIcon size={10} /> : null}
                      {formattedVariation}
                    </span>
                    <MoneyValues value={item.spent} />
                  </div>
                  <div>
                    <Badge variant="outline" className="mt-1">
                      {categoryProgressPercentage.toFixed(1)}%{" "}
                      {tipo === "despesa" ? "da despesa" : "da receita"} total
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
