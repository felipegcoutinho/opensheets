import { fetchAllData } from "@/app/services/fetch-all-data";

export default async function UtilitiesDashboard(month: string) {
  const {
    incomes,
    expenses,
    previstoAnterior,
    sumPaidExpense,
    sumPaidIncome,
    transactionsByCategory,
    expensesAnterior,
    incomesAnterior,
  } = await fetchAllData(month);

  const saldo = sumPaidIncome - sumPaidExpense;
  const balanco = incomes - expenses;
  const balancoAnterior = incomesAnterior - expensesAnterior;
  const previsto = previstoAnterior + balanco;

  const summary = [
    {
      title: "Receitas",
      value: incomes,
      previousValue: incomesAnterior,
      color: "bg-chart-1",
    },
    {
      title: "Despesas",
      value: expenses,
      previousValue: expensesAnterior,
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

  return {
    incomes,
    expenses,
    saldo,
    incomesAnterior,
    balanco,
    balancoAnterior,
    previsto,
    previstoAnterior,
    summary,
    getTotalsCategory,
  };
}
