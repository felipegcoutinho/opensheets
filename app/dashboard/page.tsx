import { UseDates } from "@/hooks/use-dates";
import FinancialSummary from "./financial-summary";
import FinancialSummaryCards from "./financial-summary-cards";

export default async function page({ searchParams }) {
  const { currentMonthName, currentYear } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  return (
    <main>
      <div className="px-1 py-6">
        <h1 className="text-lg font-bold">Visão Geral</h1>
        <h2 className="text-muted-foreground">
          Aqui está seus principais números do mês.
        </h2>
      </div>

      <FinancialSummary month={month} />
      <FinancialSummaryCards month={month} />
    </main>
  );
}
