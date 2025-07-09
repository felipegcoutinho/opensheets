"use client";

import MoneyValues from "@/components/money-values";
import Ping from "@/components/ping-icon";
import { Badge } from "@/components/ui/badge";
import { RiArrowRightSFill } from "@remixicon/react";
import Link from "next/link";

type CombinedData = {
  tipo_transacao: string;
  categoria: string;
  total: number;
  id: string;
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
        color: tipo === "despesa" ? "bg-red-500" : "bg-green-500",
        tipo: item.tipo_transacao,
      };
    });

  const sortedData = categories.sort((a, b) => b.spent - a.spent);
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spent, 0);

  return (
    <div className="w-full">
      <div className="space-y-2">
        {sortedData.map((item) => {
          const categoryProgressPercentage = (item.spent / totalSpent) * 100;
          const limitPercentage = item.limit
            ? (item.spent / item.limit) * 100
            : null;

          const url = `/categorias/${encodeURIComponent(item.id)}/${encodeURIComponent(item.name)}/${encodeURIComponent(item.tipo)}?periodo=${month}`;

          return (
            <div key={item.id} className="mb-0 w-full">
              <div>
                <div className="flex items-center justify-between border-b border-dashed py-2">
                  <div className="flex items-center">
                    <div>
                      <div className="flex items-center gap-2">
                        <Link
                          href={url}
                          className="flex items-center gap-1 capitalize hover:underline"
                        >
                          <Ping color={item.color} />
                          <span className="font-bold capitalize">
                            {item.name}
                          </span>
                          <RiArrowRightSFill className="text-muted-foreground h-3 w-3" />
                        </Link>

                        {limitPercentage && limitPercentage > 100 && (
                          <Badge
                            variant="destructive"
                            className="px-1 py-0 text-xs"
                          >
                            excedido em
                            <MoneyValues
                              value={item.spent - item.limit}
                              className="ml-1"
                            />
                          </Badge>
                        )}
                      </div>

                      <div className="text-muted-foreground text-sm">
                        {item.limit ? (
                          <span>
                            <Badge
                              variant={
                                item.spent > item.limit ? "outros" : "sistema"
                              }
                            >
                              {limitPercentage.toFixed(1)}% do limite{" "}
                              <MoneyValues
                                value={item.limit}
                                className="ml-1"
                              />
                            </Badge>
                          </span>
                        ) : (
                          <span>sem limite configurado</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div>
                      <MoneyValues value={item.spent} />
                    </div>

                    <div>
                      <Badge variant={"sistema"}>
                        {categoryProgressPercentage.toFixed(1)}%{" "}
                        {tipo === "despesa" ? "da despesa" : "da receita"} total
                      </Badge>
                    </div>
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
