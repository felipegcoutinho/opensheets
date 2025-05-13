import SummaryWidget from "@/app/(dashboard)/dashboard/summary-widget";
import { ChartSummary } from "@/app/(dashboard)/dashboard/chart-summary";
import Widget from "@/components/widget";
import { getMonth } from "@/hooks/get-month";
import { UseDates } from "@/hooks/use-dates";
import { getNotesStats } from "@/services/anotacoes";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getBillsStats, getTransactionsStats } from "@/services/transacoes";
import BillsWidget from "./bills-widget";
import CategoryWidget from "./categories-widget";
import { ConditionWidget } from "./condition-widget";
import InvoiceWidget from "./invoices-widget";
import { PaymentWidget } from "./payment-widget";
import RecentesTransactions from "./recents-transactions-widget";
import StatsWidget from "./stats-widget";
import helperDashboard from "./helper-dashboard";
import { fetchAllData } from "@/app/services/fetch-all-data";
import PaymentStatusWidget from "./payment-status-widget";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const { getLastSixMonths } = await UseDates();
  const sixmonth = await getLastSixMonths(month);

  const allData = await Promise.all(
    sixmonth.map((month) => helperDashboard(month)),
  );

  const { incomes, expenses, summary, getTotalsCategory } =
    await helperDashboard(month);

  const {
    bills,
    invoiceList,
    recentTransactions,
    sumPaidExpense,
    sumPaidIncome,
  } = await fetchAllData(month);

  const chartData = sixmonth.map((month, index) => ({
    month: month.split("-")[0].slice(0, 3),
    incomes: allData[index].incomes,
    expenses: allData[index].expenses,
    balanco: allData[index].balanco,
  }));

  const categoryData = await getTotalsCategory(month);

  const lancamentos = await getTransactionsStats(month);
  const boletos = await getBillsStats(month);
  const cartoes = await getCardsStats(month);
  const contas = await getAccountsStats(month);
  const anotacoes = await getNotesStats(month);

  const statsData = [
    { title: "Lançamentos", qtde: lancamentos },
    { title: "Boletos", qtde: boletos },
    { title: "Cartões", qtde: cartoes },
    { title: "Contas", qtde: contas },
    { title: "Anotações", qtde: anotacoes },
  ];

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
        <Widget title="Receita, Despesa e Balanço" subtitle="Últimos 6 Meses">
          <ChartSummary data={chartData} />
        </Widget>

        <Widget title="Faturas" subtitle="faturas deste mês">
          <InvoiceWidget month={month} data={invoiceList} />
        </Widget>

        <Widget title="Boletos" subtitle="boletos deste mês">
          <BillsWidget month={month} data={bills} />
        </Widget>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <Widget title="Lançamentos Recentes" subtitle="Últimos 5 Lançamentos">
          <RecentesTransactions transactions={recentTransactions} />
        </Widget>

        <Widget
          title="Status de Pagamento"
          subtitle={"Pagamentos Pagos e Pendentes"}
        >
          <PaymentStatusWidget
            expenses={expenses}
            incomes={incomes}
            sumPaidExpense={sumPaidExpense}
            sumPaidIncome={sumPaidIncome}
          />
        </Widget>

        <Widget title="Resumo do Mês" subtitle="Principais Resumos">
          <StatsWidget month={month} statsConfig={statsData} />
        </Widget>
      </div>

      <div className="my-2 mb-10 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <Widget
          title="Condições de Pagamento"
          subtitle={"Principais Condições de Pagamento"}
        >
          <ConditionWidget month={month} />
        </Widget>

        <Widget
          title="Formas de Pagamentos"
          subtitle={"Principais Formas de Pagamento"}
        >
          <PaymentWidget month={month} />
        </Widget>

        <Widget
          title="receitas por Categoria"
          subtitle="Principais Categorias por Receita"
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
