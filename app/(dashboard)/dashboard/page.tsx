import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import Loading from "./loading";
import AccountsSection from "./sections/accounts";
import BillsSection from "./sections/bills";
import CategoriesDespesaSection from "./sections/categories-despesa";
import CategoriesReceitaSection from "./sections/categories-receita";
import CategoryPurchasesSection from "./sections/category-purchases";
import ChartSection from "./sections/chart";
import InstallmentsSection from "./sections/installments";
import InvoicesSection from "./sections/invoices";
import KpisSection from "./sections/kpis";
import PaymentsOverviewSection from "./sections/payments-overview";
import RecentSection from "./sections/recent";
import RecurrentsSection from "./sections/recurrents";
import RuleOverviewSection from "./sections/rule-overview";
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

        <div className="my-2 grid grid-cols-1 gap-2 lg:grid-cols-3">
          <AccountsSection month={month} />
          <InvoicesSection month={month} />
          <BillsSection month={month} />

          <StatusSection month={month} />
          <ChartSection month={month} />
          <RuleOverviewSection month={month} />

          <RecentSection month={month} />
          <PaymentsOverviewSection month={month} />
          <RecurrentsSection month={month} />

          <InstallmentsSection month={month} />
          <TopExpensesSection month={month} />
          <TopEstablishmentsSection month={month} />

          <CategoryPurchasesSection month={month} />
          <CategoriesReceitaSection month={month} />
          <CategoriesDespesaSection month={month} />
        </div>
      </section>
    </Suspense>
  );
}
