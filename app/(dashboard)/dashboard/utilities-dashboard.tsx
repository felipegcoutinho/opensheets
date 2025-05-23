import { fetchAllData } from "@/app/services/fetch-all-data";
import { getExpense, getIncome } from "@/app/services/transacoes";
import { UseDates } from "@/hooks/use-dates";

export default async function UtilitiesDashboard(month: string) {
  const { getPreviousMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);

  const {
    incomes,
    expenses,
    bills,
    previstoAnterior,
    sumPaidExpense,
    sumPaidIncome,
    transactionsByCategory,
  } = await fetchAllData(month);

  const receitasAnterior = await getIncome(previousMonth);
  const despesasAnterior = await getExpense(previousMonth);

  const saldo = sumPaidIncome - sumPaidExpense;
  const balanco = incomes - expenses;
  const balancoAnterior = receitasAnterior - despesasAnterior;
  const previsto = previstoAnterior + balanco;

  const summary = [
    {
      title: "Receitas",
      value: incomes,
      previousValue: receitasAnterior,
      color: "bg-chart-1",
    },
    {
      title: "Despesas",
      value: expenses,
      previousValue: despesasAnterior,
      color: "bg-chart-2",
    },
    {
      title: "Balanço",
      value: balanco,
      previousValue: balancoAnterior,
      color: "bg-chart-3",
    },
    {
      title: "Previsto",
      value: previsto,
      previousValue: previstoAnterior,
      color: "bg-chart-4",
    },
  ];

  function getTotalsCategory(month: string) {
    const totals = new Map<string, number>();

    // Primeiro somar transacoes
    transactionsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const valor = parseFloat(item.valor) || 0;
      const tipo = item.tipo_transacao || "despesa";

      const chave = `${tipo}:${categoriaNome}`;

      totals.set(chave, (totals.get(chave) || 0) + valor);
    });

    // Transformar o Map em array para exibir
    return Array.from(totals.entries()).map(([key, total]) => {
      const [tipo_transacao, categoria] = key.split(":");
      return { tipo_transacao, categoria, total };
    });
  }

  return {
    incomes,
    expenses,
    bills,
    saldo,
    receitasAnterior,
    balanco,
    balancoAnterior,
    previsto,
    previstoAnterior,
    summary,
    getTotalsCategory,
  };
}
