import Numbers from "@/components/numbers";
import Ping from "@/components/ping-icon";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import React from "react";
import Utils from "./utils";

const CardItem = React.memo(({ title, value, previousValue, color }) => (
  <Card>
    <CardHeader className="pb-2">
      <CardDescription className="flex items-center gap-1">
        <Ping color={color} />
        {title}
      </CardDescription>
      <CardTitle className="text-2xl">
        <Numbers number={value} />
      </CardTitle>
    </CardHeader>
    <CardContent className="text-xs text-muted-foreground">
      anterior <Numbers number={previousValue} />
    </CardContent>
  </Card>
));

CardItem.displayName = "CardItem";

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
      {cardData.map((card, index) => (
        <CardItem key={index} {...card} />
      ))}
      <Card className="from-thirdy-color/10 bg-gradient-to-br">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-1 pb-2">
            <Ping color="bg-black" />
            Saldo Atual
          </CardDescription>
          <CardTitle className="text-2xl">
            <Numbers number={saldo} />
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
