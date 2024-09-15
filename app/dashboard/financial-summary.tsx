import Numbers from "@/components/numbers";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Utils from "./utils";

export default async function FinancialSummary({ month }) {
  const { receitas, receitasAnterior, despesasTotal, despesasTotalAnterior, balanco, balancoAnterior, previsto, saldoAnterior } = await Utils(month);

  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Receitas</CardDescription>
          <CardTitle className="text-2xl">
            <Numbers number={receitas} />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          anterior <Numbers number={receitasAnterior} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Despesas</CardDescription>
          <CardTitle className="text-2xl">
            <Numbers number={despesasTotal} />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          anterior <Numbers number={despesasTotalAnterior} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Balanço</CardDescription>
          <CardTitle className="text-2xl">
            <Numbers number={balanco} />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          anterior <Numbers number={balancoAnterior} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardDescription>Previsto</CardDescription>
          <CardTitle className="text-2xl">
            <Numbers number={previsto} />
          </CardTitle>
        </CardHeader>
        <CardContent className="text-xs text-muted-foreground">
          anterior <Numbers number={saldoAnterior} />
        </CardContent>
      </Card>
    </div>
  );
}
