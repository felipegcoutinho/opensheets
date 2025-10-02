import { getBudgetRuleSnapshot } from "@/app/actions/orcamentos/get_rule_snapshot";
import Widget from "@/components/widget";
import { RiPieChart2Line } from "@remixicon/react";
import RulesWidget from "../rules-widget";

function formatPercent(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 1,
  }).format(value);
}

function humanizePeriod(periodo: string) {
  if (!periodo) return "";
  const [mes, ano] = periodo.split("-");
  if (!mes || !ano) return periodo;
  const label = mes.charAt(0).toUpperCase() + mes.slice(1);
  return `${label} de ${ano}`;
}

export default async function RuleOverviewSection({
  month,
}: {
  month: string;
}) {
  const snapshot = await getBudgetRuleSnapshot(month);
  const formattedMonth = humanizePeriod(month) || month;
  const showBuckets = snapshot.rule.ativada;

  return (
    <Widget
      title="Regra 50/30/20"
      subtitle={
        showBuckets
          ? `Distribuição do mês ${formattedMonth}`
          : `Regra desativada para ${formattedMonth}`
      }
      information="Os cálculos consideram apenas lançamentos do pagador principal no período selecionado."
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiPieChart2Line className="size-4" />
        </span>
      }
    >
      <RulesWidget
        month={month}
        formatPercent={formatPercent}
        humanizePeriod={humanizePeriod}
      />
    </Widget>
  );
}
