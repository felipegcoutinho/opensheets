import AccountInfo from "../account-info";
import {
  getSumAccountExpense,
  getSumAccountIncome,
  getSumAccountExpenseToDate,
  getSumAccountIncomeToDate,
} from "@/app/actions/transactions/fetch_transactions";
import { getAccountDetails } from "@/app/actions/accounts/fetch_accounts";

export default async function AccountHeaderSection({ id, month }: { id: string; month: string }) {
  const [accountDetails, sumIncome, sumExpense, sumIncomeToDate, sumExpenseToDate] =
    await Promise.all([
      getAccountDetails(Number(id)),
      getSumAccountIncome(month, id),
      getSumAccountExpense(month, id),
      getSumAccountIncomeToDate(month, id),
      getSumAccountExpenseToDate(month, id),
    ]);

  if (!accountDetails) return null;

  const saldo = sumIncomeToDate - sumExpenseToDate;

  return (
    <AccountInfo
      key={accountDetails.id}
      item={accountDetails}
      sumAccountIncome={sumIncome}
      accountExpense={sumExpense}
      saldo={saldo}
    />
  );
}
