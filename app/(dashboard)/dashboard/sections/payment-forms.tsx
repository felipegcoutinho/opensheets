import Widget from "@/components/widget";
import { RiWalletLine } from "@remixicon/react";
import { PaymentWidget } from "../payment-widget";
import { buildPainelData } from "../utils";

export default async function PaymentFormsSection({
  month,
}: {
  month: string;
}) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Formas de Pagamentos"
      subtitle="Principais Formas de pagamentos"
      information="Apenas transações do usuário"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiWalletLine className="size-4" />
        </span>
      }
    >
      <PaymentWidget month={data.month} data={data.payment} />
    </Widget>
  );
}
