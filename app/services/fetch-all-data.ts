import { getNotesStats } from "@/services/anotacoes";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getInvoiceList } from "@/services/faturas";
import {
  getBills,
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
  try {
    const [
      incomes,
      expenses,
      bills,
      previstoAnterior,
      expensePaid,
      conditions,
      payment,
      transactionsStats,
      cardsStats,
      accountsStats,
      notesStats,
      transactionsByCategory,
      recentTransactions,
      sumAccountExpensePaid,
      sumAccountIncomePaid,
      invoiceList,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getBills(month),
      getLastPrevious(month),
      getPaidExpense(month),
      getConditions(month),
      getPayment(month),
      getTransactionsStats(month),
      getCardsStats(),
      getAccountsStats(),
      getNotesStats(month),
      getTransactionsByCategory(month),
      getRecentTransactions(month),
      getSumPaidExpense(month),
      getSumPaidIncome(month),
      getInvoiceList(month),
    ]);

    return {
      incomes,
      expenses,
      bills,
      previstoAnterior,
      expensePaid,
      conditions,
      payment,
      transactionsStats,
      cardsStats,
      accountsStats,
      notesStats,
      transactionsByCategory,
      recentTransactions,
      sumAccountExpensePaid,
      sumAccountIncomePaid,
      invoiceList,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
