import Widget from "@/components/widget";
import { RiBankCardLine } from "@remixicon/react";
import InvoiceWidget from "../invoices-widget";
import { buildPainelData } from "../utils";

export default async function InvoicesSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Faturas"
      subtitle="faturas deste mês"
      information="Valor referente a transações de todos os responsáveis"
      icon={
        <span className="text-foreground inline-flex items-center justify-center rounded-md p-1">
          <RiBankCardLine className="size-4" />
        </span>
      }
    >
      <InvoiceWidget month={data.month} data={data.invoices} />
    </Widget>
  );
}
