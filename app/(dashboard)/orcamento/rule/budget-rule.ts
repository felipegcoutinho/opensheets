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
    primary: "bg-[#CAEAC5]",
    secondary: "bg-[#CAEAC5]/30",
    surface: "bg-[#CAEAC5]/20 dark:bg-[#CAEAC5]/15",
    border: "border-[#9FC89D] dark:border-[#7EAB7D]",
    badge: "bg-[#CAEAC5] text-[#103118]",
    text: "text-[#2F6A3A] dark:text-[#8DD495]",
  },
  desejos: {
    primary: "bg-[#BDDFEE]",
    secondary: "bg-[#BDDFEE]/40",
    surface: "bg-[#BDDFEE]/20 dark:bg-[#BDDFEE]/15",
    border: "border-[#8FC3DA] dark:border-[#6AAEC8]",
    badge: "bg-[#BDDFEE] text-[#0E1C25]",
    text: "text-[#1F4A69] dark:text-[#88C2DE]",
  },
  objetivos: {
    primary: "bg-[#EA9CB5]",
    secondary: "bg-[#EA9CB5]/35",
    surface: "bg-[#EA9CB5]/20 dark:bg-[#EA9CB5]/15",
    border: "border-[#D97A9A] dark:border-[#C35A7E]",
    badge: "bg-[#EA9CB5] text-[#3F0E22]",
    text: "text-[#7C2E47] dark:text-[#F3AAC1]",
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
