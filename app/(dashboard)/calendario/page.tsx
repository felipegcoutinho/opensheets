import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import CalendarSection from "./components/calendar";

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
