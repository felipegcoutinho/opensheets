import { fetchAllData } from "@/app/services/fetch-all-data";
import { getExpense, getIncome } from "@/app/services/transacoes";
import { UseDates } from "@/hooks/use-dates";

async function HelperDashboard(month) {
  const { getPreviousMonth, currentMonthName, currentYear } = UseDates();

  const previousMonth = getPreviousMonth(month);

  const {
    incomes,
    expenses,
    previstoAnterior,
    invoiceList,
    expenseByCategory,
    incomeByCategory,
    billsByResponsavel,
    recentTransactions,
    sumAccountIncomePaid,
    sumAccountExpensePaid,
    transactionsByCategory,
    bills,
  } = await fetchAllData(month);

  const receitasAnterior = await getIncome(previousMonth);
  const despesasAnterior = await getExpense(previousMonth);

  // Calcula o saldo geral
  const saldo = sumAccountIncomePaid - sumAccountExpensePaid;
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
      title: "Saldo Previsto",
      value: previsto,
      previousValue: previstoAnterior,
      color: "bg-chart-4",
    },
  ];

  async function getTotalsCategory(month: string) {
    const totals = new Map<string, number>();

    // Primeiro somar transacoes
    transactionsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const valor = parseFloat(item.valor) || 0;
      const tipo = item.tipo_transacao || "despesa"; // Fallback se vier null

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
    incomeByCategory,
    invoiceList,
    billsByResponsavel,
    expenseByCategory,
    recentTransactions,
    summary,
    getTotalsCategory,
  };
}

export default HelperDashboard;
