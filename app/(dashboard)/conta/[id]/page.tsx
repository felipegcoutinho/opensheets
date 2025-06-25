import { TableTransaction } from "@/app/(dashboard)/lancamentos/table/table-transaction";
import {
  getAccount,
  getAccountDetails,
} from "@/app/actions/accounts/fetch_accounts";
import { getCards } from "@/app/actions/cards/fetch_cards";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import {
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/actions/transactions/fetch_transactions";
import { getMonth } from "@/hooks/get-month";
import AccountInfo from "./account-info";

export default async function page({ searchParams, params }) {
  const { id } = await params;
  const month = await getMonth({ searchParams });

  const cards = await getCards(month);
  const categorias = await getNewCategorias();
  const contas = await getAccount();

  const [accountDetails, accountInvoice, sumIncome, sumExpense] =
    await Promise.all([
      getAccountDetails(id),
      getAccountInvoice(month, id),
      getSumAccountIncome(month, id),
      getSumAccountExpense(month, id),
    ]);

  const saldo = sumIncome - sumExpense;

  return (
    <div>
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
