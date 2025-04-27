import { getBills } from "@/app/services/boletos";
import { getAccount } from "@/app/services/contas";
import { getPeriodo } from "@/hooks/periodo";
import CreateBills from "./modal/create-bills";
import TableBills from "./table-bills";
import { getNewCategorias } from "@/app/services/categorias";

async function page(props) {
  const month = await getPeriodo(props);

  const getBillsMap = await getBills(month);
  const getAccountMap = await getAccount();
  const getCategorias = await getNewCategorias();

  return (
    <div className="mt-4 w-full">
      <CreateBills
        getAccountMap={getAccountMap}
        getCategorias={getCategorias}
      />

      <TableBills
        getBillsMap={getBillsMap}
        getAccountMap={getAccountMap}
        getCategorias={getCategorias}
      />
    </div>
  );
}

export default page;
