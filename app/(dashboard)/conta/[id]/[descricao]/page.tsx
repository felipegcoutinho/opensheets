import { getAccount, getAccountDetails } from "@/app/services/contas";
import {
  getAccountInvoice,
  getSumAccountExpense,
  getSumAccountIncome,
} from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import AccountInfo from "./account-info";
import { TableTransaction } from "@/app/(dashboard)/lancamentos/table/table-transaction";
import { getCards } from "@/app/services/cartoes";
import { getNewCategorias } from "@/app/services/categorias";

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
      {accountDetails?.map((item) => (
        <AccountInfo
          key={item.id}
          item={item}
          sumAccountIncome={sumIncome}
          accountExpense={sumExpense}
          saldo={saldo}
        />
      ))}

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
