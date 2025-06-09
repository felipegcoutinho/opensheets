import { UseDates } from "@/hooks/use-dates";

export async function getMonth(props?: {
  searchParams?: { periodo?: string };
}) {
  const searchParams = await props?.searchParams;
  const { formatted_current_month } = UseDates();
  const defaultPeriodo = formatted_current_month;
  return searchParams?.periodo ?? defaultPeriodo;
}
