import { UseDates } from "@/hooks/use-dates";
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
  const { getPreviousMonth } = UseDates();
  const previousMonth = getPreviousMonth(month);

  // Fetch data for current and previous month in parallel
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
  ]);

  // Calculating totals for current and previous months
  const despesasTotal = despesas + despesasBoletos;
  const despesasTotalAnterior = despesasAnterior + despesasBoletosAnterior;

  // Balance calculations
  const balanco = receitas - despesasTotal;
  const balancoAnterior = receitasAnterior - despesasTotalAnterior;

  // Prediction calculation
  const previsto = saldoAnterior + balanco;

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
    invoiceCard: invoices, // Reusing invoices list as invoiceCard
    invoiceBill,
    expenseByCategory,
  };
}

export default Utils;
