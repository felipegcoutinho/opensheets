import { UseDates } from "@/hooks/use-dates";

export function getMonth(props?: { searchParams?: { periodo?: string } }) {
  const searchParams = props?.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  return searchParams?.periodo ?? defaultPeriodo;
}
