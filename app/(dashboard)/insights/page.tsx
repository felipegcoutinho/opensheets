import { getCards } from "@/app/services/cartoes";
import { getTransactionsByResponsableVoce } from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import Dashboard from "./dashboard";
import { getNewCategorias } from "@/app/services/categorias";

export default async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const lancamentos = await getTransactionsByResponsableVoce(month);
  const cartoes = await getCards();
  const categorias = await getNewCategorias();

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
