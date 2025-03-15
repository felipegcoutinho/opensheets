import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "@/actions/accounts";
import {
  getExpense,
  getExpenseByCategory,
  getIncome,
  getIncomeByCategory,
  getInvoiceList,
  getLastPrevious,
  getRecentTransactions,
} from "@/actions/dashboards";
import { getUserName } from "@/actions/users";
import { UseDates } from "@/hooks/use-dates";
import { useMemo } from "react";

function useUtils(month) {
  const { getPreviousMonth, currentMonthName, currentYear } = UseDates();

  const data = useMemo(async () => {
    const previousMonth = getPreviousMonth(month);
    const defaultPeriodo = `${currentMonthName}-${currentYear}`;

    const [
      receitas,
      despesas,
      receitasAnterior,
      despesasAnterior,
      previstoAnterior,
      invoices,
      expenseByCategory,
      incomeByCategory,
      sumAccountIncome,
      sumAccountExpense,
      userName,
      recentsTransactions,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getIncome(previousMonth),
      getExpense(previousMonth),
      getLastPrevious(month),
      getInvoiceList(month),
      getExpenseByCategory(month),
      getIncomeByCategory(month),
      getSumAccountIncomePaid(defaultPeriodo),
      getSumAccountExpensePaid(defaultPeriodo),
      getUserName(),
      getRecentTransactions(month),
    ]);

    // Memoized calculations
    const despesasTotal = despesas;
    const despesasTotalAnterior = despesasAnterior;
    const balanco = receitas - despesasTotal;
    const balancoAnterior = receitasAnterior - despesasTotalAnterior;
    const previsto = previstoAnterior + balanco;
    const saldo = sumAccountIncome - sumAccountExpense;

    const cardData = [
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
        color: "bg-yellow-400",
      },
      {
        title: "Saldo Previsto",
        value: previsto,
        previousValue: previstoAnterior,
        color: "bg-cyan-400",
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
      invoiceCard: invoices,
      saldo,
      expenseByCategory,
      userName,
      recentsTransactions,
      cardData,
    };
  }, [month, currentMonthName, currentYear]);

  return data;
}

export default useUtils;
