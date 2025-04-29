import { getExpenseBill } from "@/app/services/boletos";
import { fetchAllData } from "@/app/services/fetch-all-data";
import { getExpense, getIncome } from "@/app/services/transacoes";
import { UseDates } from "@/hooks/use-dates";

async function useUtils(month) {
  const { getPreviousMonth, currentMonthName, currentYear } = UseDates();

  const previousMonth = getPreviousMonth(month);

  const {
    receitas,
    despesas: despesasCartoes,
    despesasBoletos,
    previstoAnterior,
    invoiceList,
    expenseByCategory,
    incomeByCategory,
    billsByResponsavel,
    recentTransactions,
    sumAccountIncomePaid,
    sumAccountExpensePaid,
    sumBillsExpensePaid,
    transactionsByCategory,
    billsByCategory,
  } = await fetchAllData(month);

  const receitasAnterior = await getIncome(previousMonth);
  const despesasCartoesAnterior = await getExpense(previousMonth);
  const despesasBoletosAnterior = await getExpenseBill(previousMonth);

  // Calcula o saldo geral
  const despesasTotal = despesasCartoes + despesasBoletos;
  const despesasTotalAnterior =
    despesasCartoesAnterior + despesasBoletosAnterior;
  const balanco = receitas - despesasTotal;
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;
  const previsto = previstoAnterior + balanco;

  const saldo =
    sumAccountIncomePaid - sumAccountExpensePaid - sumBillsExpensePaid;

  const summary = [
    {
      title: "Receitas",
      value: receitas,
      previousValue: receitasAnterior,
      color: "bg-chart-1",
    },
    {
      title: "Despesas",
      value: despesasTotal,
      previousValue: despesasTotalAnterior,
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

    // Depois somar boletos (considerando sempre como 'despesa')
    billsByCategory.forEach((item) => {
      const categoriaNome = item.categoria?.nome || "Sem Categoria";
      const valor = parseFloat(item.valor) || 0;
      const tipo = "despesa";

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
    receitas,
    receitasAnterior,
    despesasTotal,
    despesasTotalAnterior,
    balanco,
    balancoAnterior,
    previsto,
    previstoAnterior,
    incomeByCategory,
    invoiceList,
    billsByResponsavel,
    saldo,
    expenseByCategory,
    recentTransactions,
    summary,
    getTotalsCategory,
  };
}

export default useUtils;
