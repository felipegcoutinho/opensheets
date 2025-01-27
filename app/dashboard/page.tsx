import { UseDates } from "@/hooks/use-dates";
import Dashboards from "./dashboards";

export default async function page(props) {
  const searchParams = await props.searchParams;

  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;
  const firstNameMonth = (searchParams?.periodo ?? defaultPeriodo).split(
    "-",
  )[0];

  return <Dashboards month={month} />;
}
