import SummaryWidget from "@/app/(dashboard)/dashboard/summary-widget";
import { fetchAllData } from "@/app/actions/fetch-all-data";
import Widget from "@/components/widget";
import { getMonth } from "@/hooks/get-month";
import {
  RiArrowUpDownLine,
  RiBankCardLine,
  RiBarChartBoxLine,
  RiBarcodeLine,
  RiFileList2Line,
  RiWalletLine,
} from "@remixicon/react";
import AccountWidget from "./accounts-widget";
import BillsWidget from "./bills-widget";
import CategoryWidget from "./categories-widget";
import CategoryPurchasesWidget from "./category-purchases-widget";
import { ChartSummary } from "./chart-summary";
import { ConditionWidget } from "./condition-widget";
import InvoiceWidget from "./invoices-widget";
import PaymentStatusWidget from "./payment-status-widget";
import { PaymentWidget } from "./payment-widget";
import RecentesTransactions from "./recents-transactions-widget";
import UtilitiesDashboard from "./utilities-dashboard";

// ChartSummary é um Client Component; importação direta cria o boundary sem SSR manual

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const {
    bills,
    invoiceList,
    recentTransactions,
    sumPaidExpense,
    sumPaidIncome,
    sixmonth,
    account,
    budgets,
    transactionsByCategory,
    conditions,
    payment,
  } = await fetchAllData(month);

  // Evita chamada duplicada de UtilitiesDashboard para o mês atual;
  // usa a lista de 6 meses (que inclui o mês atual como o último elemento)
  const allData = await Promise.all(sixmonth.map((m) => UtilitiesDashboard(m)));

  const current = allData[allData.length - 1];

  const { incomes, expenses, summary, categoryData, saldo, previstoAnterior } =
    current;

  const chartData = sixmonth.map((month, index) => ({
    month: month.split("-")[0].slice(0, 3),
    incomes: allData[index].incomes,
    expenses: allData[index].expenses,
    balanco: allData[index].balanco,
  }));

  return (
    <section>
      <div className="my-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item) => (
          <SummaryWidget
            previousValue={item.previousValue}
            title={item.title}
            value={item.value}
            key={item.title}
            color={item.color}
            information={item.information}
          />
        ))}
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Widget
          title="Minhas Contas"
          subtitle="Contas e Saldos"
          information="Resumo de contas e saldos, inclui apenas contas de Você"
          saldo_information="Saldo geral é a soma de todas as contas"
          saldo={saldo}
          icon={
            <RiBarChartBoxLine className="text-primary mr-2 inline size-4" />
          }
        >
          <AccountWidget
            month={month}
            data={account}
            previstoAnterior={previstoAnterior}
          />
        </Widget>

        <Widget
          title="Faturas"
          subtitle="faturas deste mês"
          information="O valor mostrado é referente a transações de todos os responsáveis"
          icon={<RiBankCardLine className="text-primary mr-2 inline size-4" />}
        >
          <InvoiceWidget month={month} data={invoiceList} />
        </Widget>

        <Widget
          title="Boletos"
          subtitle="boletos deste mês"
          information="Resumo de boletos, inclui apenas transações de Você"
          icon={<RiBarcodeLine className="text-primary mr-2 inline size-4" />}
        >
          <BillsWidget month={month} data={bills} />
        </Widget>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Widget
          title="Lançamentos Recentes"
          subtitle="Últimos 5 Lançamentos"
          information="Resumo dos últimos lançamentos, inclui apenas transações de Você"
          icon={
            <RiArrowUpDownLine className="text-primary mr-2 inline size-4" />
          }
        >
          <RecentesTransactions transactions={recentTransactions} />
        </Widget>

        <Widget
          title="Status de Pagamento"
          subtitle={"Resumo de valores, confirmados e pendentes"}
          information="Resumo de valores pagos e pendentes, inclui apenas transações de Você"
          icon={<RiWalletLine className="text-primary mr-2 inline size-4" />}
        >
          <PaymentStatusWidget
            expenses={expenses}
            incomes={incomes}
            sumPaidExpense={sumPaidExpense}
            sumPaidIncome={sumPaidIncome}
          />
        </Widget>

        <Widget
          title="Receita, Despesa e Balanço"
          subtitle="Últimos 6 Meses"
          information="Últimos 6 Meses, inclui apenas transações de Você"
          icon={
            <RiBarChartBoxLine className="text-primary mr-2 inline size-4" />
          }
        >
          <ChartSummary data={chartData} />
        </Widget>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Widget
          title="Condições de Pagamento"
          subtitle={"Principais Condições de Pagamento"}
          information="Resumo das condições de pagamento, inclui apenas transações de Você"
          icon={<RiWalletLine className="text-primary mr-2 inline size-4" />}
        >
          <ConditionWidget month={month} data={conditions} />
        </Widget>

        <Widget
          title="Formas de Pagamentos"
          subtitle={"Principais Formas de Pagamento"}
          information="Resumo das formas de pagamento, inclui apenas transações de Você"
          icon={<RiWalletLine className="text-primary mr-2 inline size-4" />}
        >
          <PaymentWidget month={month} data={payment} />
        </Widget>

        <Widget
          title="Compras por Categoria"
          subtitle="Selecione uma categoria"
          information="Lista de compras por categoria, inclui apenas transações de Você"
          icon={<RiFileList2Line className="text-primary mr-2 inline size-4" />}
        >
          <CategoryPurchasesWidget data={transactionsByCategory} />
        </Widget>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        <Widget
          title="Receitas por Categoria"
          subtitle="Principais Categorias por Receita"
          information="Resumo das categorias de receitas, inclui apenas transações de Você"
          icon={<RiFileList2Line className="text-primary mr-2 inline size-4" />}
        >
          <CategoryWidget
            data={categoryData}
            tipo="receita"
            total={incomes}
            month={month}
            budgets={budgets}
          />
        </Widget>

        <Widget
          title="Despesas por Categoria"
          subtitle="Principais Categorias por Despesa"
          information="Resumo das categorias de despesas, inclui apenas transações de Você"
          icon={<RiFileList2Line className="text-primary mr-2 inline size-4" />}
        >
          <CategoryWidget
            data={categoryData}
            tipo="despesa"
            total={expenses}
            month={month}
            budgets={budgets}
          />
        </Widget>
      </div>
    </section>
  );
}
