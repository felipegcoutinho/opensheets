import { getAccount } from "@/app/actions/accounts/fetch_accounts";
import { getInvoiceList } from "@/app/actions/invoices/fetch_invoices";
import { getBudgets } from "@/app/actions/orcamentos/fetch_budgets";
import {
  getBills,
  getExpenseAggregations,
  getFinancialSummaryForPeriod,
  getRecentTransactions,
  getTransactionsByCategory,
  getIncomeExpenseByPeriods,
  getSumPaidByType,
} from "@/app/actions/transactions/fetch_transactions";
import { getTopExpenses, getTopEstablishments } from "@/app/actions/transactions/fetch_transactions";
import { UseDates } from "@/hooks/use-dates";
import { cache } from "react";
import { getUserSession } from "./users/fetch_users";

type FetchAllDataReturn = {
  incomes: number | null;
  incomesAnterior: number | null;
  expenses: number | null;
  expensesAnterior: number | null;
  bills: any;
  conditions: any;
  payment: any;
  transactionsByCategory: any;
  recentTransactions: any;
  topExpenses: any;
  topEstablishments: any;
  sumPaidExpense: number | null;
  sumPaidIncome: number | null;
  invoiceList: any;
  sixmonth: any;
  financialResumeByMonth: any;
  financialResumeByPreviousMonth: any;
  account: any;
  budgets: any;
};

export const fetchAllData = cache(
  async (month: string): Promise<FetchAllDataReturn> => {
    const { getPreviousMonth, getLastSixMonths } = UseDates();
    const previousMonth = getPreviousMonth(month);
    const userId = await getUserSession();

    const aggPromise = getExpenseAggregations(month);

    const incExpAgg = getIncomeExpenseByPeriods([month, previousMonth]);
    const paidAgg = getSumPaidByType(month);

    const fetchMap: Record<keyof FetchAllDataReturn, Promise<any>> = {
      incomes: incExpAgg.then((r) => r.find((x) => x.periodo === month)?.incomes ?? 0),
      incomesAnterior: incExpAgg.then((r) => r.find((x) => x.periodo === previousMonth)?.incomes ?? 0),
      expenses: incExpAgg.then((r) => r.find((x) => x.periodo === month)?.expenses ?? 0),
      expensesAnterior: incExpAgg.then((r) => r.find((x) => x.periodo === previousMonth)?.expenses ?? 0),
      bills: getBills(month),
      conditions: aggPromise.then((r) => r.conditions),
      payment: aggPromise.then((r) => r.payments),
      transactionsByCategory: getTransactionsByCategory(month),
      recentTransactions: getRecentTransactions(month),
      topExpenses: getTopExpenses(month, 30),
      topEstablishments: getTopEstablishments(month),
      sumPaidExpense: paidAgg.then((r) => r.expense),
      sumPaidIncome: paidAgg.then((r) => r.income),
      invoiceList: getInvoiceList(month),
      sixmonth: Promise.resolve(getLastSixMonths(month)),
      financialResumeByMonth: userId?.id
        ? getFinancialSummaryForPeriod(userId.id, month)
        : Promise.resolve(null),
      financialResumeByPreviousMonth: userId?.id
        ? getFinancialSummaryForPeriod(userId.id, previousMonth)
        : Promise.resolve(null),
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
  },
);
