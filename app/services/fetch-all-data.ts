import { getNotesStats } from "@/services/anotacoes";
import {
  getBillsByResponsavel,
  getBillsStats,
  getExpenseBill,
  getExpenseBillPaid,
  getSumBillsExpensePaid,
} from "@/services/boletos";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import {
  getConditions,
  getExpense,
  getExpenseByCategory,
  getExpensePaid,
  getIncome,
  getIncomeByCategory,
  getLastPrevious,
  getPayment,
  getRecentTransactions,
  getSumAccountExpensePaid,
  getSumAccountIncomePaid,
  getTransactionsStats,
} from "@/services/transacoes";
import { createClient } from "@/utils/supabase/server";

export async function fetchAllData(month :string) {
  try {
    const [
      receitas,
      despesas,
      previstoAnterior,
      despesasBoletos,
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
      expenseByCategory,
      incomeByCategory,
      recentTransactions,
      sumAccountExpensePaid,
      sumAccountIncomePaid,
      sumBillsExpensePaid,
      invoiceList,
    ] = await Promise.all([
      getIncome(month),
      getExpense(month),
      getLastPrevious(month),
      getExpenseBill(month),
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
      getExpenseByCategory(month),
      getIncomeByCategory(month),
      getRecentTransactions(month),
      getSumAccountExpensePaid(month),
      getSumAccountIncomePaid(month),
      getSumBillsExpensePaid(month),
      getInvoiceList(month),
    ]);

    async function getInvoiceList(month) {
      const supabase = createClient();

      const { data, error } = await supabase.rpc("getinvoicelists", { month });
      if (error) throw error;

      return data;
    }


    return {
      receitas,
      despesas,
      previstoAnterior,
      despesasBoletos,
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
      expenseByCategory,
      incomeByCategory,
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
