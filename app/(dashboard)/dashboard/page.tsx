import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import Loading from "./loading";
import AccountsSection from "./sections/accounts";
import BillsSection from "./sections/bills";
import CategoriesDespesaSection from "./sections/categories-despesa";
import CategoriesReceitaSection from "./sections/categories-receita";
import CategoryPurchasesSection from "./sections/category-purchases";
import ChartSection from "./sections/chart";
import ConditionsSection from "./sections/conditions";
import InstallmentsSection from "./sections/installments";
import RecurrentsSection from "./sections/recurrents";
import InvoicesSection from "./sections/invoices";
import KpisSection from "./sections/kpis";
import PaymentFormsSection from "./sections/payment-forms";
import RecentSection from "./sections/recent";
import StatusSection from "./sections/status";
import TopEstablishmentsSection from "./sections/top-establishments";
import TopExpensesSection from "./sections/top-expenses";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);

  return (
    <Suspense fallback={<Loading />}>
      <section>
        <KpisSection month={month} />

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <AccountsSection month={month} />
          <ChartSection month={month} />
          <RecentSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <StatusSection month={month} />
          <PaymentFormsSection month={month} />
          <ConditionsSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <BillsSection month={month} />
          <InstallmentsSection month={month} />
          <RecurrentsSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <InvoicesSection month={month} />
          <TopExpensesSection month={month} />
          <TopEstablishmentsSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
          <CategoryPurchasesSection month={month} />
          <CategoriesReceitaSection month={month} />
          <CategoriesDespesaSection month={month} />
        </div>
      </section>
    </Suspense>
  );
}
