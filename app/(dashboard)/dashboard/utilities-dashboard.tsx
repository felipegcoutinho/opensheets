import { fetchAllData } from "@/app/actions/fetch-all-data";

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
      information:
        "Total de receitas no mês atual. Inclui apenas receitas de Você",
    },
    {
      title: "Despesas",
      value: data.despesas,
      previousValue: expensesAnterior,
      color: "bg-chart-2",
      information:
        "Total de despesas no mês atual. Inclui apenas despesas de Você",
    },
    {
      title: "Balanço",
      value: data.balanco,
      previousValue: incomesAnterior - expensesAnterior,
      color: "bg-chart-3",
      information:
        "Balanço do mês atual. Calculado como Receitas - Despesas. Inclui apenas transações de Você",
    },
    {
      title: "Previsto",
      value: data.saldo_previsto,
      previousValue: previstoAnterior,
      color: "bg-chart-4",
      information:
        "Saldo previsto para o mês atual. Inclui apenas transações de Você",
    },
  ];

  function getTotalsCategory(month: string) {
    const totals = new Map<string, { total: number; icon?: string }>();

    // Primeiro somar transacoes
    transactionsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const id = item.categoria?.id || "sem_categoria";
      const icone = item.categoria?.icone;
      const valor = parseFloat(item.valor) || 0;
      const tipo = item.tipo_transacao || "despesa";

      const chave = `${tipo}:${categoriaNome}:${id}`;
      const entry = totals.get(chave) || { total: 0, icon: icone };
      entry.total += valor;
      entry.icon = icone;
      totals.set(chave, entry);
    });

    // Transformar o Map em array para exibir
    return Array.from(totals.entries()).map(([key, data]) => {
      const [tipo_transacao, categoria, id] = key.split(":");
      return {
        tipo_transacao,
        categoria,
        id,
        total: data.total,
        icone: data.icon,
      };
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
