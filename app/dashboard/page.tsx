import { UseDates } from "@/hooks/use-dates";
import FinancialSummary from "./financial-summary";
import FinancialSummaryCards from "./financial-summary-cards";

export default async function page(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;
  const onlyMonth = (searchParams?.periodo ?? defaultPeriodo).split("-")[0];

  return (
    <>
      <div className="px-1 py-8">
        <h1 className="text-2xl font-bold">Visão Geral</h1>
        <h2 className="text-muted-foreground">
          Aqui estão seus principais números de {onlyMonth}.
        </h2>
      </div>

      <FinancialSummary month={month} />
      <FinancialSummaryCards month={month} />
    </>
  );
}
