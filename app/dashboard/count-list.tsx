import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDownUp, CreditCard, File } from "lucide-react";
import { getBillsCount, getCardsCount, getTransactionsCount } from "../actions/dashboards";

async function CountList({ month }) {
  const transacoes = await getTransactionsCount(month);
  const boletos = await getBillsCount(month);
  const cartoes = await getCardsCount(month);

  return (
    <div className="grid grid-cols-1 gap-2">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center text-base gap-1">
            <ArrowDownUp size={16} />
            Transações
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transacoes?.map((item) => (
            <span className="text-2xl mt-4 text-muted-foreground block">{item.count}</span>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center text-base gap-1">
            <File size={16} />
            Boletos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {boletos?.map((item) => (
            <span className="text-2xl mt-4 text-muted-foreground block">{item.count}</span>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="flex items-center text-base gap-1">
            <CreditCard size={16} />
            Cartões
          </CardTitle>
        </CardHeader>
        <CardContent>
          {cartoes?.map((item) => (
            <span className="text-2xl mt-4 text-muted-foreground block">{item.count}</span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

export default CountList;
