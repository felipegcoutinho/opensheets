import CardSummary from "@/components/card-summary";
import CardInvoices from "../../components/card-invoices";
import { BillsCard } from "./bills-card";
import Category from "./categories-card";
import { ConditionList } from "./condition-card";
import InvoiceCard from "./invoices-card";
import { PaymentList } from "./payment-card";
import RecentesTransactions from "./recents-transactions";
import Stats from "./stats";
import Utils from "./utils";

export default async function FinancialSummaryCards({ month }) {
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
  } = await Utils(month);

  return (
    <>
      <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {cardData.map((item, index) => (
          <CardSummary
            color={item.color}
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

        <CardInvoices title="Transações Recentes">
          <RecentesTransactions transactions={recentsTransactions} />
        </CardInvoices>
      </div>

      <div className="my-2">
        <Stats month={month} />
      </div>

      <div className="mb-10 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
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
          <Category
            color={"bg-red-500"}
            data={expenseByCategory}
            month={month}
          />
        </CardInvoices>
      </div>
    </>
  );
}
