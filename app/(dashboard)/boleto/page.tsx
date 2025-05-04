import { getBills } from "@/app/services/boletos";
import { getNewCategorias } from "@/app/services/categorias";
import { getAccount } from "@/app/services/contas";
import { Button } from "@/components/ui/button";
import { getMonth } from "@/hooks/get-month";
import CreateBills from "./modal/create-bills";
import TableBills from "./table-bills";

async function page(props) {
  const month = await getMonth(props);

  const getBillsMap = await getBills(month);
  const getAccountMap = await getAccount();
  const getCategorias = await getNewCategorias();

  return (
    <div className="mt-4 w-full">
      <CreateBills getAccountMap={getAccountMap} getCategorias={getCategorias}>
        <Button className="transition-all hover:scale-110">Novo Boleto</Button>
      </CreateBills>

      <TableBills
        getBillsMap={getBillsMap}
        getAccountMap={getAccountMap}
        getCategorias={getCategorias}
      />
    </div>
  );
}

export default page;
