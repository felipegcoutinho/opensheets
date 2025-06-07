import { UseDates } from "@/hooks/use-dates";

export async function getMonth(props?: {
  searchParams?: { periodo?: string };
}) {
  const searchParams = await props?.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  return searchParams?.periodo ?? defaultPeriodo;
}
