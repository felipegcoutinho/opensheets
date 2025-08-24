import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import { Suspense } from "react";
import HeaderCardSkeleton from "@/components/skeletons/header-card-skeleton";
import TableSkeleton from "@/components/skeletons/table-skeleton";
import AccountHeaderSection from "./sections/header";
import AccountTableSection from "./sections/table";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  return (
    <div>
      <MonthPicker />
      <Suspense fallback={<HeaderCardSkeleton /> }>
        <AccountHeaderSection id={id} month={month} />
      </Suspense>

      <Suspense fallback={<TableSkeleton rows={10} /> }>
        <AccountTableSection id={id} month={month} />
      </Suspense>
    </div>
  );
}
