import { ChartSummary } from "@/app/(dashboard)/dashboard/chart-summary";
import SummaryWidget from "@/app/(dashboard)/dashboard/summary-widget";
import { fetchAllData } from "@/app/services/fetch-all-data";
import Widget from "@/components/widget";
import { getMonth } from "@/hooks/get-month";
import {
  ArrowRightLeft,
  ChartColumn,
  ChartNoAxesCombined,
  FileSpreadsheet,
  FileText,
  List,
  Wallet,
} from "lucide-react";
import BillsWidget from "./bills-widget";
import CategoryWidget from "./categories-widget";
import { ConditionWidget } from "./condition-widget";
import InvoiceWidget from "./invoices-widget";
import PaymentStatusWidget from "./payment-status-widget";
import { PaymentWidget } from "./payment-widget";
import RecentesTransactions from "./recents-transactions-widget";
import StatsWidget from "./stats-widget";
import UtilitiesDashboard from "./utilities-dashboard";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const {
    bills,
    invoiceList,
    recentTransactions,
    sumPaidExpense,
    sumPaidIncome,
    transactionsStats,
    billsStats,
    cardsStats,
    accountsStats,
    notesStats,
    sixmonth,
  } = await fetchAllData(month);

  const allData = await Promise.all(
    sixmonth.map((month) => UtilitiesDashboard(month)),
  );

  const { incomes, expenses, summary, getTotalsCategory } =
    await UtilitiesDashboard(month);

  const categoryData = getTotalsCategory(month);

  const chartData = sixmonth.map((month, index) => ({
    month: month.split("-")[0].slice(0, 3),
    incomes: allData[index].incomes,
    expenses: allData[index].expenses,
    balanco: allData[index].balanco,
  }));

  return (
    <section>
      <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item, index) => (
          <SummaryWidget
            previousValue={item.previousValue}
            title={item.title}
            value={item.value}
            key={index}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <Widget
          title="Receita, Despesa e Balanço"
          subtitle="Últimos 6 Meses"
          icon={<ChartNoAxesCombined className="mr-2 inline size-4" />}
        >
          <ChartSummary data={chartData} />
        </Widget>

        <Widget
          title="Faturas"
          subtitle="faturas deste mês"
          icon={<FileSpreadsheet className="mr-2 inline size-4" />}
        >
          <InvoiceWidget month={month} data={invoiceList} />
        </Widget>

        <Widget
          title="Boletos"
          subtitle="boletos deste mês"
          icon={<FileText className="mr-2 inline size-4" />}
        >
          <BillsWidget month={month} data={bills} />
        </Widget>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <Widget
          title="Lançamentos Recentes"
          subtitle="Últimos 5 Lançamentos"
          icon={<ArrowRightLeft className="mr-2 inline size-4" />}
        >
          <RecentesTransactions transactions={recentTransactions} />
        </Widget>

        <Widget
          title="Status de Pagamento"
          subtitle={"Pagamentos Pagos e Pendentes"}
          icon={<Wallet className="mr-2 inline size-4" />}
        >
          <PaymentStatusWidget
            expenses={expenses}
            incomes={incomes}
            sumPaidExpense={sumPaidExpense}
            sumPaidIncome={sumPaidIncome}
          />
        </Widget>

        <Widget
          title="Resumo do Mês"
          subtitle="Principais Resumos"
          icon={<ChartColumn className="mr-2 inline size-4" />}
        >
          <StatsWidget
            month={month}
            transactionsStats={transactionsStats}
            billsStats={billsStats}
            cardsStats={cardsStats}
            accountsStats={accountsStats}
            notesStats={notesStats}
          />
        </Widget>
      </div>

      <div className="my-2 mb-10 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <Widget
          title="Condições de Pagamento"
          subtitle={"Principais Condições de Pagamento"}
          icon={<Wallet className="mr-2 inline size-4" />}
        >
          <ConditionWidget month={month} />
        </Widget>

        <Widget
          title="Formas de Pagamentos"
          subtitle={"Principais Formas de Pagamento"}
          icon={<Wallet className="mr-2 inline size-4" />}
        >
          <PaymentWidget month={month} />
        </Widget>

        <Widget
          title="Receitas por Categoria"
          subtitle="Principais Categorias por Receita"
          icon={<List className="mr-2 inline size-4" />}
        >
          <CategoryWidget
            data={categoryData}
            tipo="receita"
            totalReceita={incomes}
            month={month}
          />
        </Widget>

        <Widget
          title="Despesas por Categoria"
          subtitle="Principais Categorias por Despesa"
          icon={<List className="mr-2 inline size-4" />}
        >
          <CategoryWidget
            data={categoryData}
            tipo="despesa"
            totalReceita={incomes}
            month={month}
          />
        </Widget>
      </div>
    </section>
  );
}
