import useUtils from "../app/(dashboard)/dashboard/utils";
import { getPeriodo } from "../hooks/periodo";
import { UseDates } from "../hooks/use-dates";

export async function fetchFinancialData() {
  const month = await getPeriodo();
  const { getLastSixMonths } = await UseDates();

  const sixMonths = await getLastSixMonths(month);
  const allData = await Promise.all(sixMonths.map((month) => useUtils(month)));

  const chartData = sixMonths.map((month, index) => ({
    month: month.split("-")[0].slice(0, 3),
    receita: allData[index].receitas,
    despesa: allData[index].despesasTotal,
    balanco: allData[index].balanco,
  }));

  return {
    chartData,
    incomeByCategory: allData[0].incomeByCategory,
    expenseByCategory: allData[0].expenseByCategory,
    recentTransactions: allData[0].recentTransactions,
    summary: allData[0].summary,
  };
}
