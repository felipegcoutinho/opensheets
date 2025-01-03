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

  return (
    <>
      <div className="px-1 py-6">
        <h1 className="text-lg font-semibold">Visão Geral</h1>
        <h2 className="text-muted-foreground">
          Suas principais movimentações financeiras de {firstNameMonth}.
        </h2>
      </div>

      <Dashboards month={month} />
    </>
  );
}
