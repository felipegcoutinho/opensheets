import { getAccountDetails } from "@/app/services/contas";
import {
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import { UseDates } from "@/hooks/use-dates";
import TransactionTable from "./table";
import AccountInfo from "./account-info";

export default async function page({ searchParams, params }) {
  const { DateFormat } = UseDates();

  const { id } = await params;

  const month = await getMonth({ searchParams });

  const [accountDetails, transactionInvoice, sumIncome, sumExpense] =
    await Promise.all([
      getAccountDetails(id),
      getAccountInvoice(month, id),
      getSumAccountIncome(month, id),
      getSumAccountExpense(month, id),
    ]);

  const saldo = sumIncome - sumExpense;

  return (
    <div>
      {accountDetails?.map((item) => (
        <AccountInfo
          key={item.id}
          item={item}
          sumAccountIncome={sumIncome}
          accountExpense={sumExpense}
          saldo={saldo}
        />
      ))}
      <TransactionTable transactions={transactionInvoice} />
    </div>
  );
}
