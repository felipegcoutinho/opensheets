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
      color: "bg-green-400",
    },
    {
      title: "Despesas",
      value: despesasTotal,
      previousValue: despesasTotalAnterior,
      color: "bg-red-500",
    },
    {
      title: "Balanço",
      value: balanco,
      previousValue: balancoAnterior,
      color: "bg-violet-500",
    },
    {
      title: "Saldo Previsto",
      value: previsto,
      previousValue: previstoAnterior,
      color: "bg-amber-500",
    },
  ];

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
  };
}

export default useUtils;
