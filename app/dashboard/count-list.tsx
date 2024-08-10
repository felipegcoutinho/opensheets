import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getTransactionsCount } from "../actions/dashboards";

async function CountList({ month }) {
  const transactions = await getTransactionsCount(month);

  return (
    <Card className="h-1/3">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">Transações</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground">
          {transactions?.map((item) => (
            <span className="text-xl">{item.count}</span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default CountList;
