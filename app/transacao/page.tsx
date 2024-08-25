import { UseDates } from "@/hooks/UseDates";
import { getAccount } from "../actions/accounts";
import { getCards } from "../actions/cards";
import { getTransaction } from "../actions/transactions";
import CreateTransactions from "./modal/create-transactions";
import { TableTransaction } from "./table-transaction";

async function PageTransactions({ searchParams }) {
  const { currentMonthName, currentYear, DateFormat } = UseDates();
  const defaultPeriodo = `${currentMonthName}-${currentYear}`;
  const month = searchParams?.periodo ?? defaultPeriodo;

  const getCardsMap = await getCards(month);
  const getAccountMap = await getAccount();
  const getTransactionMap = await getTransaction(month);

  function getDescricao(item) {
    const contaDescricao = item.contas?.descricao;
    const cartaoDescricao = item.cartoes?.descricao;
    return contaDescricao ?? cartaoDescricao;
  }

  function getRowClassNames(item) {
    let classNames = "";
    if (item.categoria === "Saldo Anterior") {
      classNames += " bg-gradient-to-r from-green-50 to-white text-green-700 dark:from-[#0c1c0b] dark:to-black";
    }
    if (item.responsavel === "Sistema") {
      classNames += "bg-gradient-to-r from-neutral-50 to-white text-neutral-500 dark:from-neutral-900 dark:to-black";
    }
    return classNames.trim();
  }

  return (
    <div className="mt-4 w-full">
      <CreateTransactions getCardsMap={getCardsMap} getAccountMap={getAccountMap} />

      <TableTransaction data={getTransactionMap} getAccountMap={getAccountMap} getCardsMap={getCardsMap} />
    </div>
  );
}

export default PageTransactions;
