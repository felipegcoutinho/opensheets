import { UseDates } from "@/hooks/use-dates";
import {
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
} from "../actions/accounts";
import { getSumBillsExpensePaid } from "../actions/bills";
import {
  getBillsByResponsavel,
  getExpense,
  getExpenseBill,
  getExpenseByCategory,
  getIncome,
  getIncomeByCategory,
  getInvoiceList,
  getLastPrevious,
} from "../actions/dashboards";
import { getUserName } from "../actions/users";

async function Utils(month) {
  const { getPreviousMonth, currentMonthName, currentYear } = UseDates();

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
  ]);

  // Calculating totals for current and previous months
  const despesasTotal = despesas + despesasBoletos;
  const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;

  // Balance calculations
  const balanco = receitas - despesasTotal;
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Prediction calculation
  const previsto = previstoAnterior + balanco;

  //Calculo do saldo atual
  const saldo = sumAccountIncome - sumAccountExpense - sumBillsExpense;

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
  };
}

export default Utils;
