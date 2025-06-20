import { fetchAllData } from "@/app/services/fetch-all-data";

export default async function UtilitiesDashboard(month: string) {
  const {
    incomes,
    expenses,
    sumPaidExpense,
    sumPaidIncome,
    transactionsByCategory,
    expensesAnterior,
    incomesAnterior,
    financialResumeByMonth,
    financialResumeByPreviousMonth,
  } = await fetchAllData(month);

  const data = financialResumeByMonth?.[0] || {
    receitas: 0,
    despesas: 0,
    balanco: 0,
    saldo_previsto: 0,
  };

  const dataAnterior = financialResumeByPreviousMonth?.[0] || {
    saldo_previsto: 0,
  };

  const balanco = incomes - expenses;
  const balancoAnterior = incomesAnterior - expensesAnterior;
  const previstoAnterior = dataAnterior.saldo_previsto || 0;
  const saldo = sumPaidIncome - sumPaidExpense + previstoAnterior;

  const summary = [
    {
      title: "Receitas",
      value: data.receitas,
      previousValue: incomesAnterior,
      color: "bg-chart-1",
    },
    {
      title: "Despesas",
      value: data.despesas,
      previousValue: expensesAnterior,
      color: "bg-chart-2",
    },
    {
      title: "Balanço",
      value: data.balanco,
      previousValue: incomesAnterior - expensesAnterior,
      color: "bg-chart-3",
    },
    {
      title: "Previsto",
      value: data.saldo_previsto,
      previousValue: previstoAnterior,
      color: "bg-chart-4",
    },
  ];

  function getTotalsCategory(month: string) {
    const totals = new Map<string, number>();

    // Primeiro somar transacoes
    transactionsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const id = item.categoria?.id || "sem_categoria";
      const valor = parseFloat(item.valor) || 0;
      const tipo = item.tipo_transacao || "despesa";

      const chave = `${tipo}:${categoriaNome}:${id}`;

      totals.set(chave, (totals.get(chave) || 0) + valor);
    });

    // Transformar o Map em array para exibir
    return Array.from(totals.entries()).map(([key, total]) => {
      const [tipo_transacao, categoria, id] = key.split(":");
      return { tipo_transacao, categoria, id, total };
    });
  }

  const categoryData = getTotalsCategory(month);

  return {
    incomes,
    expenses,
    balanco,
    saldo,
    incomesAnterior,
    balancoAnterior,
    previstoAnterior,
    summary,
    categoryData,
  };
}
