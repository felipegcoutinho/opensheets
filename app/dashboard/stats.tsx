import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDownUp,
  CreditCard,
  File,
  Landmark,
  NotebookPenIcon,
} from "lucide-react";
import {
  getAccountsCount,
  getBillsCount,
  getCardsCount,
  getNotesCount,
  getTransactionsCount,
} from "../actions/dashboards";

const statsConfig = [
  { title: "Transações", icon: ArrowDownUp, getData: getTransactionsCount },
  { title: "Boletos", icon: File, getData: getBillsCount },
  { title: "Cartões", icon: CreditCard, getData: getCardsCount },
  { title: "Contas", icon: Landmark, getData: getAccountsCount },
  { title: "Anotações", icon: NotebookPenIcon, getData: getNotesCount },
];

const StatCard = ({ title, icon: Icon, count }) => (
  <Card>
    <CardHeader className="pb-0">
      <CardTitle className="flex items-center gap-1 text-sm uppercase dark:text-muted-foreground">
        <Icon size={14} />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent>
      <p className="mt-2 text-2xl">{count}</p>
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
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-5">
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
