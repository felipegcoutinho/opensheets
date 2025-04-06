import CardInvoices from "@/components/card-invoices";
import CardSummary from "@/components/card-summary";
import { getPeriodo } from "@/hooks/periodo";
import { UseDates } from "@/hooks/use-dates";
import BillsCard from "./bills-card";
import Category from "./categories-card";
import { ChartSummary } from "./chart-summary";
import { ConditionList } from "./condition-card";
import InvoiceCard from "./invoices-card";
import { PaymentList } from "./payment-card";
import RecentesTransactions from "./recents-transactions";
import Stats from "./stats";
import useUtils from "./utils";

export default async function page(props) {
  const month = await getPeriodo(props);

  const { getLastSixMonths } = await UseDates();

  const sixmonth = await getLastSixMonths(month);

  const allData = await Promise.all(sixmonth.map((month) => useUtils(month)));

  const chartData = sixmonth.map((month, index) => ({
    month: month.split("-")[0].slice(0, 3), // Ex: "Abr"
    receita: allData[index].receitas,
    despesa: allData[index].despesasTotal,
    balanco: allData[index].balanco,
  }));

  const {
    receitas,
    receitasAnterior,
    despesasTotal,
    despesasTotalAnterior,
    balanco,
    balancoAnterior,
    previsto,
    previstoAnterior,
    incomeByCategory,
    invoiceList,
    billsByResponsavel,
    expenseByCategory,
    recentTransactions,
    summary,
  } = await useUtils(month);

  return (
    <>
      <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {summary.map((item, index) => (
          <CardSummary
            previousValue={item.previousValue}
            title={item.title}
            value={item.value}
            key={index}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-3">
        <div>
          <ChartSummary data={chartData} />
        </div>

        <CardInvoices title="Faturas">
          <InvoiceCard month={month} data={invoiceList} />
        </CardInvoices>

        <CardInvoices title="Boletos">
          <BillsCard month={month} data={billsByResponsavel} />
        </CardInvoices>
      </div>

      <div className="mt-2 grid gap-2 md:grid-cols-1 lg:grid-cols-2">
        <CardInvoices title="Lançamentos Recentes">
          <RecentesTransactions transactions={recentTransactions} />
        </CardInvoices>

        <CardInvoices title="Resumo do Mês">
          <Stats month={month} />
        </CardInvoices>
      </div>

      <div className="my-2 mb-10 grid gap-2 md:grid-cols-2 lg:grid-cols-2">
        <ConditionList month={month} />
        <PaymentList month={month} />

        <CardInvoices title="Receitas por Categorias">
          <Category
            color="bg-green-500"
            data={incomeByCategory}
            month={month}
          />
        </CardInvoices>

        <CardInvoices title="Despesas por Categorias">
          <Category color="bg-red-500" data={expenseByCategory} month={month} />
        </CardInvoices>
      </div>
    </>
  );
}
