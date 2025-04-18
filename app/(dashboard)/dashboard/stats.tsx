import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getNotesStats } from "@/services/anotacoes";
import { getBillsStats } from "@/services/boletos";
import { getCardsStats } from "@/services/cartoes";
import { getAccountsStats } from "@/services/contas";
import { getTransactionsStats } from "@/services/transacoes";
import {
  ArrowRightLeft,
  CreditCard,
  File,
  Landmark,
  NotebookPenIcon,
} from "lucide-react";

const statsConfig = [
  { title: "Lançamentos", icon: ArrowRightLeft, getData: getTransactionsStats },
  { title: "Boletos", icon: File, getData: getBillsStats },
  { title: "Cartões", icon: CreditCard, getData: getCardsStats },
  { title: "Contas", icon: Landmark, getData: getAccountsStats },
  { title: "Anotações", icon: NotebookPenIcon, getData: getNotesStats },
];

const StatCard = ({ title, icon: Icon, count }) => (
  <Card className="bg-accent flex items-center justify-between border-none p-6">
    <CardTitle className="dark:text-muted-foreground flex items-center gap-1">
      <Icon size={14} />
      {title}
    </CardTitle>
    <CardContent className="flex items-center p-0">
      <p className="text-3xl text-green-600">{count}</p>
    </CardContent>
  </Card>
);

async function Stats({ month }) {
  const statsData = await Promise.all(
    statsConfig.map(async ({ getData }) => {
      const data = await getData(month);
      return data?.[0]?.count ?? 0;
    }),
  );

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-2">
      {statsConfig.map(({ title, icon }, index) => (
        <StatCard
          key={title}
          title={title}
          icon={icon}
          count={statsData[index]}
        />
      ))}
    </div>
  );
}

export default Stats;
