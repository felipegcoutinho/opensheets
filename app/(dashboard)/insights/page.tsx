import { getBillsByResponsavel } from "@/app/services/boletos";
import { getCards } from "@/app/services/cartoes";
import { getTransactionsByResponsableVoce } from "@/app/services/transacoes";
import { getPeriodo } from "@/hooks/periodo";
import Dashboard from "./dashboard"; // agora é Home, não Dashboard

async function page(props) {
  const month = await getPeriodo(props);

  const lancamentos = await getTransactionsByResponsableVoce(month);
  const boletos = await getBillsByResponsavel(month);
  const cartoes = await getCards();

  return (
    <div>
      <Dashboard
        month={month}
        lancamentos={lancamentos}
        boletos={boletos}
        cartoes={cartoes}
      />
    </div>
  );
}

export default page;
