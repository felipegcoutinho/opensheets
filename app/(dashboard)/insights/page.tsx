import { getCards } from "@/app/actions/cards/fetch_cards";
import { getNewCategorias } from "@/app/actions/categories/fetch_categorias";
import { getTransactionsByResponsableVoce } from "@/app/actions/transactions/fetch_transactions";
import { getMonth } from "@/hooks/get-month";
import Dashboard from "./dashboard";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const [lancamentos, cartoes, categorias] = await Promise.all([
    getTransactionsByResponsableVoce(month),
    getCards(),
    getNewCategorias(),
  ]);

  return (
    <div>
      <Dashboard
        month={month}
        lancamentos={lancamentos}
        cartoes={cartoes}
        categorias={categorias}
      />
    </div>
  );
}
