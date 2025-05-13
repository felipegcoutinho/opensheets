import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import clsx from "clsx";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import MoneyValues from "../../../components/money-values";
import Ping from "../../../components/ping-icon";
import { Badge } from "../../../components/ui/badge";

type Props = {
  title: string;
  value: number;
  previousValue: number;
  color: string;
};

export default function SummaryWidget({
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
    <Card className="gap-2">
      <CardHeader>
        <CardDescription className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Ping color={color} />
            <span className="text-lg font-bold capitalize">{title}</span>
          </span>

          <span className="flex items-center">
            {isReceitaOuDespesa && (
              <Badge
                variant="outline"
                className={clsx(
                  "flex gap-1 text-xs",
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
          </span>
        </CardDescription>

        <CardTitle className="text-2xl font-semibold">
          <MoneyValues value={value} />
        </CardTitle>
      </CardHeader>

      <CardFooter className="text-muted-foreground flex-col items-start gap-1 text-xs">
        <span>Último mês</span>
        <span>
          <MoneyValues value={previousValue} />
        </span>
      </CardFooter>
    </Card>
  );
}
