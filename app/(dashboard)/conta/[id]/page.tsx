import { TableTransaction } from "@/app/(dashboard)/lancamento/table/table-transaction";
import {
  getAccount,
  getAccountDetails,
} from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import {
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
  getSumAccountExpenseToDate,
  getSumAccountIncomeToDate,
} from "@/app/actions/transactions/fetch_transactions";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import AccountInfo from "./account-info";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const cards = await getCards(month);
  const categorias = await getCategorias();
  const contas = await getAccount();

  const [
    accountDetails,
    accountInvoice,
    sumIncome,
    sumExpense,
    sumIncomeToDate,
    sumExpenseToDate,
  ] =
    await Promise.all([
      getAccountDetails(id),
      getAccountInvoice(month, id),
      getSumAccountIncome(month, id),
      getSumAccountExpense(month, id),
      getSumAccountIncomeToDate(month, id),
      getSumAccountExpenseToDate(month, id),
    ]);

  const saldo = sumIncomeToDate - sumExpenseToDate;

  return (
    <div>
      <MonthPicker />
      {accountDetails && (
        <AccountInfo
          key={accountDetails.id}
          item={accountDetails}
          sumAccountIncome={sumIncome}
          accountExpense={sumExpense}
          saldo={saldo}
        />
      )}

      <TableTransaction
        data={accountInvoice}
        getAccount={contas}
        getCards={cards}
        getCategorias={categorias}
        hidden={true}
      />
    </div>
  );
}
