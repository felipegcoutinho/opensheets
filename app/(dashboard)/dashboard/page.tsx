import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import KpisSection from "./sections/kpis";
import AccountsSection from "./sections/accounts";
import InvoicesSection from "./sections/invoices";
import BillsSection from "./sections/bills";
import RecentSection from "./sections/recent";
import StatusSection from "./sections/status";
import ChartSection from "./sections/chart";
import ConditionsSection from "./sections/conditions";
import PaymentFormsSection from "./sections/payment-forms";
import CategoryPurchasesSection from "./sections/category-purchases";
import CategoriesReceitaSection from "./sections/categories-receita";
import CategoriesDespesaSection from "./sections/categories-despesa";

export default async function Page(props: { searchParams?: { periodo?: string } }) {
  const month = await getMonth(props as any);

  const widgetFallback = <Skeleton className="h-64 w-full" />;
  const kpiFallback = <Skeleton className="h-24 w-full" />;

  return (
    <section>
      <Suspense fallback={kpiFallback}>
        <KpisSection month={month} />
      </Suspense>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Suspense fallback={widgetFallback}><AccountsSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><InvoicesSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><BillsSection month={month} /></Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-1 lg:grid-cols-3">
        <Suspense fallback={widgetFallback}><RecentSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><StatusSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><ChartSection month={month} /></Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={widgetFallback}><ConditionsSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><PaymentFormsSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><CategoryPurchasesSection month={month} /></Suspense>
      </div>

      <div className="my-3 grid gap-3 md:grid-cols-2 lg:grid-cols-2">
        <Suspense fallback={widgetFallback}><CategoriesReceitaSection month={month} /></Suspense>
        <Suspense fallback={widgetFallback}><CategoriesDespesaSection month={month} /></Suspense>
      </div>
    </section>
  );
}

