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
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import {
  useActionState,
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from "react";

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
    setPercentuais(data.percentuais);
  }, [initialRule, state.data]);

  const total = useMemo(() => {
    return (
      (percentuais.necessidades || 0) +
      (percentuais.desejos || 0) +
      (percentuais.objetivos || 0)
    );
  }, [percentuais]);

  const totalOk = Math.abs(total - 100) <= 0.01;

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
    <Card>
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
        <CardContent className="space-y-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-medium">Status</p>

                <p className="text-muted-foreground text-sm">
                  {enabled
                    ? "A regra está ativa. Os modais de lançamentos vão solicitar a distribuição."
                    : "Ative para categorizar seus lançamentos segundo a regra."}
                </p>

                <div>
                  <p className="text-sm">
                    Soma atual: <strong>{total.toFixed(2)}%</strong>
                  </p>
                  {!totalOk && (
                    <p className="text-destructive text-xs">
                      Ajuste os valores para totalizar 100%.
                    </p>
                  )}
                </div>
              </div>

              <Switch
                checked={enabled}
                onCheckedChange={handleToggle}
                aria-label="Ativar regra 50/30/20"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {bucketsOrder.map((bucket) => {
                const label = formatBucketLabel(bucket);
                const errorMessages = state.errors?.[bucket];
                return (
                  <div key={bucket}>
                    <Label htmlFor={bucket}>{label}</Label>
                    <Input
                      id={bucket}
                      name={bucket}
                      type="number"
                      min={0}
                      max={100}
                      step={0.5}
                      value={percentuais[bucket] ?? 0}
                      onChange={handlePercentChange(bucket)}
                      disabled={pending}
                    />
                    {errorMessages?.length ? (
                      <p className="text-destructive text-xs">
                        {errorMessages[0]}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </div>

            {!state.success && state.message && (
              <p className="text-destructive text-sm">{state.message}</p>
            )}
            {state.success && state.message && (
              <p className="text-sm text-emerald-600">{state.message}</p>
            )}
          </div>

          <section className="mb-4 space-y-4">
            <div className="space-y-2 text-sm">
              <p className="font-semibold">Como aplicar a regra</p>
              <p className="text-muted-foreground">
                Utilize as porcentagens como guia para planejar seus
                lançamentos. Ajuste conforme necessário e compartilhe com o time
                usando as descrições abaixo.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-3">
              {bucketsOrder.map((bucket) => {
                const detail = bucketDetails[bucket];
                const colors = BUDGET_RULE_COLORS[bucket];
                return (
                  <div
                    key={bucket}
                    className={cn(
                      "rounded-lg border p-3 text-xs shadow-sm transition-colors",
                      colors.surface,
                      colors.border,
                    )}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-sm font-semibold capitalize",
                          colors.text,
                        )}
                      >
                        {formatBucketLabel(bucket)}
                      </span>
                      <span
                        className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium shadow-sm",
                          colors.badge,
                        )}
                      >
                        Meta {percentuais[bucket] ?? 0}%
                      </span>
                    </div>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                      {detail.description}
                    </p>
                    <p className="text-muted-foreground mt-3 text-[11px] font-medium tracking-wide uppercase">
                      Exemplos
                    </p>
                    <ul className="text-muted-foreground mt-1 space-y-1">
                      {detail.examples.map((example) => (
                        <li key={example} className="flex items-center gap-2">
                          <span
                            className={cn(
                              "h-1.5 w-1.5 flex-none rounded-full",
                              colors.primary,
                            )}
                          />
                          <span className="text-xs leading-5">{example}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          </section>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
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
