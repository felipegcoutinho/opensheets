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
import InvoicesSection from "./sections/invoices";
import KpisSection from "./sections/kpis";
import PaymentFormsSection from "./sections/payment-forms";
import RecentSection from "./sections/recent";
import StatusSection from "./sections/status";
import TopExpensesSection from "./sections/top-expenses";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);

  return (
    <Suspense fallback={<Loading />}>
      <section>
        <KpisSection month={month} />

        <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
          <AccountsSection month={month} />
          <InvoicesSection month={month} />
          <BillsSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
          <RecentSection month={month} />
          <StatusSection month={month} />
          <ChartSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <TopExpensesSection month={month} />
          <ConditionsSection month={month} />
          <PaymentFormsSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
          <InstallmentsSection month={month} />
          <CategoryPurchasesSection month={month} />
        </div>

        <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
          <CategoriesReceitaSection month={month} />
          <CategoriesDespesaSection month={month} />
        </div>
      </section>
    </Suspense>
  );
}
