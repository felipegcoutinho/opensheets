import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import Loading from "./loading";
import AccountsSection from "./components/accounts";
import BillsSection from "./components/bills";
import CategoriesDespesaSection from "./components/categories-despesa";
import CategoriesReceitaSection from "./components/categories-receita";
import CategoryPurchasesSection from "./components/category-purchases";
import ChartSection from "./components/chart";
import InstallmentsSection from "./components/installments";
import InvoicesSection from "./components/invoices";
import KpisSection from "./components/kpis";
import PaymentsOverviewSection from "./components/payments-overview";
import RecentSection from "./components/recent";
import RecurrentsSection from "./components/recurrents";
import RuleOverviewSection from "./components/rule-overview";
import StatusSection from "./components/status";
import TopEstablishmentsSection from "./components/top-establishments";
import TopExpensesSection from "./components/top-expenses";

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
