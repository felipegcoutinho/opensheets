import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User } from "lucide-react";
import { getResponsavelBillList, getResponsavelTransactionList } from "../actions/users";

async function PageUsers({ month }) {
  const TransactionListMap = await getResponsavelTransactionList(month);
  const BillListMap = await getResponsavelBillList(month);

  // Cria um mapa para facilitar a busca dos valores de boletos
  const billMap = BillListMap.reduce((acc, item) => {
    acc[item.responsavel] = item.sum;
    return acc;
  }, {});

  return (
    <div className=" w-full">
      <div className="grid grid-cols-4 gap-4 mt-4">
        {TransactionListMap?.map((item) => (
          <CardComponent key={item.id} responsavel={item.responsavel} valorCartao={item.sum} valorBoleto={billMap[item.responsavel] || 0} />
        ))}
      </div>
    </div>
  );
}

export default PageUsers;

export function CardComponent({ id, responsavel, valorCartao, valorBoleto }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-2xl font-bold">{responsavel}</CardTitle>
        <User size={24} />
      </CardHeader>
      <CardContent>
        <p>Cartão: {valorCartao}</p>
        <p>Boleto: {valorBoleto}</p>
        <Separator className="my-4" />
        <div className="text-xl">Total: {valorCartao + valorBoleto}</div>
      </CardContent>
    </Card>
  );
}
