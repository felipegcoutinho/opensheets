import { cache } from "react";
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

export const fetchAllData = cache(async (month: string) => {
  const { getPreviousMonth, getLastSixMonths } = UseDates();

  const previousMonth = getPreviousMonth(month);
  const sixmonth = getLastSixMonths(month);

  const promises = [
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
  ];

  const resultados = await Promise.allSettled(promises);

  // Mapeia os dados com fallback em caso de erro
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
  ] = resultados.map((res, index) => {
    if (res.status === "fulfilled") return res.value;

    const nomes = [
      "incomes",
      "incomesAnterior",
      "expenses",
      "expensesAnterior",
      "bills",
      "previstoAnterior",
      "expensePaid",
      "conditions",
      "payment",
      "transactionsByCategory",
      "recentTransactions",
      "sumPaidExpense",
      "sumPaidIncome",
      "invoiceList",
      "transactionsStats",
      "billsStats",
      "cardsStats",
      "accountsStats",
      "notesStats",
    ];

    console.error(`Erro ao buscar ${nomes[index]}:`, res.reason);
    return null; // ou undefined, se preferir
  });

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
});
