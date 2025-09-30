export type BudgetRuleBucket = "necessidades" | "desejos" | "objetivos";

export interface BudgetRulePercentages {
  necessidades: number;
  desejos: number;
  objetivos: number;
}

export interface BudgetRuleConfig {
  ativada: boolean;
  percentuais: BudgetRulePercentages;
}

export const DEFAULT_BUDGET_RULE: BudgetRuleConfig = {
  ativada: false,
  percentuais: {
    necessidades: 50,
    desejos: 30,
    objetivos: 20,
  },
};

export const BUDGET_RULE_BUCKETS: BudgetRuleBucket[] = [
  "necessidades",
  "desejos",
  "objetivos",
];

export const BUDGET_RULE_COLORS: Record<
  BudgetRuleBucket,
  {
    primary: string;
    secondary: string;
    surface: string;
    border: string;
    badge: string;
    text: string;
  }
> = {
  necessidades: {
    primary: "bg-[var(--bg-necessidade)]",
    secondary: "bg-[var(--bg-necessidade)]/30",
    surface: "bg-[var(--bg-necessidade)]/20 dark:bg-[var(--bg-necessidade)]/15",
    border: "border-[var(--bg-necessidade-foreground)] dark:border-[var(--bg-necessidade-foreground)]",
    badge: "bg-[var(--bg-necessidade)] text-[var(--bg-necessidade-foreground)]",
    text: "text-[var(--bg-necessidade-foreground)] dark:text-[var(--bg-necessidade-foreground)]",
  },
  desejos: {
    primary: "bg-[var(--bg-desejo)]",
    secondary: "bg-[var(--bg-desejo)]/40",
    surface: "bg-[var(--bg-desejo)]/20 dark:bg-[var(--bg-desejo)]/15",
    border: "border-[var(--bg-desejo-foreground)] dark:border-[var(--bg-desejo-foreground)]",
    badge: "bg-[var(--bg-desejo)] text-[var(--bg-desejo-foreground)]",
    text: "text-[var(--bg-desejo-foreground)] dark:text-[var(--bg-desejo-foreground)]",
  },
  objetivos: {
    primary: "bg-[var(--bg-objetivo)]",
    secondary: "bg-[var(--bg-objetivo)]/35",
    surface: "bg-[var(--bg-objetivo)]/20 dark:bg-[var(--bg-objetivo)]/15",
    border: "border-[var(--bg-objetivo-foreground)] dark:border-[var(--bg-objetivo-foreground)]",
    badge: "bg-[var(--bg-objetivo)] text-[var(--bg-objetivo-foreground)]",
    text: "text-[var(--bg-objetivo-foreground)] dark:text-[var(--bg-objetivo-foreground)]",
  },
};

export function formatBucketLabel(bucket: BudgetRuleBucket) {
  switch (bucket) {
    case "necessidades":
      return "Necessidades";
    case "desejos":
      return "Desejos";
    case "objetivos":
      return "Objetivos";
    default:
      return bucket;
  }
}
