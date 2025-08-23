import CalendarSection from "./sections/calendar";
import { Suspense } from "react";
import CalendarSkeleton from "@/components/skeletons/calendar-skeleton";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);
  return (
    <div className="mb-4 w-full">
      <MonthPicker />
      <Suspense fallback={<CalendarSkeleton /> }>
        <CalendarSection month={month} />
      </Suspense>
    </div>
  );
}
