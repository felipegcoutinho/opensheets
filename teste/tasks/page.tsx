import { getTransaction } from "@/app/actions/transactions";
import { UseDates } from "@/hooks/UseDates";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";

export default async function TaskPage({ searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getTransactionMap = await getTransaction(month);

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8  md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
          <p className="text-muted-foreground">Here&apos;s a list of your tasks for this month!</p>
        </div>
      </div>
      {month}
      <DataTable data={getTransactionMap} columns={columns} />
    </div>
  );
}
