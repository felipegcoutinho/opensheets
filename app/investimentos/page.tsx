import Numbers from "@/components/Numbers";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { UseDates } from "@/hooks/UseDates";
import { getInvest } from "../actions/invest";
import InvestComponent from "./chart";
import CreateInvestimento from "./modal/create-invest";
import DeleteInvest from "./modal/delete-invest";
import UpdateInvest from "./modal/update-invest";

async function page() {
  const { DateFormat } = UseDates();
  const investData = await getInvest();

  const calculateDifference = (currentValue, previousValue) => {
    return currentValue - previousValue;
  };

  return (
    <div className="mt-4 w-full">
      <CreateInvestimento>
        <Button variant="default">Lançar Investimento</Button>
      </CreateInvestimento>

      <div className="w-full mt-4">
        <InvestComponent data={investData} />
      </div>

      <Table className="w-full mt-4">
        <TableHeader>
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Diferença</TableHead>
            <TableHead>Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {investData.map((item, index) => {
            const previousItem = investData[index - 1];
            const difference = previousItem ? calculateDifference(item.valor, previousItem.valor) : 0;

            // Classe CSS condicional com base na diferença
            const differenceClass = difference > 0 ? "text-green-500" : difference < 0 ? "text-red-500" : "text-black dark:text-white";

            return (
              <TableRow key={item.id} className="whitespace-nowrap">
                <TableCell className="font-bold">{item.id}</TableCell>
                <TableCell>{DateFormat(item.data)}</TableCell>
                <TableCell>
                  <Numbers number={item.valor} />
                </TableCell>
                <TableCell className={differenceClass}>
                  {difference ? difference.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "-"}
                </TableCell>
                <TableCell>
                  <UpdateInvest itemId={item.id} itemData={item.data} itemValor={item.valor} />
                  <span className="pl-2">
                    <DeleteInvest itemId={item.id} />
                  </span>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

export default page;
