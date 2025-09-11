import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import AccountHeaderSection from "./sections/header";
import AccountTableSection from "./sections/table";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  return (
    <div>
      <MonthPicker />
      <AccountHeaderSection id={id} month={month} />

      <AccountTableSection id={id} month={month} />
    </div>
  );
}
