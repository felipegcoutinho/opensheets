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
        <span className="mr-2 inline-flex items-center justify-center rounded-md bg-primary/10 p-1 text-primary">
          <RiArrowUpDownLine className="size-4" />
        </span>
      }
    >
      <RecentesTransactions transactions={data.recentTransactions} />
    </Widget>
  );
}

