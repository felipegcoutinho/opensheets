import MoneyValues from "@/components/money-values";
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { RiArrowDownCircleFill, RiArrowUpCircleFill, RiInformation2Fill } from "@remixicon/react";

type KPI = {
  title: string;
  value: number;
  previousValue: number;
  information: string;
};

export default function KpiCards({ items }: { items: KPI[] }) {
  return (
    <div className="my-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function KpiCard({ item }: { item: KPI }) {
  const showDelta = ["receitas", "despesas"].includes(item.title.toLowerCase());
  const diffPercent = item.previousValue !== 0 ? ((item.value - item.previousValue) / item.previousValue) * 100 : 0;
  const isPositive = diffPercent >= 0;

  return (
    <Card className="gap-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="capitalize">{item.title}</span>
            <Tooltip>
              <TooltipTrigger>
                <RiInformation2Fill size={16} className="text-muted-foreground/40" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.information}</p>
              </TooltipContent>
            </Tooltip>
          </span>

          {showDelta && (
            <span className={`flex items-center gap-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
              {isPositive ? <RiArrowUpCircleFill size={16} /> : <RiArrowDownCircleFill size={16} />}
              {isPositive ? "+" : ""}
              <span className="text-xs">{diffPercent.toFixed(0)}%</span>
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-2xl">
          <MoneyValues value={item.value} />
        </CardDescription>
      </CardHeader>
      <CardFooter className="text-muted-foreground flex-col items-start gap-1 text-xs">
        <span>Último mês</span>
        <span>
          <MoneyValues value={item.previousValue} />
        </span>
      </CardFooter>
    </Card>
  );
}

