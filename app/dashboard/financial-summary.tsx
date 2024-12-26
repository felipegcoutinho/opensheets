import CardSummary from "@/components/card-summary";
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
    previstoAnterior,
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
      previousValue: previstoAnterior,
      color: "bg-cyan-400",
    },
  ];

  return (
    <div className="grid w-full grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
      {cardData.map((item, index) => (
        <CardSummary
          color={item.color}
          previousValue={item.previousValue}
          title={item.title}
          value={item.value}
          key={index}
        />
      ))}
    </div>
  );
}
