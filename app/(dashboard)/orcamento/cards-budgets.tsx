"use client";

import EmptyCard from "@/components/empty-card";
import MoneyValues from "@/components/money-values";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categoryIconsMap } from "@/hooks/use-category-icons";
import UpdateBudget from "./modal/update-budget";
import DeleteBudget from "./modal/delete-budget";
import { RiQuestionLine } from "@remixicon/react";
import Link from "next/link";
import { Progress } from "../../../components/ui/progress";

type Props = {
  budgets: any[];
  categorias: any[];
  totals?: { id: string; total: number; tipo_transacao: string }[];
};

export default function CardsBudgets({
  budgets,
  categorias,
  totals = [],
}: Props) {
  if (!budgets || budgets.length === 0) {
    return (
      <div className="col-span-full">
        <EmptyCard />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {budgets.map((item) => {
        const iconName = item.categorias?.icone as string | undefined;
        const Icon = iconName ? categoryIconsMap[iconName] : undefined;
        const Fallback = RiQuestionLine;
        const catId = String(item.categorias?.id ?? "");
        const spent = totals.find((t) => String(t.id) === catId)?.total || 0;
        const limit = Number(item.valor_orcado) || 0;
        const percent = limit > 0 ? Math.min((spent / limit) * 100, 100) : 0;
        const isOver = limit > 0 && spent > limit;
        const tipoFromTotals = totals.find((t) => String(t.id) === catId)
          ?.tipo_transacao as string | undefined;
        const tipoFromCategoria = categorias.find(
          (c: any) => String(c.id) === catId,
        )?.tipo_categoria as string | undefined;
        const tipo = (tipoFromTotals ||
          tipoFromCategoria ||
          "despesa") as string;
        const nomeCat = item.categorias?.nome || "Categoria";
        const url = `/categoria/${encodeURIComponent(catId)}/${encodeURIComponent(nomeCat)}/${encodeURIComponent(tipo)}?periodo=${encodeURIComponent(item.periodo || "")}`;

        return (
          <Card
            key={item.id}
            className={`group ${
              isOver ? "border-destructive/50 bg-destructive/5" : ""
            }`}
          >
            <CardHeader className="pb-0">
              <div className="flex items-center gap-3">
                <div className="bg-secondary text-primary inline-flex size-9 items-center justify-center rounded-md">
                  {Icon ? (
                    <Icon className="size-5" />
                  ) : (
                    <Fallback className="size-5" />
                  )}
                </div>
                <CardTitle className="capitalize">
                  <Link href={url} className="hover:underline">
                    {nomeCat}
                  </Link>
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-muted-foreground text-sm">Limite</div>
              <div className="text-2xl font-semibold">
                <MoneyValues value={item.valor_orcado} />
              </div>

              {limit > 0 && (
                <div className="mt-3">
                  <Progress
                    primary_color={isOver ? "bg-destructive" : "bg-chart-2"}
                    secondary_color="bg-secondary"
                    value={percent}
                    className={`h-2 rounded ${
                      isOver ? "bg-destructive/10" : "bg-muted"
                    }`}
                  />

                  <div className="text-muted-foreground mt-1 flex items-center justify-between text-xs">
                    <span>Gasto</span>
                    <span>
                      <MoneyValues value={spent} />
                      {isOver && (
                        <span className="text-destructive ml-2 font-medium">
                          excedeu em <MoneyValues value={spent - limit} />
                        </span>
                      )}
                    </span>
                  </div>
                </div>
              )}

              <div className="mt-6 flex items-center gap-6">
                <UpdateBudget
                  item={item}
                  categorias={categorias}
                  trigger={
                    <Button variant="link" size="icon">
                      editar
                    </Button>
                  }
                />
                <DeleteBudget
                  itemId={item.id}
                  trigger={
                    <Button
                      variant="link"
                      size="icon"
                      className="text-destructive"
                    >
                      remover
                    </Button>
                  }
                />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
