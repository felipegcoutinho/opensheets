import MoneyValues from "@/components/money-values";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  RiArrowDownLine,
  RiArrowUpLine,
  RiInformation2Fill,
} from "@remixicon/react";
import { title_font } from "../../fonts/font";

type KPI = {
  title: string;
  value: number;
  previousValue: number;
  information: string;
};

export default function KpiCards({ items }: { items: KPI[] }) {
  return (
    <div className="my-2 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <KpiCard key={item.title} item={item} />
      ))}
    </div>
  );
}

function KpiCard({ item }: { item: KPI }) {
  const showDelta = ["receitas", "despesas"].includes(item.title.toLowerCase());
  const diffPercent =
    item.previousValue !== 0
      ? ((item.value - item.previousValue) / item.previousValue) * 100
      : 0;
  const isPositive = diffPercent >= 0;

  return (
    <Card className="gap-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className={`${title_font.className} capitalize`}>
              {item.title}
            </span>
            <Tooltip>
              <TooltipTrigger>
                <RiInformation2Fill
                  size={16}
                  className="text-muted-foreground/40"
                />
              </TooltipTrigger>
              <TooltipContent>
                <span>{item.information}</span>
              </TooltipContent>
            </Tooltip>
          </span>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 text-2xl">
          <MoneyValues value={item.value} />
          {showDelta && (
            <span
              className={`flex items-center ${isPositive ? "text-emerald-600" : "text-red-600"}`}
            >
              {isPositive ? (
                <RiArrowUpLine size={10} />
              ) : (
                <RiArrowDownLine size={10} />
              )}
              <span className="text-xs">{diffPercent.toFixed(0)}%</span>
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1 text-xs">
        <span>Último Mês</span>
        <MoneyValues value={item.previousValue} />
      </CardFooter>
    </Card>
  );
}
