import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import MoneyValues from "./money-values";
import Ping from "./ping-icon";
import { Badge } from "./ui/badge";

type Props = {
  title: string;
  value: number;
  previousValue: number;
  color: string;
};

export default function CardSummary({
  title,
  value,
  previousValue,
  color,
}: Props) {
  const isReceitaOuDespesa =
    title.toLowerCase() === "receitas" || title.toLowerCase() === "despesas";

  const diffPercent =
    previousValue !== 0 ? ((value - previousValue) / previousValue) * 100 : 0;

  const isPositive = diffPercent >= 0;

  return (
    <Card className="@container/card">
      <CardHeader className="relative pb-1">
        <CardDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ping color={color} />
            <span className="text-lg font-bold capitalize">{title}</span>
          </div>

          <div className="flex items-center">
            {isReceitaOuDespesa && (
              <Badge
                variant="outline"
                className={clsx(
                  "flex gap-1 rounded-lg text-xs",
                  isPositive ? "text-green-600" : "text-red-600",
                )}
              >
                {isPositive ? (
                  <TrendingUpIcon className="size-3" />
                ) : (
                  <TrendingDownIcon className="size-3" />
                )}
                {isPositive ? "+" : ""}
                {diffPercent.toFixed(0)}%
              </Badge>
            )}
          </div>
        </CardDescription>

        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-2xl">
          <MoneyValues value={value} />
        </CardTitle>
      </CardHeader>

      <CardFooter className="flex-col items-start gap-1 text-xs">
        <div className="text-muted-foreground font-bold">Último mês</div>
        <div className="text-muted-foreground">
          <MoneyValues value={previousValue} />
        </div>
      </CardFooter>
    </Card>
  );
}
