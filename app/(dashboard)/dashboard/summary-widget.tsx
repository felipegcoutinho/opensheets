import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RiArrowDownSFill, RiArrowUpSFill } from "@remixicon/react";
import MoneyValues from "../../../components/money-values";

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
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="font-normal capitalize">{title}</span>
          </span>

          <span className="flex items-center">
            {isReceitaOuDespesa && (
              <div
                className={`flex ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {isPositive ? (
                  <RiArrowUpSFill size={18} />
                ) : (
                  <RiArrowDownSFill size={18} />
                )}
                {isPositive ? "+" : ""}
                <span className="text-xs">{diffPercent.toFixed(0)}%</span>
              </div>
            )}
          </span>
        </CardTitle>

        <CardDescription className="text-2xl">
          <MoneyValues value={value} />
        </CardDescription>
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
