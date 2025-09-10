import { WidgetCardFallback, KpiFallback } from "@/components/fallbacks/widget-fallback";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import AccountsSection from "./sections/accounts";
import BillsSection from "./sections/bills";
import CategoriesDespesaSection from "./sections/categories-despesa";
import CategoriesReceitaSection from "./sections/categories-receita";
import CategoryPurchasesSection from "./sections/category-purchases";
import ChartSection from "./sections/chart";
import ConditionsSection from "./sections/conditions";
import InvoicesSection from "./sections/invoices";
import KpisSection from "./sections/kpis";
import PaymentFormsSection from "./sections/payment-forms";
import RecentSection from "./sections/recent";
import StatusSection from "./sections/status";
import InstallmentsSection from "./sections/installments";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);

  const widgetFallback = <WidgetCardFallback />;
  const kpiFallback = <KpiFallback />;

  return (
    <section>
      <Suspense fallback={kpiFallback}>
        <KpisSection month={month} />
      </Suspense>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Suspense fallback={widgetFallback}>
          <AccountsSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <InvoicesSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <BillsSection month={month} />
        </Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Suspense fallback={widgetFallback}>
          <RecentSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <StatusSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <ChartSection month={month} />
        </Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={widgetFallback}>
          <ConditionsSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <PaymentFormsSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <InstallmentsSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <CategoryPurchasesSection month={month} />
        </Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={widgetFallback}>
          <CategoriesReceitaSection month={month} />
        </Suspense>
        <Suspense fallback={widgetFallback}>
          <CategoriesDespesaSection month={month} />
        </Suspense>
      </div>
    </section>
  );
}
