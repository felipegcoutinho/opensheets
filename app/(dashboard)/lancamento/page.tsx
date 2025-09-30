import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import TransactionsTableSection from "./components/table";

export default async function page({ searchParams }: { searchParams?: { periodo?: string } }) {
  const month = await getMonth({ searchParams });

  return (
    <>
      <MonthPicker />
      <TransactionsTableSection month={month} />
    </>
  );
}
