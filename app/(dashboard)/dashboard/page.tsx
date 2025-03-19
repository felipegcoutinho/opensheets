import { UseDates } from "@/hooks/use-dates";
import FinancialSummaryCards from "./dashboards";

export default async function page(props) {
  const searchParams = await props.searchParams;

  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  return <FinancialSummaryCards month={month} />;
}
