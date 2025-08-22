import Widget from "@/components/widget";
import { RiWalletLine } from "@remixicon/react";
import { PaymentWidget } from "../payment-widget";
import { buildPainelData } from "../utils";

export default async function PaymentFormsSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Formas de Pagamentos"
      subtitle="Principais Formas"
      information="Apenas transações do usuário"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-sky-400/10 p-1 text-sky-500">
          <RiWalletLine className="size-4" />
        </span>
      }
    >
      <PaymentWidget month={data.month} data={data.payment} />
    </Widget>
  );
}

