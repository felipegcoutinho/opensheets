import CardInvoices from "../../components/card-invoices";
import { BillsList } from "./bills-list";
import Category from "./categories-list";
import { ConditionList } from "./condition-list";
import CountList from "./count-list";
import Invoice from "./invoice-list";
import { PaymentList } from "./payment-list";
import Utils from "./utils";

export default async function FinancialSummaryCards({ month }) {
  const { incomeByCategory, invoiceCard, invoiceBill, expenseByCategory } =
    await Utils(month);

  return (
    <div className="mb-10 mt-2 grid gap-2 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <CardInvoices title="Faturas" subtitle="Total de faturas">
        <Invoice month={month} data={invoiceCard} />
      </CardInvoices>

      <CardInvoices title="Boletos" subtitle="Total de boletos">
        <BillsList month={month} data={invoiceBill} />
      </CardInvoices>

      <div className="flex flex-col gap-2">
        <ConditionList month={month} />
        <PaymentList month={month} />
      </div>

      <CardInvoices title="Receitas por Categorias">
        <Category data={incomeByCategory} />
      </CardInvoices>

      <CardInvoices title="Despesas por Categorias">
        <Category data={expenseByCategory} />
      </CardInvoices>

      <CountList month={month} />
    </div>
  );
}
