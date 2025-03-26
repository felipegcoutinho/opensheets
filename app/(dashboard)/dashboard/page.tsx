import CardSummary from "@/components/card-summary";
import { UseDates } from "@/hooks/use-dates";
import CardInvoices from "../../../components/card-invoices";
import { BillsCard } from "./bills-card";
import Category from "./categories-card";
import { ConditionList } from "./condition-card";
import InvoiceCard from "./invoices-card";
import { PaymentList } from "./payment-card";
import RecentesTransactions from "./recents-transactions";
import Stats from "./stats";
import useUtils from "./utils";

export default async function page(props) {
  const searchParams = props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

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
    invoiceCard,
    invoiceBill,
    expenseByCategory,
    recentsTransactions,
    cardData,
  } = await useUtils(month);

  return (
    <>
      <div className="mt-4 grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((item, index) => (
          <CardSummary
            previousValue={item.previousValue}
            title={item.title}
            value={item.value}
            key={index}
          />
        ))}
      </div>

      <div className="mt-2 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <CardInvoices title="Faturas">
          <InvoiceCard month={month} data={invoiceCard} />
        </CardInvoices>

        <CardInvoices title="Boletos">
          <BillsCard month={month} data={invoiceBill} />
        </CardInvoices>

        <CardInvoices title="Lançamentos Recentes">
          <RecentesTransactions transactions={recentsTransactions} />
        </CardInvoices>
      </div>

      <div className="my-2">
        <Stats month={month} />
      </div>

      <div className="my-2 mb-10 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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
