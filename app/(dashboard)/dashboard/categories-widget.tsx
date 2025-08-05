"use client";
import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Badge } from "@/components/ui/badge";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import {
  RiArrowRightSFill,
  RiCheckboxCircleLine,
  RiSkull2Fill,
} from "@remixicon/react";
import Link from "next/link";

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
  budgets?: BudgetData[];
  tipo: "despesa" | "receita";
  total?: number;
  month: string;
}

export default function CategoryProgress({
  data,
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
        color: tipo === "despesa" ? "text-red-500" : "text-green-500",
        tipo: item.tipo_transacao,
        icone: item.icone,
      };
    });

  const sortedData = categories.sort((a, b) => b.spent - a.spent);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

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

                    <span className="text-base font-medium">{item.name}</span>
                    <RiArrowRightSFill className="text-muted-foreground -ml-1 h-4 w-4" />
                  </Link>

                  {item.limit ? (
                    <div className="mt-1 space-x-1 text-sm">
                      <Badge
                        variant={
                          item.spent > item.limit
                            ? "destructive_lite"
                            : "sistema"
                        }
                      >
                        {limitPercentage!.toFixed(1)}% do limite
                        <MoneyValues value={item.limit} className="ml-1" />
                      </Badge>

                      {item.spent > item.limit ? (
                        <>
                          <Badge variant="destructive_lite">
                            excedeu em
                            <MoneyValues
                              value={item.spent - item.limit}
                              className="ml-1"
                            />
                          </Badge>
                          <RiSkull2Fill className="text-destructive ml-1 inline-block h-3 w-3" />
                        </>
                      ) : (
                        <RiCheckboxCircleLine className="ml-1 inline-block h-3 w-3 text-emerald-500" />
                      )}
                    </div>
                  ) : (
                    <div className="text-muted-foreground mt-1 text-xs italic">
                      sem limite configurado
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <MoneyValues value={item.spent} />
                  <div>
                    <Badge variant="sistema" className="mt-1">
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

      {/* {categories.length === 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Nenhuma categoria encontrada para este mês.
        </div>
      )} */}
    </div>
  );
}
