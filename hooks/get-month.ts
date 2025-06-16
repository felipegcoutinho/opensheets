import { UseDates } from "@/hooks/use-dates";

export interface GetMonthProps {
  searchParams?: { periodo?: string };
}

export async function getMonth(props?: GetMonthProps): Promise<string> {
  const searchParams = await props?.searchParams;
  const { formatted_current_month } = UseDates();
  const defaultPeriodo = formatted_current_month;
  return searchParams?.periodo ?? defaultPeriodo;
}
