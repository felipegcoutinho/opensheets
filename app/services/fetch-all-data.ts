import { UseDates } from "@/hooks/use-dates";
import { getNotesStats } from "@/services/anotacoes";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getInvoiceList } from "@/services/faturas";
import {
  getBills,
  getBillsStats,
  getConditions,
  getExpense,
  getIncome,
  getLastPrevious,
  getPaidExpense,
  getPayment,
  getRecentTransactions,
  getSumPaidExpense,
  getSumPaidIncome,
  getTransactionsByCategory,
  getTransactionsStats,
} from "@/services/transacoes";

export async function fetchAllData(month: string) {
  const { getPreviousMonth, getLastSixMonths } = UseDates();

  const previousMonth = getPreviousMonth(month);
  const sixmonth = getLastSixMonths(month);

  try {
    const [
      incomes,
      incomesAnterior,
      expenses,
      expensesAnterior,
      bills,
      previstoAnterior,
      expensePaid,
      conditions,
      payment,
      transactionsByCategory,
      recentTransactions,
      sumPaidExpense,
      sumPaidIncome,
      invoiceList,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
    ] = await Promise.all([
      getIncome(month),
      getIncome(previousMonth),
      getExpense(month),
      getExpense(previousMonth),
      getBills(month),
      getLastPrevious(month),
      getPaidExpense(month),
      getConditions(month),
      getPayment(month),
      getTransactionsByCategory(month),
      getRecentTransactions(month),
      getSumPaidExpense(month),
      getSumPaidIncome(month),
      getInvoiceList(month),
      getTransactionsStats(month),
      getBillsStats(month),
      getCardsStats(month),
      getAccountsStats(month),
      getNotesStats(month),
    ]);

    return {
      incomes,
      incomesAnterior,
      expenses,
      expensesAnterior,
      bills,
      previstoAnterior,
      expensePaid,
      conditions,
      payment,
      transactionsByCategory,
      recentTransactions,
      sumPaidExpense,
      sumPaidIncome,
      invoiceList,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
      sixmonth,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
