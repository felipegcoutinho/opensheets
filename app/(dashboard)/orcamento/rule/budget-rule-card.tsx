"use client";

import {
  BUDGET_RULE_BUCKETS,
  BUDGET_RULE_COLORS,
  formatBucketLabel,
  type BudgetRuleBucket,
  type BudgetRuleConfig,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { saveBudgetRule } from "@/app/actions/orcamentos/save_budget_rule";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";
import { toast } from "sonner";

interface ActionState {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
  data?: BudgetRuleConfig;
}

interface BudgetRuleCardProps {
  initialRule: BudgetRuleConfig;
}

const bucketsOrder: BudgetRuleBucket[] = BUDGET_RULE_BUCKETS;

const bucketDetails: Record<
  BudgetRuleBucket,
  { description: string; examples: string[] }
> = {
  necessidades: {
    description:
      "Mantêm o básico funcionando: moradia, contas essenciais, alimentação e despesas de saúde.",
    examples: [
      "Aluguel, condomínio e contas básicas",
      "Supermercado e farmácia indispensáveis",
      "Transporte para trabalho ou estudos",
    ],
  },
  desejos: {
    description:
      "Conectam-se ao estilo de vida: momentos de lazer, conforto e mimos que cabem no orçamento.",
    examples: [
      "Restaurantes, delivery e cafés",
      "Streaming, hobbies e compras pessoais",
      "Viagens, passeios e presentes",
    ],
  },
  objetivos: {
    description:
      "Impulsionam metas futuras: investimentos, reserva, formações e quitação de dívidas.",
    examples: [
      "Investimentos e poupança recorrente",
      "Amortização de dívidas ou financiamentos",
      "Cursos, certificações e projetos pessoais",
    ],
  },
};

export function BudgetRuleCard({ initialRule }: BudgetRuleCardProps) {
  const [enabled, setEnabled] = useState(initialRule.ativada);
  const [percentuais, setPercentuais] = useState(initialRule.percentuais);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    saveBudgetRule,
    {
      success: true,
      message: "",
      data: initialRule,
    },
  );

  useEffect(() => {
    const data = state.data ?? initialRule;
    setEnabled(data.ativada);
    setPercentuais({ ...data.percentuais });
  }, [initialRule, state.data]);

  useEffect(() => {
    if (!state.message) return;
    state.success ? toast.success(state.message) : toast.error(state.message);
  }, [state]);

  const total = useMemo(() => {
    return (
      (percentuais.necessidades || 0) +
      (percentuais.desejos || 0) +
      (percentuais.objetivos || 0)
    );
  }, [percentuais]);

  const totalOk = Math.abs(total - 100) <= 0.01;
  const deviation = Number((total - 100).toFixed(2));
  const deviationLabel = Math.abs(deviation).toFixed(2);
  const distributionHint = totalOk
    ? "Distribuição equilibrada."
    : deviation < 0
      ? `Faltam ${deviationLabel}% para alcançar 100%.`
      : `Excedeu ${deviationLabel}% acima do ideal.`;
  const distributionColor = totalOk
    ? "text-emerald-600"
    : deviation < 0
      ? "text-amber-600"
      : "text-destructive";
  const progressPrimaryColor = totalOk
    ? "bg-emerald-500"
    : deviation < 0
      ? "bg-amber-500"
      : "bg-destructive";
  const progressValue = Math.min(Math.max(total, 0), 100);

  const handleToggle = (value: boolean) => {
    setEnabled(value);
  };

  const handlePercentChange =
    (bucket: keyof BudgetRuleConfig["percentuais"]) =>
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = Number(event.target.value ?? 0);
      setPercentuais((prev) => ({ ...prev, [bucket]: value }));
    };

  return (
    <Card className="gap-4 border-none">
      <CardHeader className="space-y-3">
        <div className="space-y-2">
          <CardTitle>Regra 50/30/20</CardTitle>
          <p className="text-muted-foreground text-sm">
            Defina como sua receita será distribuída entre Necessidades, Desejos
            e Objetivos. A regra ajuda a garantir equilíbrio entre compromissos
            essenciais, qualidade de vida e metas financeiras – e você pode
            personalizar os percentuais a qualquer momento.
          </p>
        </div>
      </CardHeader>
      <form action={formAction}>
        <input type="hidden" name="ativada" value={String(enabled)} />

        <CardContent className="space-y-8 p-4">
          <section className="bg-muted/30 space-y-5 rounded border p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                <p className="text-muted-foreground text-xs font-semibold tracking-wide uppercase">
                  Status da regra
                </p>
                <h3 className="text-lg font-semibold">
                  {enabled ? "Regra ativa" : "Regra desativada"}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {enabled
                    ? "Os novos lançamentos vão solicitar a distribuição conforme a regra configurada."
                    : "Ative a regra para categorizar seus lançamentos conforme a estratégia 50/30/20."}
                </p>
              </div>

              <div className="flex items-center gap-3 self-start">
                <span className="text-muted-foreground text-sm font-medium">
                  {enabled ? "Ativa" : "Desativada"}
                </span>
                <Switch
                  checked={enabled}
                  onCheckedChange={handleToggle}
                  aria-label="Ativar regra 50/30/20"
                />
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="text-sm font-medium">Distribuição atual</p>
                <span
                  className={cn("text-sm font-semibold", distributionColor)}
                >
                  {total.toFixed(2)}%
                </span>
              </div>
              <Progress
                value={progressValue}
                primary_color={progressPrimaryColor}
                secondary_color="bg-muted"
                className="h-2"
              />
              <p className={cn("text-xs", distributionColor)}>
                {distributionHint}
              </p>
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Ajuste os percentuais</p>
                <p className="text-muted-foreground text-sm">
                  Distribua os 100% entre necessidades, desejos e objetivos
                  mantendo equilíbrio financeiro.
                </p>
              </div>
              <span className="text-muted-foreground inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                Meta total 100%
              </span>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              {bucketsOrder.map((bucket) => {
                const label = formatBucketLabel(bucket);
                const errorMessages = state.errors?.[bucket];
                const detail = bucketDetails[bucket];
                const colors = BUDGET_RULE_COLORS[bucket];
                const bucketValue = Number(percentuais[bucket] ?? 0);
                const displayValue = bucketValue.toFixed(1);

                return (
                  <div
                    key={bucket}
                    className={cn(
                      "bg-background flex h-full flex-col justify-between gap-4 rounded-2xl border p-5 shadow-sm transition-colors",
                      colors.surface,
                      colors.border,
                    )}
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Label
                          htmlFor={bucket}
                          className={cn("text-base font-semibold", colors.text)}
                        >
                          {label}
                        </Label>
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold shadow-sm",
                            colors.badge,
                          )}
                        >
                          {displayValue}%
                        </span>
                      </div>

                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {detail.description}
                      </p>

                      <div className="space-y-2">
                        <div className="relative">
                          <Input
                            id={bucket}
                            name={bucket}
                            type="number"
                            min={0}
                            max={100}
                            step={0.5}
                            value={bucketValue}
                            onChange={handlePercentChange(bucket)}
                            disabled={pending}
                            className="pr-10"
                            aria-describedby={`${bucket}-hint`}
                          />
                          <span className="text-muted-foreground pointer-events-none absolute inset-y-0 right-3 flex items-center text-xs font-medium">
                            %
                          </span>
                        </div>
                        <p
                          id={`${bucket}-hint`}
                          className="text-muted-foreground text-xs"
                        >
                          Ajuste em incrementos de 0,5%.
                        </p>
                        {errorMessages?.length ? (
                          <p className="text-destructive text-xs">
                            {errorMessages[0]}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-muted-foreground text-[11px] font-semibold tracking-wide uppercase">
                        Exemplos
                      </p>
                      <ul className="text-muted-foreground space-y-1 text-xs">
                        {detail.examples.map((example) => (
                          <li key={example} className="flex items-center gap-2">
                            <span
                              className={cn(
                                "h-2 w-2 flex-none rounded-full",
                                colors.primary,
                              )}
                            />
                            <span className="leading-5">{example}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </CardContent>

        <CardFooter className="mt-2 flex flex-col gap-3 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <Button
            type="submit"
            disabled={pending || !totalOk}
            variant="default"
          >
            {pending ? "Salvando..." : "Salvar configuração"}
          </Button>
        </CardFooter>
        <input
          type="hidden"
          name="necessidades"
          value={percentuais.necessidades}
        />
        <input type="hidden" name="desejos" value={percentuais.desejos} />
        <input type="hidden" name="objetivos" value={percentuais.objetivos} />
      </form>
    </Card>
  );
}
