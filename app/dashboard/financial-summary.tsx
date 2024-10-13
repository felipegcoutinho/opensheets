import Numbers from "@/components/numbers";
import Ping from "@/components/ping-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Utils from "./utils";

export default async function FinancialSummary({ month }) {
  const {
    receitas,
    receitasAnterior,
    despesasTotal,
    despesasTotalAnterior,
    balanco,
    balancoAnterior,
    previsto,
    saldoAnterior,
  } = await Utils(month);

  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1">
            <Ping color={"bg-green-400"} />
            Receitas
          </CardDescription>
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
          <CardDescription className="flex items-center gap-1">
            <Ping color={"bg-red-500"} />
            Despesas
          </CardDescription>
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
          <CardDescription className="flex items-center gap-1">
            <Ping color={"bg-yellow-400"} />
            Balanço
          </CardDescription>
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
          <CardDescription className="flex items-center gap-1">
            <Ping color={"bg-cyan-400"} />
            Previsto
          </CardDescription>
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
