import { fetchAllData } from "@/app/actions/fetch-all-data";
import {
  getIncomeExpenseByPeriods,
  getCategoryTotals,
} from "@/app/actions/transactions/fetch_transactions";
import { cache } from "react";

type ChartPoint = {
  month: string;
  incomes: number;
  expenses: number;
  balanco: number;
};

export type PainelData = {
  month: string;
  chart: ChartPoint[];
  summary: {
    title: string;
    value: number;
    previousValue: number;
    information: string;
  }[];
  incomes: number;
  expenses: number;
  sumPaidIncome: number;
  sumPaidExpense: number;
  saldo: number;
  previstoAnterior: number;
  bills: any;
  invoices: any;
  recentTransactions: any[];
  topExpenses: any[];
  topEstablishments: { descricao: string; count: number; total: number; sample?: any }[];
  account: any[];
  budgets: any[];
  transactionsByCategory: any[];
  categoryData: {
    tipo_transacao: string;
    categoria: string;
    total: number;
    id: string;
    icone?: string;
  }[];
  conditions: any[];
  payment: any[];
};

export const buildPainelData = cache(
  async (month: string): Promise<PainelData> => {
    const {
      bills,
      invoiceList,
      recentTransactions,
      topExpenses,
      topEstablishments,
      sumPaidExpense,
      sumPaidIncome,
      sixmonth,
      account,
      budgets,
      transactionsByCategory,
      conditions,
      payment,
      incomes,
      expenses,
      expensesAnterior,
      incomesAnterior,
      financialResumeByMonth,
      financialResumeByPreviousMonth,
    } = await fetchAllData(month);

    const current = financialResumeByMonth?.[0] || {
      receitas: 0,
      despesas: 0,
      balanco: 0,
      saldo_previsto: 0,
    };

    const previous = financialResumeByPreviousMonth?.[0] || {
      saldo_previsto: 0,
    };
    const previstoAnterior = previous.saldo_previsto || 0;
    const saldo =
      (sumPaidIncome || 0) - (sumPaidExpense || 0) + previstoAnterior;

    // Gráfico dos últimos 6 meses (consulta agregada única)
    const grouped = await getIncomeExpenseByPeriods(sixmonth);
    const chart: ChartPoint[] = grouped.map((g) => {
      const incomesV = g.incomes || 0;
      const expensesV = g.expenses || 0;
      return {
        month: g.periodo.split("-")[0].slice(0, 3),
        incomes: incomesV,
        expenses: expensesV,
        balanco: incomesV - expensesV,
      };
    });

    // KPI cards
    const summary = [
      {
        title: "Receitas",
        value: current.receitas || 0,
        previousValue: incomesAnterior || 0,
        information: "Total de receitas no mês atual (Você)",
      },
      {
        title: "Despesas",
        value: current.despesas || 0,
        previousValue: expensesAnterior || 0,
        information: "Total de despesas no mês atual (Você)",
      },
      {
        title: "Balanço",
        value: current.balanco || (incomes || 0) - (expenses || 0),
        previousValue: (incomesAnterior || 0) - (expensesAnterior || 0),
        information: "Receitas - Despesas do mês atual (Você)",
      },
      {
        title: "Previsto",
        value: current.saldo_previsto || 0,
        previousValue: previstoAnterior,
        information: "Saldo previsto para o mês (Você)",
      },
    ];

    // Totais por categoria via consulta agregada (reduz carga e latência)
    const categoryData = await getCategoryTotals(month);

    return {
      month,
      chart,
      summary,
      incomes: incomes || 0,
      expenses: expenses || 0,
      sumPaidIncome: sumPaidIncome || 0,
      sumPaidExpense: sumPaidExpense || 0,
      saldo,
      previstoAnterior,
      bills,
      invoices: invoiceList,
      recentTransactions,
      topExpenses,
      topEstablishments,
      account,
      budgets,
      transactionsByCategory,
      categoryData,
      conditions,
      payment,
    };
  },
);

export default buildPainelData;
