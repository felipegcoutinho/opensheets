import { UseDates } from "@/hooks/use-dates";
import { getAccount } from "@actions/accounts";
import { getBills } from "@actions/bills";
import CreateBills from "./modal/create-bills";
import TableBills from "./table-bills";

async function PageBills(props) {
  const searchParams = await props.searchParams;
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getBillsMap = await getBills(month);
  const getAccountMap = await getAccount();

  return (
    <div className="mt-4 w-full">
      <CreateBills getAccountMap={getAccountMap} />
      <TableBills getBillsMap={getBillsMap} getAccountMap={getAccountMap} />
    </div>
  );
}

export default PageBills;
