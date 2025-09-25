import {
  DEFAULT_BUDGET_RULE,
  type BudgetRuleConfig,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getBudgetRule = cache(async (): Promise<BudgetRuleConfig> => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("orcamento_regra_502030")
    .select(
      "ativada, percentual_necessidades, percentual_desejos, percentual_objetivos",
    )
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar configuração da regra 50/30/20:", error);
    return DEFAULT_BUDGET_RULE;
  }

  if (!data) {
    return DEFAULT_BUDGET_RULE;
  }

  return {
    ativada: Boolean(data.ativada),
    percentuais: {
      necessidades: Number(data.percentual_necessidades) || 0,
      desejos: Number(data.percentual_desejos) || 0,
      objetivos: Number(data.percentual_objetivos) || 0,
    },
  } satisfies BudgetRuleConfig;
});
