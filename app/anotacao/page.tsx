import { UseDates } from "@/hooks/UseDates";
import PageNotes from "./page-notes";

export default function page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <PageNotes month={month} />
    </>
  );
}
