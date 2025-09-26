import { getBudgetRule } from "@/app/actions/orcamentos/fetch_budget_rule";
import { BudgetRuleCard } from "../rule/budget-rule-card";

export default async function Rule502030Section() {
  const rule = await getBudgetRule();

  return <BudgetRuleCard initialRule={rule} />;
}
