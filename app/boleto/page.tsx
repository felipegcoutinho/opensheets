import Header from "@/components/main-header";
import MonthPicker from "@/components/month-picker";
import { UseDates } from "@/hooks/UseDates";
import PageBills from "./page-bills";

export default function boleto({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <Header month={month} />

      <MonthPicker />

      <PageBills month={month} />
    </>
  );
}
