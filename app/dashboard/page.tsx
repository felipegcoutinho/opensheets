import Banner from "@/components/main-banner";
import Header from "@/components/main-header";
import MonthPicker from "@/components/month-picker";
import { UseDates } from "@/hooks/UseDates";
import PageDashboards from "./page-dashboards";

export default async function Dashboard({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();

  const defaultPeriodo = `${currentMonthName}-${currentYear}`;

  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <>
      <Header month={month} />

      <Banner />

      <MonthPicker />

      <PageDashboards month={month} />
    </>
  );
}
