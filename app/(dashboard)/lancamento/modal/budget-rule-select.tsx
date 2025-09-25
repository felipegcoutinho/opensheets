"use client";

import type {
  BudgetRuleBucket,
  BudgetRulePercentages,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import {
  BUDGET_RULE_BUCKETS,
  formatBucketLabel,
} from "@/app/(dashboard)/orcamento/rule/budget-rule";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const BUCKET_TRIGGER_STYLES: Record<BudgetRuleBucket, string> = {
  necessidades:
    "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-500/10 dark:text-emerald-200",
  desejos:
    "border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-500/40 dark:bg-sky-500/10 dark:text-sky-200",
  objetivos:
    "border-purple-200 bg-purple-50 text-purple-700 dark:border-purple-500/40 dark:bg-purple-500/10 dark:text-purple-200",
};

const BUCKET_OPTION_STYLES: Record<
  BudgetRuleBucket,
  {
    option: string;
    indicator: string;
    valueText: string;
    percentText: string;
  }
> = {
  necessidades: {
    option:
      "text-emerald-700 data-[highlighted]:bg-emerald-500/10 data-[state=checked]:bg-emerald-500/20 data-[state=checked]:text-emerald-900 dark:text-emerald-200 dark:data-[highlighted]:bg-emerald-500/20 dark:data-[state=checked]:bg-emerald-500/30 dark:data-[state=checked]:text-emerald-100",
    indicator: "bg-emerald-500",
    valueText: "text-emerald-700 dark:text-emerald-200",
    percentText: "text-emerald-600 dark:text-emerald-300",
  },
  desejos: {
    option:
      "text-sky-700 data-[highlighted]:bg-sky-500/10 data-[state=checked]:bg-sky-500/20 data-[state=checked]:text-sky-900 dark:text-sky-200 dark:data-[highlighted]:bg-sky-500/20 dark:data-[state=checked]:bg-sky-500/30 dark:data-[state=checked]:text-sky-100",
    indicator: "bg-sky-500",
    valueText: "text-sky-700 dark:text-sky-200",
    percentText: "text-sky-600 dark:text-sky-300",
  },
  objetivos: {
    option:
      "text-purple-700 data-[highlighted]:bg-purple-500/10 data-[state=checked]:bg-purple-500/20 data-[state=checked]:text-purple-900 dark:text-purple-200 dark:data-[highlighted]:bg-purple-500/20 dark:data-[state=checked]:bg-purple-500/30 dark:data-[state=checked]:text-purple-100",
    indicator: "bg-purple-500",
    valueText: "text-purple-700 dark:text-purple-200",
    percentText: "text-purple-600 dark:text-purple-300",
  },
};

type BudgetRuleSelectProps = {
  name: string;
  id?: string;
  value?: BudgetRuleBucket;
  onValueChange?: (value: BudgetRuleBucket) => void;
  required?: boolean;
  placeholder?: string;
  percentages: BudgetRulePercentages;
  disabled?: boolean;
  className?: string;
};

export function BudgetRuleSelect({
  name,
  id,
  value,
  onValueChange,
  required,
  placeholder = "Selecione",
  percentages,
  disabled,
  className,
}: BudgetRuleSelectProps) {
  const triggerStyles = value ? BUCKET_TRIGGER_STYLES[value] : undefined;

  return (
    <Select
      name={name}
      value={value}
      onValueChange={(nextValue) =>
        onValueChange?.(nextValue as BudgetRuleBucket)
      }
      required={required}
      disabled={disabled}
    >
      <SelectTrigger
        id={id}
        className={cn(
          "w-full transition-colors",
          className,
          triggerStyles,
          !value && "text-muted-foreground",
        )}
      >
        {value ? (
          <span className="flex w-full items-center justify-between gap-2">
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  BUCKET_OPTION_STYLES[value].indicator,
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  BUCKET_OPTION_STYLES[value].valueText,
                )}
              >
                {formatBucketLabel(value)}
              </span>
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                BUCKET_OPTION_STYLES[value].percentText,
              )}
            >
              {percentages[value]}%
            </span>
          </span>
        ) : (
          <SelectValue placeholder={placeholder} />
        )}
      </SelectTrigger>
      <SelectContent>
        {BUDGET_RULE_BUCKETS.map((bucket) => (
          <SelectItem
            key={bucket}
            value={bucket}
            className={cn(
              "flex items-center justify-between gap-2 rounded-md text-sm capitalize transition-colors",
              BUCKET_OPTION_STYLES[bucket].option,
            )}
          >
            <span className="flex items-center gap-2">
              <span
                className={cn(
                  "size-2.5 rounded-full",
                  BUCKET_OPTION_STYLES[bucket].indicator,
                )}
              />
              <span className="font-medium">{formatBucketLabel(bucket)}</span>
            </span>
            <span
              className={cn(
                "text-xs font-semibold",
                BUCKET_OPTION_STYLES[bucket].percentText,
              )}
            >
              {percentages[bucket]}%
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
