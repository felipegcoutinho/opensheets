import { getCards } from "@/app/actions/cards/fetch_cards";
import { getCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactionsRoleOwner } from "@/app/actions/transactions/fetch_transactions";
import MonthPicker from "@/components/month-picker/month-picker";
import { getMonth } from "@/hooks/get-month";
import Dashboard from "./dashboard";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const [lancamentos, cartoes, categorias] = await Promise.all([
    getTransactionsRoleOwner(month),
    getCards(),
    getCategorias(),
  ]);

  return (
    <>
      <MonthPicker />
      <Dashboard
        month={month}
        lancamentos={lancamentos}
        cartoes={cartoes}
        categorias={categorias}
      />
    </>
  );
}
