import Widget from "@/components/widget";
import { RiWalletLine } from "@remixicon/react";
import { ConditionWidget } from "../condition-widget";
import { buildPainelData } from "../utils";

export default async function ConditionsSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Condições de Pagamento"
      subtitle="Principais Condições"
      information="Apenas transações do usuário"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-primary/10 p-1 text-primary">
          <RiWalletLine className="size-4" />
        </span>
      }
    >
      <ConditionWidget month={data.month} data={data.conditions} />
    </Widget>
  );
}

