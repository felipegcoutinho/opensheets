import Widget from "@/components/widget";
import { RiTimeLine } from "@remixicon/react";
import InstallmentsWidget from "../installments-widget";

export default async function InstallmentsSection({
  month,
}: {
  month: string;
}) {
  return (
    <Widget
      title="Lançamentos Parcelados"
      subtitle="Progresso das parcelas e término"
      information="Baseado no período selecionado"
      icon={
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-primary/10 p-1 text-primary">
          <RiTimeLine className="size-4" />
        </span>
      }
    >
      <InstallmentsWidget month={month} />
    </Widget>
  );
}

