import Header from "@/components/main-header";
import { UseDates } from "@/hooks/UseDates";
import PageAccount from "./page-accounts";

export default function Page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <Header month={month} />

      <PageAccount month={month} />
    </>
  );
}
