import { UseDates } from "@/hooks/use-dates";
import { getAccount } from "../actions/accounts";
import { getCards } from "../actions/cards";
import { getTransaction } from "../actions/transactions";
import { TableTransaction } from "./table-transaction";

async function PageTransactions({ searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();
  const getTransactionMap = await getTransaction(month);

  return (
    <TableTransaction
      data={getTransactionMap}
      getAccountMap={getAccountMap}
      getCardsMap={getCardsMap}
    />
  );
}

export default PageTransactions;
