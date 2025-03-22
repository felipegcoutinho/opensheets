import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "@/actions/accounts";
import { getSumBillsExpensePaid } from "@/actions/bills";
import {
  getBillsByResponsavel,
  getExpense,
  getExpenseBill,
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
      despesasBoletos,
      receitasAnterior,
      despesasAnterior,
      despesasBoletosAnterior,
      previstoAnterior,
      invoices,
      expenseByCategory,
      incomeByCategory,
      invoiceBill,
      sumAccountIncome,
      sumAccountExpense,
      sumBillsExpense,
      userName,
      recentsTransactions,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getExpenseBill(month),
      getIncome(previousMonth),
      getExpense(previousMonth),
      getExpenseBill(previousMonth),
      getLastPrevious(month),
      getInvoiceList(month),
      getExpenseByCategory(month),
      getIncomeByCategory(month),
      getBillsByResponsavel(month),
      getSumAccountIncomePaid(defaultPeriodo),
      getSumAccountExpensePaid(defaultPeriodo),
      getSumBillsExpensePaid(defaultPeriodo),
      getUserName(),
      getRecentTransactions(month),
    ]);

    // Memoized calculations
    const despesasTotal = despesas + despesasBoletos;
    const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;
    const balanco = receitas - despesasTotal;
    const balancoAnterior = receitasAnterior - despesasTotalAnterior;
    const previsto = previstoAnterior + balanco;

    const saldo = sumAccountIncome - sumAccountExpense - sumBillsExpense;

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
        color: "bg-violet-400",
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
      invoiceBill,
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
