import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { UseDates } from "@/hooks/use-dates";
import { getSession } from "./users/fetch_users";
import {
  getBills,
  getConditions,
  getExpense,
  getFinancialSummaryForPeriod,
  getIncome,
  getPaidExpense,
  getPayment,
  getRecentTransactions,
  getSumPaidExpense,
  getSumPaidIncome,
  getTransactionsByCategory,
} from "@/app/actions/transactions/fetch_transactions";
import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";

type FetchAllDataReturn = {
  incomes: number | null;
  incomesAnterior: number | null;
  expenses: number | null;
  expensesAnterior: number | null;
  bills: any;
  expensePaid: any;
  conditions: any;
  payment: any;
  transactionsByCategory: any;
  recentTransactions: any;
  sumPaidExpense: number | null;
  sumPaidIncome: number | null;
  invoiceList: any;
  sixmonth: any;
  financialResumeByMonth: any;
  financialResumeByPreviousMonth: any;
  account: any;
  budgets: any;
};

export async function fetchAllData(month: string): Promise<FetchAllDataReturn> {
  const { getPreviousMonth, getLastSixMonths } = UseDates();
  const previousMonth = getPreviousMonth(month);
  const userId = await getSession();

  const fetchMap: Record<keyof FetchAllDataReturn, Promise<any>> = {
    incomes: getIncome(month),
    incomesAnterior: getIncome(previousMonth),
    expenses: getExpense(month),
    expensesAnterior: getExpense(previousMonth),
    bills: getBills(month),
    expensePaid: getPaidExpense(month),
    conditions: getConditions(month),
    payment: getPayment(month),
    transactionsByCategory: getTransactionsByCategory(month),
    recentTransactions: getRecentTransactions(month),
    sumPaidExpense: getSumPaidExpense(month),
    sumPaidIncome: getSumPaidIncome(month),
    invoiceList: getInvoiceList(month),
    sixmonth: getLastSixMonths(month),
    financialResumeByMonth: getFinancialSummaryForPeriod(userId.id, month),
    financialResumeByPreviousMonth: getFinancialSummaryForPeriod(
      userId.id,
      previousMonth,
    ),
    account: getAccount(),
    budgets: getBudgets(month),
  };

  const results = await Promise.allSettled(Object.values(fetchMap));
  const keys = Object.keys(fetchMap) as (keyof FetchAllDataReturn)[];

  const finalResult: Partial<FetchAllDataReturn> = {};

  results.forEach((res, index) => {
    const key = keys[index];
    if (res.status === "fulfilled") {
      finalResult[key] = res.value;
    } else {
      console.error(`Erro ao buscar ${key}:`, res.reason);
      finalResult[key] = null;
    }
  });

  return finalResult as FetchAllDataReturn;
}
