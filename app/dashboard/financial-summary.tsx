import CardSummary from "@/components/card-summary";
import Numbers from "@/components/numbers";
import Ping from "@/components/ping-icon";
import {
  Card,
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
    saldo,
  } = await Utils(month);

  const cardData = [
    {
      title: "Receitas",
      value: receitas,
      previousValue: receitasAnterior,
      color: "bg-green-400",
    },
    {
      title: "Despesas",
      value: despesasTotal,
      previousValue: despesasTotalAnterior,
      color: "bg-red-500",
    },
    {
      title: "Balanço",
      value: balanco,
      previousValue: balancoAnterior,
      color: "bg-yellow-400",
    },
    {
      title: "Saldo Previsto",
      value: previsto,
      previousValue: saldoAnterior,
      color: "bg-cyan-400",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
      {cardData.map((item, index) => (
        <CardSummary
          color={item.color}
          previousValue={item.previousValue}
          title={item.title}
          value={item.value}
          key={index}
        />
      ))}
      <Card className="bg-gradient-to-br from-tertiary-color/50">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1 pb-2">
            <Ping color="bg-black" />
            Saldo Atual
          </CardDescription>
          <CardTitle className="text-3xl">
            <Numbers number={saldo} />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
