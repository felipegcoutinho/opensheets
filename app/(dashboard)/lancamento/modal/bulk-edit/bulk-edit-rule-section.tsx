import { BUDGET_RULE_BUCKETS, formatBucketLabel, type BudgetRuleConfig } from "@/app/(dashboard)/orcamento/rule/budget-rule";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface BulkEditRuleSectionProps {
  applyRule: boolean;
  ruleSelection: string;
  onRuleChange: (value: string) => void;
  onApplyRuleChange: (value: boolean) => void;
  disabled: boolean;
  disabledByRule: boolean;
  budgetRule: BudgetRuleConfig;
  hasExpense: boolean;
}

export function BulkEditRuleSection({
  applyRule,
  ruleSelection,
  onRuleChange,
  onApplyRuleChange,
  disabled,
  disabledByRule,
  budgetRule,
  hasExpense,
}: BulkEditRuleSectionProps) {
  return (
    <fieldset className="space-y-2 border-b border-dashed pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <Label className="text-sm">Regra 50/30/20</Label>
          <p className="text-muted-foreground text-xs">
            Aplique uma faixa da regra ou remova a marcação atual.
          </p>
        </div>
        <Switch
          checked={applyRule}
          onCheckedChange={onApplyRuleChange}
          aria-label="Aplicar regra 50/30/20"
          disabled={disabled}
        />
      </div>
      {!budgetRule?.ativada ? (
        <p className="text-muted-foreground text-xs">
          Ative a regra 50/30/20 nas configurações para liberar este
          ajuste.
        </p>
      ) : (
        <Select
          name="regra_502030_tipo"
          value={ruleSelection}
          onValueChange={onRuleChange}
          disabled={
            !applyRule || disabled || disabledByRule
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Escolha como aplicar" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__clear__">
              Remover marcação 50/30/20
            </SelectItem>
            {BUDGET_RULE_BUCKETS.map((bucket) => (
              <SelectItem
                key={bucket}
                value={bucket}
                className="capitalize"
              >
                {formatBucketLabel(bucket)} (
                {budgetRule.percentuais[bucket]}%)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
      {applyRule && hasExpense ? (
        <p className="text-muted-foreground text-xs">
          Apenas despesas serão consideradas na distribuição da regra.
        </p>
      ) : null}
    </fieldset>
  );
}