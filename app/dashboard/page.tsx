import { UseDates } from "@/hooks/use-dates";
import FinancialSummary from "./financial-summary";
import FinancialSummaryCards from "./financial-summary-cards";

export default async function page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <main>
      <div className="py-6 px-1">
        <h1 className="text-xl font-bold">Visão Geral</h1>
        <h2 className="text-muted-foreground">Aqui está seus principais números do mês.</h2>
      </div>

      <FinancialSummary month={month} />
      <FinancialSummaryCards month={month} />
    </main>
  );
}
