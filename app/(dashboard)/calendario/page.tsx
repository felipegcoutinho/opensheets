import CalendarSection from "./sections/calendar";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";

export default async function Page(props: {
  searchParams?: { periodo?: string };
}) {
  const month = await getMonth(props);
  return (
    <div className="mb-4 w-full">
      <MonthPicker />
      <CalendarSection month={month} />
    </div>
  );
}
