import { getCards } from "@/app/services/cartoes";
import { getTransactionsByResponsableVoce } from "@/app/services/transacoes";
import { getMonth } from "@/hooks/get-month";
import Dashboard from "./dashboard"; // agora é Home, não Dashboard
import { getNewCategorias } from "@/app/services/categorias";

async function page(props: { params: { month: string } }) {
  const month = await getMonth(props);

  const lancamentos = await getTransactionsByResponsableVoce(month);
  // const boletos = await getBillsByResponsavel(month);
  const cartoes = await getCards();
  const categorias = await getNewCategorias();

  return (
    <div>
      <Dashboard
        month={month}
        lancamentos={lancamentos}
        // boletos={boletos}
        cartoes={cartoes}
        categorias={categorias}
      />
    </div>
  );
}

export default page;
