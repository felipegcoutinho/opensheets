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
    primary: "bg-emerald-500",
    secondary: "bg-emerald-500/20",
    surface: "bg-emerald-500/5 dark:bg-emerald-500/10",
    border: "border-emerald-200 dark:border-emerald-500/40",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-600 dark:text-emerald-300",
  },
  desejos: {
    primary: "bg-sky-500",
    secondary: "bg-sky-500/20",
    surface: "bg-sky-500/5 dark:bg-sky-500/10",
    border: "border-sky-200 dark:border-sky-500/40",
    badge: "bg-sky-500 text-white",
    text: "text-sky-600 dark:text-sky-300",
  },
  objetivos: {
    primary: "bg-purple-500",
    secondary: "bg-purple-500/20",
    surface: "bg-purple-500/5 dark:bg-purple-500/10",
    border: "border-purple-200 dark:border-purple-500/40",
    badge: "bg-purple-500 text-white",
    text: "text-purple-600 dark:text-purple-300",
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
