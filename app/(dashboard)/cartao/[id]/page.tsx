import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import HeaderCardSkeleton from "@/components/skeletons/header-card-skeleton";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import CardHeaderSection from "./sections/header";
import CardTableSection from "./sections/table";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  return (
    <section>
      <MonthPicker />
      <Suspense fallback={<HeaderCardSkeleton /> }>
        <CardHeaderSection id={id} month={month} />
      </Suspense>

      <Suspense fallback={<TableSkeleton rows={10} /> }>
        <CardTableSection id={id} month={month} />
      </Suspense>
    </section>
  );
}
