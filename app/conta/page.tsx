import { UseDates } from "@/hooks/UseDates";
import PageAccount from "./page-accounts";

export default function Page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <PageAccount month={month} />
    </>
  );
}
