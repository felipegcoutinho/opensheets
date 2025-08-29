import Widget from "@/components/widget";
import { RiArrowUpDownLine } from "@remixicon/react";
import RecentesTransactions from "../recents-transactions-widget";
import { buildPainelData } from "../utils";

export default async function RecentSection({ month }: { month: string }) {
  const data = await buildPainelData(month);
  return (
    <Widget
      title="Lançamentos Recentes"
      subtitle="Últimos 5 Lançamentos"
      information="Apenas transações do usuário"
      icon={
        <span className="bg-secondary text-primary mr-2 inline-flex items-center justify-center rounded-md p-1">
          <RiArrowUpDownLine className="size-4" />
        </span>
      }
    >
      <RecentesTransactions transactions={data.recentTransactions} />
    </Widget>
  );
}
