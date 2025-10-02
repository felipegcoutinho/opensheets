import {
  BUDGET_RULE_BUCKETS,
  BUDGET_RULE_COLORS,
  formatBucketLabel,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { getBudgetRuleSnapshot } from "@/app/actions/orcamentos/get_rule_snapshot";
import MoneyValues from "@/components/money-values";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { RiPriceTag3Fill } from "@remixicon/react";
import Link from "next/link";

export default async function RulesWidget({
  month,
  formatPercent,
  humanizePeriod,
}: {
  month: string;
  formatPercent: (value: number) => string;
  humanizePeriod: (periodo: string) => string;
}) {
  const snapshot = await getBudgetRuleSnapshot(month);
  const formattedMonth = humanizePeriod(month) || month;
  const showBuckets = snapshot.rule.ativada;

  return (
    <div className="space-y-2">
      {!showBuckets ? (
        <div className="text-muted-foreground rounded-md border border-dashed p-4">
          <p className="text-sm">
            Ative a regra na aba <strong>Orçamentos</strong> para acompanhar a
            distribuição dos seus gastos entre Necessidades, Desejos e
            Objetivos.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {BUDGET_RULE_BUCKETS.map((bucket) => {
            const spent = snapshot.buckets[bucket];
            const targetPercent = snapshot.rule.percentuais[bucket];
            const expected = snapshot.totalIncome * (targetPercent / 100);
            const percentOfIncome = snapshot.totalIncome
              ? (spent / snapshot.totalIncome) * 100
              : 0;
            const remaining = expected - spent;
            const progress =
              expected > 0 ? Math.min((spent / expected) * 100, 100) : 0;
            const colors = BUDGET_RULE_COLORS[bucket];
            const cssVarPrimary =
              bucket === "necessidades"
                ? "--bg-necessidade-foreground"
                : bucket === "desejos"
                  ? "--bg-desejo-foreground"
                  : "--bg-objetivo-foreground";
            const cssVarSecondary =
              bucket === "necessidades"
                ? "--bg-necessidade"
                : bucket === "desejos"
                  ? "--bg-desejo"
                  : "--bg-objetivo";
            const bucketLabel = formatBucketLabel(bucket);
            const detailHref = `/lancamento?periodo=${encodeURIComponent(month)}&regra_502030_tipo=${bucket}`;

            return (
              <div
                key={bucket}
                className="border-b border-dashed p-2 last:border-0"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-1">
                    <Link
                      href={detailHref}
                      className={cn(
                        "focus-visible:ring-primary text-sm capitalize transition-colors hover:underline focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none",
                      )}
                      aria-label={`Ver lançamentos de ${bucketLabel} no período ${formattedMonth}`}
                    >
                      <span className="flex items-center gap-2">
                        <RiPriceTag3Fill
                          aria-hidden="true"
                          className={cn("size-4", colors.text)}
                        />
                        <span>{bucketLabel}</span>
                      </span>
                    </Link>
                    <p className="text-muted-foreground text-xs">
                      Meta {formatPercent(targetPercent)}% •{" "}
                      {formatPercent(percentOfIncome)}% usado
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-base font-medium">
                      <MoneyValues value={spent} />
                    </p>
                  </div>
                </div>

                <div className="mt-2">
                  <Progress
                    value={progress}
                    primary_color={cssVarPrimary}
                    secondary_color={cssVarSecondary}
                    className="h-1"
                    aria-label={`Consumo de ${formatBucketLabel(bucket)}`}
                  />
                </div>

                <div className="text-muted-foreground mt-2 flex items-center justify-between text-xs">
                  <span>
                    Meta: <MoneyValues value={expected} />
                  </span>
                  <span
                    className={cn(
                      "font-medium",
                      remaining >= 0 ? "text-green-600" : "text-orange-600",
                    )}
                  >
                    {remaining >= 0 ? "Disponível" : "Excedente"}:{" "}
                    <MoneyValues value={Math.abs(remaining)} />
                  </span>
                </div>
              </div>
            );
          })}

          {snapshot.unclassified > 0 ? (
            <div className="text-muted-foreground rounded border border-dashed p-2 text-xs">
              <p className="flex flex-wrap items-center gap-1">
                <strong>
                  <MoneyValues value={snapshot.unclassified} />
                </strong>
                <span>
                  ainda não possuem classificação na regra. Atualize os
                  lançamentos para uma análise completa.
                </span>
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
