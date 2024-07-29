import Header from "@/components/main-header";
import { UseDates } from "@/hooks/UseDates";
import PageCards from "./page-cards";
";

export default function Page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <Header month={month} />

      <PageCards month={month} />
    </>
  );
}
