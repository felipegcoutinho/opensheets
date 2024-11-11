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
    saldoAnterior,
    invoices,
    expenseByCategory,
    incomeByCategory,
    invoiceBill,
    sumAccountIncome,
    sumAccountExpense,
    sumBillsExpense,
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
  ]);

  // Calculating totals for current and previous months
  const despesasTotal = despesas + despesasBoletos;
  const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;

  // Balance calculations
  const balanco = receitas - despesasTotal;
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Prediction calculation
  const previsto = saldoAnterior + balanco;

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
    saldoAnterior,
    incomeByCategory,
    invoiceCard: invoices,
    invoiceBill,
    saldo,
    expenseByCategory,
  };
}

export default Utils;
