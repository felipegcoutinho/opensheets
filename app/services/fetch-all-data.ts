import { getNotesStats } from "@/services/anotacoes";
import {
  getBillsByCategory,
  getBillsByResponsavel,
  getBillsStats,
  getExpenseBillPaid,
  getSumBillsExpensePaid,
} from "@/services/boletos";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getInvoiceList } from "@/services/faturas";
import {
  getConditions,
  getExpense,
  getExpensePaid,
  getIncome,
  getLastPrevious,
  getPayment,
  getRecentTransactions,
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
  getTransactionsByCategory,
  getTransactionsStats,
} from "@/services/transacoes";

export async function fetchAllData(month: string) {
  try {
    const [
      receitas,
      despesas,
      previstoAnterior,
      expensePaid,
      expenseBillPaid,
      conditions,
      payment,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
      billsByResponsavel,
      transactionsByCategory,
      billsByCategory,
      recentTransactions,
      sumAccountExpensePaid,
      sumAccountIncomePaid,
      sumBillsExpensePaid,
      invoiceList,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getLastPrevious(month),
      getExpensePaid(month),
      getExpenseBillPaid(month),
      getConditions(month),
      getPayment(month),
      getTransactionsStats(month),
      getBillsStats(month),
      getCardsStats(),
      getAccountsStats(),
      getNotesStats(month),
      getBillsByResponsavel(month),
      getTransactionsByCategory(month),
      getBillsByCategory(month),
      getRecentTransactions(month),
      getSumAccountExpensePaid(month),
      getSumAccountIncomePaid(month),
      getSumBillsExpensePaid(month),
      getInvoiceList(month),
    ]);

    return {
      receitas,
      despesas,
      previstoAnterior,
      expensePaid,
      expenseBillPaid,
      conditions,
      payment,
      transactionsStats,
      billsStats,
      cardsStats,
      accountsStats,
      notesStats,
      billsByResponsavel,
      transactionsByCategory,
      billsByCategory,
      recentTransactions,
      sumAccountExpensePaid,
      sumAccountIncomePaid,
      sumBillsExpensePaid,
      invoiceList,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
