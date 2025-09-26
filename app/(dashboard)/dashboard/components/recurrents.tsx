import Widget from "@/components/widget";
import { RiRefreshLine } from "@remixicon/react";
import RecurrentsWidget from "../recurrents-widget";

export default async function RecurrentsSection({
  month,
}: {
  month: string;
}) {
  return (
    <Widget
      title="Lançamentos Recorrentes"
      subtitle="Assinaturas e despesas fixas"
      information="Baseado no período selecionado"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiRefreshLine className="size-4" />
        </span>
      }
    >
      <RecurrentsWidget month={month} />
    </Widget>
  );
}

