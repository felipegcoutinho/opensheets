import { UseDates } from "@/hooks/UseDates";
import PageDashboards from "./page-dashboards";

export default async function Dashboard({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <PageDashboards month={month} />
    </>
  );
}
