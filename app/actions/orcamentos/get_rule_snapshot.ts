import type {
  BudgetRuleBucket,
  BudgetRuleConfig,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { BUDGET_RULE_BUCKETS } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { createClient } from "@/utils/supabase/server";
import { getBudgetRule } from "./fetch_budget_rule";

export interface BudgetRuleSnapshot {
  rule: BudgetRuleConfig;
  totalIncome: number;
  totalExpenses: number;
  buckets: Record<BudgetRuleBucket, number>;
  unclassified: number;
}

function sumValues(
  rows: { valor: number | string | null }[] | null | undefined,
) {
  if (!rows?.length) return 0;
  return rows.reduce((acc, row) => {
    const valueNumber = Number(row.valor);
    if (Number.isFinite(valueNumber)) {
      return acc + valueNumber;
    }
    return acc;
  }, 0);
}

export async function getBudgetRuleSnapshot(
  month: string,
): Promise<BudgetRuleSnapshot> {
  const supabase = createClient();

  const [rule, incomesRes, expensesRes] = await Promise.all([
    getBudgetRule(),
    supabase
      .from("lancamentos")
      .select("valor, pagadores!inner(role)")
      .eq("tipo_transacao", "receita")
      .eq("periodo", month)
      .eq("pagadores.role", "principal"),
    supabase
      .from("lancamentos")
      .select("valor, regra_502030_tipo, pagadores!inner(role)")
      .eq("tipo_transacao", "despesa")
      .eq("periodo", month)
      .eq("pagadores.role", "principal"),
  ]);

  if (incomesRes.error) {
    console.error(
      "Erro ao calcular receitas da regra 50/30/20:",
      incomesRes.error,
    );
  }

  if (expensesRes.error) {
    console.error(
      "Erro ao calcular despesas da regra 50/30/20:",
      expensesRes.error,
    );
  }

  const totalIncome = sumValues(incomesRes.data);

  const buckets: Record<BudgetRuleBucket, number> = {
    necessidades: 0,
    desejos: 0,
    objetivos: 0,
  };
  let unclassified = 0;

  for (const row of expensesRes.data || []) {
    const numericValue = Number(row.valor);
    if (!Number.isFinite(numericValue)) continue;
    const bucket = row.regra_502030_tipo as BudgetRuleBucket | null | undefined;
    if (bucket && (BUDGET_RULE_BUCKETS as readonly string[]).includes(bucket)) {
      buckets[bucket] += numericValue;
    } else {
      unclassified += numericValue;
    }
  }

  const totalExpenses =
    buckets.necessidades + buckets.desejos + buckets.objetivos + unclassified;

  return {
    rule,
    totalIncome,
    totalExpenses,
    buckets,
    unclassified,
  };
}
